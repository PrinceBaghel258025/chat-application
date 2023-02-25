import { gql } from "@apollo/client";
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
        `
    }

}

export default conversations;