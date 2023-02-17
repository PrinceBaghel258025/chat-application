import gql from 'graphql-tag'
// import { CreateUsernameResponse } from '../../utils/types';
const typeDefs = gql`
    type User {
        id: String
        username: String
        image: String
    }
    type CreateUsernameResponse {
    success: Boolean,
    error: String
    }
    type Query {
        searchUsers(username: String!) : [User]
    }
    type Mutation {
        createUsername(username: String!): CreateUsernameResponse
    }
    
    
`;

export default typeDefs;