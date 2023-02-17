// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { PrismaClient } from "@prisma/client";
import { getSession } from 'next-auth/react';
import { GraphQLContext, Session } from './utils/types';
import { makeExecutableSchema } from 'graphql-tools';
interface MyContext {
  token?: string;
}
const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })
  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Ensure we wait for our server to start
  await server.start();
  // context parameters
  const corsOptions = {
    // origin: process.env.BASE_URL,
    origin: 'http://localhost:3000',
    credentials: true,
  };
  const prisma = new PrismaClient()
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getSession({ req })
        // console.log("index.ts main", session)
        return {
          session: session as Session,
          prisma
        }
      }
    }),
  );

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

main().catch(err => console.log(err))