import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import "#config/index"
import cors from 'cors';
import database from "./config/db.config.js"
import mockData from "./utils/mock.js"


import schema from "./modules/index.js"

async function startApolloServer() {
    const app = express();
    app.use(express.static('uploads'));
    app.use(cors())
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        context: ({ req }) => {
            return req
        },
        csrfPrevention: false,
        schema,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
    });
    const db = await database()
    app.use((req, res, next) => {
        req.models = db.models
        req.sequelize = db
        next()
    })
    // await mockData({ sequelize: db })
    console.log('Mock data was loaded successfully.')

    await server.start();
    server.applyMiddleware({
        app,
        path: "/graphql"
    });
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 3500 }, resolve));
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}
startApolloServer()