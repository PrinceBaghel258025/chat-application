import gql from "graphql-tag";
import { User } from "@prisma/client";
import { GraphQLContext} from "../../utils/types";
import { CreateUsernameResponse } from "../../utils/types";
import { GraphQLError } from "graphql";
const resolvers = {
    Query: {
        searchUsers: async function SearchUsers (
            _: any,
            args: {username: string},
            context: GraphQLContext
        ) : Promise<Array<User>> {
            const {username : searchedUsername} = args;
            const {prisma, session } = context;

            if(!session?.user) {
                throw new GraphQLError("Not Authorised");
            }
            const {user: {username: myUsername}} = session;

            try{

                const users = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: searchedUsername,
                            not: myUsername,
                            mode: "insensitive"
                        }
                    }
                })
                return users;

            } catch(error: any) {
                console.log("error", error);
                throw new GraphQLError(error?.message) // dont know where to catch
            }
            console.log(myUsername)
            console.log("searchUsers query received")
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
            const { id } = session?.user
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
            catch (error: any) {
                console.log("CreateUsername error", error)
                return {
                    error: error?.message as string
                }
            }

        }
    }
};

export default resolvers;