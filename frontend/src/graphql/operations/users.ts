import { gql } from "@apollo/client";

const user =   {
    Queries: {
      searchUsers: gql`
        query SearchUsers($username: String!) {
          searchUsers(username: $username) {
            username,
            id,
            image
          }
        }
      `
    },
    Mutations: {
        createUsername: gql`
          mutation CreateUsername($username: String!) {
            createUsername(username: $username) {
              success
              error
            }
          }
        `,
      }
}

export default user;