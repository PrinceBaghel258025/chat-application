import gql from "graphql-tag";

const typeDefs = gql`
    scalar Date
    type Mutation {
        createConversation(participantIds:[String] ): createConversationResponse
    }

    type Mutation {
        markConversationAsRead(userId: String, conversationId: String) : Boolean
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

    type Subscription {
        conversationUpdated: conversationUpdatedSubscriptionPayload
    }

    type conversationUpdatedSubscriptionPayload {
        conversation: Conversation

    }

    
`

export default typeDefs;