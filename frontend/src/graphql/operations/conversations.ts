import { gql } from "@apollo/client";
import { Prisma } from "@prisma/client";
import { messageFields } from "./messages";


const ConversationFields = `
    id 
    participants {
        user {
            id
            username
        }
        hasSeenLatestMessage
    }
    latestMessage {
        ${messageFields}
    }
    updatedAt

`

const conversations = {
    Queries: {
        conversations: gql`
        query Conversations {
            conversations {
            ${ConversationFields}
            }
        }
        `
    },
    Mutations: {
        createConversation: gql`
        mutation CreateConversation($participantIds: [String]){
            createConversation(participantIds : $participantIds) {
                conversationId
            }
        }
        `,
        markConversationAsRead: gql`
            mutation MarkConversationAsRead($userId: String, $conversationId: String) {
                markConversationAsRead(userId: $userId, conversationId: $conversationId)
            }
        `
    },
    Subscriptions: {
        conversationCreated: gql`
            subscription ConversationCreated {
                conversationCreated {
                    ${ConversationFields}
                }
            }
        `,
        conversationUpdated: gql`
            subscription ConversationUpdated {
                conversationUpdated {
                    conversation {
                        ${ConversationFields}
                    }
                }
            }
        `

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

export type ConversationPopulated = Prisma.ConversationGetPayload<{ include: typeof conversationPopulated }>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{ include: typeof participantPopulated }>
export default conversations;