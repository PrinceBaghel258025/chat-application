import gql from "graphql-tag";

const typeDefs = gql`
    scalar Date
    type Mutation {
        createConversation(participantIds:[String] ): createConversationResponse
    }
    type createConversationResponse {
        conversationId: String
    }

    
    type Participant {
        id: String
        user: User
        hasSeenLatestMessage: Boolean   
    }
    type Conversation {
        id: String
        latestMessage: Message
        participants: [Participant]
        createdAt: Date
        updatedAt: Date
    }
    type Query {
        conversations: [Conversation]
    }

    type Subscription {
        conversationCreated: Conversation
    }

    
`

export default typeDefs;