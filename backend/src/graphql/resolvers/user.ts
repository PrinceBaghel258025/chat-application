import gql from "graphql-tag";
import { GraphQLContext } from "../../utils/types";
import { CreateUsernameResponse } from "../../utils/types";
const resolvers = {
    Query: {
        searchUser: async function createUsername() {
            console.log('createUsername mutation received');
        }
    },
    Mutation: {
        createUsername: async function CreateUsername(_: any,
            args: { username: string },
            context: GraphQLContext
        ): Promise<CreateUsernameResponse> {
            console.log('createUsername mutation received');
            const { session, prisma } = context;
            const { username } = args;
            if (!session?.user) {
                return {
                    error: "Not Authorized"
                }
            }
            const {id} = session?.user
            console.log(session?.user);
            try {
                // check if username is taken by another user
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username
                    }
                })

                if (existingUser) {
                    return {
                        error: "Username already taken. Try another Username"
                    };
                }

                // update username
                await prisma.user.update({
                    where: {
                        id,
                    },
                    data: {
                        username,
                    },
                });
                return { success: true }
            }
            catch (error : any) {
                console.log("CreateUsername error", error)
                return {
                    error: error?.message as string
                }
            }

        }
    }
};

export default resolvers;