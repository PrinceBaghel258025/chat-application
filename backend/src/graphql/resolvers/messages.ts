import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { GraphQLContext, MessagePopulated, MessageSentSubscriptionPayload, sendMessageArguments } from '../../utils/types'
import { userIsConversationParticipant} from '../../utils/functions'
import { conversationPopulated } from './conversation';
const resolvers = {
    Query: {
        messages: async (_ : any, args: {conversationId: string}, context : GraphQLContext) : Promise<Array<MessagePopulated>> => {
            const {prisma, session} = context;

            const { conversationId} = args;

            if(!session?.user) {
                throw new GraphQLError("Not Authorized");
            }

            const {user: { id: userId} } = session;

            /**
             * Verify that conversation exist ant  the user making query is a participant
             */

            const conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversationId
                },
                include: conversationPopulated
            });

            if(!conversation) {
                throw new GraphQLError("Conversation Not Found")
            }

            const allowedToView = userIsConversationParticipant(conversation.participants, userId);

            if(!allowedToView) {
                throw new GraphQLError("Not Authorized");
            }

            try {
                const messages = await prisma.message.findMany({
                    where: {
                        conversationId
                    },
                    include: messagePopulated,
                    orderBy: {
                        createdAt: "desc"
                    }
                })
                return messages;
            } catch (error: any) {
                console.log("messages error", error);
                throw new GraphQLError('messages error');
            }


            return []
        }
    },
    Mutation: {
        sendMessage: async (_: any, args: sendMessageArguments, context: GraphQLContext): Promise<boolean> => {
            const { session, prisma, pubsub } = context;

            if (!session?.user) {
                throw new GraphQLError("Not Authorized");
            }

            const { id: userId } = session.user;
            const { id: messageId, senderId, body, conversationId } = args

            if (userId !== senderId) {
                throw new GraphQLError("Not Authorized");
            }

            try {
                /**
                 * create new message entity
                 */

                const newMessage = await prisma.message.create({
                    data: {
                        id: messageId,
                        senderId,
                        conversationId,
                        body
                    },
                    include: messagePopulated
                })


                /**
                 * find conversationParticipant entity
                 */

                const participant = await prisma.conversationParticipant.findFirst({
                    where: {
                        userId,
                        conversationId
                    }
                });

                /**
                 * should always exist
                 */
                if(!participant) {
                    throw new GraphQLError("participant does not exist")
                }

                /**
                 * update conversation entity
                 */


                const conversation = await prisma.conversation.update({
                    where: {
                        id: conversationId
                    },
                    data: {
                        latestMessageId: newMessage.id,
                        participants: {
                            update: {
                                where: {
                                    id: participant.id
                                },
                                data: {
                                    hasSeenLatestMessage: true
                                }
                            },
                            updateMany: {
                                where: {
                                    NOT: {
                                        userId: senderId
                                    }
                                },
                                data: {
                                    hasSeenLatestMessage: false
                                }
                            }
                        }
                    },
                    include: conversationPopulated
                });

                // console.log("sendMessage mutationResolver",conversation)

                /**
                 * publish events to update conversation as well as for the new message
                 */

                pubsub.publish('MESSAGE_SENT', { sentMessage: newMessage });
                // pubsub.publish('CONVERSATION_UPDATED', {
                //     conversationUpdated: {
                //         conversation: conversation
                //     }
                // });




            } catch (error: any) {
                console.log("sendMessage mutation error", error);
                throw new GraphQLError("sending new message error")
            }





            return true;
        }
    },
    Subscription: {
        sentMessage: {
            subscribe: withFilter((_: any, __: any, context: GraphQLContext) => {
                const { pubsub } = context;

                return pubsub.asyncIterator(["MESSAGE_SENT"])
            }, (payload: MessageSentSubscriptionPayload, args: { conversationId: string }, context: GraphQLContext) => {
                // console.log("sentMessage Subscription", args.conversationId)
                // console.log("payload ",payload)
                return payload.sentMessage.conversationId === args.conversationId
            })
        }
    }
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
    sender: {
        select: {
            id: true,
            username: true
        }
    }
})

export default resolvers;