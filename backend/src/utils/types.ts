import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { Context } from "graphql-ws/lib/server";
import { conversationPopulated, participantPopulated } from "../graphql/resolvers/conversation";
import { PubSub } from 'graphql-subscriptions';
// import { Session } from "next-auth";


/**
 * Server Configuration
 * 
 */

export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session
    }

}
export interface GraphQLContext {
    session: Session | null,
    prisma: PrismaClient
    pubsub : PubSub
}

export interface CreateUsernameResponse {
    success?: Boolean,
    error?: String
}

export interface Session {
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

export interface SearchedUser {

}

/**
 * Conversation
 */

export type ConversationPopulated = Prisma.ConversationGetPayload<{ include: typeof conversationPopulated }>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{include: typeof participantPopulated}>
