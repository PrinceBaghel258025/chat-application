import gql from "graphql-tag";


const resolver = {
    Mutation : {
        createConversation: async () => {
            console.log('createConversation has been hit')
        }
    }
}

export default resolver;