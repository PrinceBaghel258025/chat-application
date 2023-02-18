import { ConversationPopulated } from '../../../backend/src/utils/types'

/*
users
*/
// data received from graphql server when creating username
export interface createUsernameData {
    createUsername: {
        success: boolean
        error: string
    };
}

export interface createUsernameVariables {
    username: string
}

export interface searchUsersData {
    searchUsers: Array<SearchedUser>
}
export interface SearchedUser {
    id: string
    username: string
    image: string
}

export interface searchUsersVariables {
    username: string
}

/*
* conversations
*/

export interface createConversationData {
    createConversation: {
        conversationId: string
    }
}

export interface createConversationVariables {
    participantIds: Array<string>
}

export interface ConversationsData {
    conversations: Array<ConversationPopulated>
}