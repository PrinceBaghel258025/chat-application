import { gql } from "@apollo/client";

const user =   {
    Queries: {

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