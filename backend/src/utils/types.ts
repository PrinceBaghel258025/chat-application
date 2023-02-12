import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
// import { Session } from "next-auth";

export interface GraphQLContext{
    session: Session | null,
    prisma: PrismaClient
}

export interface CreateUsernameResponse {
    success?: Boolean,
    error?: String
}

export interface Session{
    user: User
    expires: ISODateString
}

export interface User {
    id: string
    username: string
    email: string
    emailVerified: boolean
    name: string
    image: string
}
