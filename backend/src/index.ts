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
import { GraphQLContext, Session, SubscriptionContext } from './utils/types';
import { makeExecutableSchema } from 'graphql-tools';
import { PubSub } from 'graphql-subscriptions';



import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
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

  // Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql/subscriptions',
});

const prisma = new PrismaClient()
const pubsub = new PubSub();
  // Hand in the schema we just created and have the
// WebSocketServer start listening.
  const serverCleanup = useServer({ schema, context: (ctx : SubscriptionContext) => {

    if(ctx.connectionParams && ctx.connectionParams.session) {
      const {session} = ctx.connectionParams;

      return { session, prisma, pubsub} ;
    }
    return { session : null, prisma, pubsub}

  } }, wsServer);


  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
  
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  // Ensure we wait for our server to start
  await server.start();
  // context parameters
  const corsOptions = {
    // origin: process.env.BASE_URL,
    origin: 'http://localhost:3000',
    credentials: true,
  };



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
          prisma,
          pubsub
        }
      }
    }),
  );

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

main().catch(err => console.log(err))