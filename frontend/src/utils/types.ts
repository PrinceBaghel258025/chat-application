
// data received from graphql server when creating username
export interface createUsernameData  {
    createUsername: {
        success: boolean
        error: string
    };
}

export interface createUsernameVariables {
   username: string
}