import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import gql from "graphql-tag";
import { GraphQLContext } from "../../utils/types";


const resolver = {
    Mutation: {
        createConversation: async (_: any, args: { participantIds: Array<string> },
            context: GraphQLContext): Promise<{conversationId: string}> => {

            const { participantIds } = args;
            // console.log(participantIds)
            const { prisma, session } = context;

            if (!session?.user) {
                throw new GraphQLError("Not Authorized")
            }

            const { user: { id: userId } } = session;
            // console.log(userId)

            try {
                const conversation = await prisma.conversation.create({
                    data: {
                        participants: {
                            createMany: {
                                data: participantIds.map(id => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId
                                }))
                            }
                        }
                    },
                    include: conversationPopulated
                })


                // emit a conversation created event using pubsub

                return {
                    conversationId: conversation.id
                }


            } catch (error: any) {
                console.log("createConversation error", error);
                throw new GraphQLError("Error Creating Conversation");
            }
            console.log(args);
            console.log('createConversation has been hit')
        }
    }
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
        select: {
            id: true,
            username: true
        }
    }
})

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
        include: participantPopulated
    },
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    }
})

export default resolver;