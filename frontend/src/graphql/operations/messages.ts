import { gql } from "@apollo/client";

export const messageFields = `
id
sender {
    id 
    username
}
body
createdAt
`;

const  messageOperations =  {
    Queries : {
        messages: gql`
            query Messages($conversationId: String) {
                messages(conversationId: $conversationId) {
                    ${messageFields}
                }
            }
        `
    },
    Mutations: {
        sendMessage: gql`
        mutation SendMessage($id: String, $conversationId: String, $senderId: String, $body: String){
            sendMessage(id: $id, conversationId: $conversationId, senderId: $senderId, body: $body) 
        }
        
        `
    },
    Subscriptions: {
        sentMessage: gql`
            subscription SentMessage($conversationId: String!) {
                sentMessage(conversationId: $conversationId) {
                    ${messageFields}
                }
            }
        `
    }
        
}

export default messageOperations;