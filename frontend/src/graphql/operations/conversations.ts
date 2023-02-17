import { gql } from "@apollo/client";

const conversations = {
    Queries: {},
    Mutations: {
        createConversation: gql`
        mutation CreateConversation($participantIds: [String]){
            createConversation(participantIds : $participantIds) {
                conversationId
            }
        }
        `,
    },
    
}

export default conversations;