import { makeExecutableSchema } from '@graphql-tools/schema'

import TypeModule from './types/index.js'
import UserModule from './user/index.js'
import AdminModule from './admin/index.js'

export default makeExecutableSchema({
    typeDefs: [
        TypeModule.typeDefs,
        UserModule.typeDefs,
        AdminModule.typeDefs,
    ],
    resolvers: [
        TypeModule.resolvers,
        UserModule.resolvers,
        AdminModule.resolvers,
    ],
})