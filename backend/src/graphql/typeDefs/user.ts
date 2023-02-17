import gql from 'graphql-tag'
// import { CreateUsernameResponse } from '../../utils/types';
const typeDefs = gql`
    type SearchedUser {
        id: String
        username: String
        image: String
    }

    type CreateUsernameResponse {
    success: Boolean,
    error: String
    }
    type Query {
        searchUsers(username: String!) : [SearchedUser]
    }
    type Mutation {
        createUsername(username: String!): CreateUsernameResponse
    }
    type User {
        id: String
        name: String
        email: String
        emailVerified: Boolean
        username: String
        image: String
    }
    
    
`;

export default typeDefs;