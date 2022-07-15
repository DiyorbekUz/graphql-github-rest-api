import { UserInputError } from 'apollo-server-express'
import JWT from "../../utils/jwt.js"
import sha256 from "sha256"
import randomstring from "randomstring"

export default {
    Query: {
        api_keys: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, userId, isAdmin } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }

            if(!isAdmin) {
                throw new UserInputError("You haven't this permission!")
            }

            const api_keys = await req.models.API_KEYS.findAll()
            return api_keys

        }

    },

    Mutation: {
        api_key: async(_, args, req) => {
            let { api_key, generate } = args
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, userId, isAdmin } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }

            if(!isAdmin) {
                throw new UserInputError("You haven't this permission!")
            }

            if(!api_key && !generate) {
                throw new UserInputError("The api_key cannot be empty!")
            }else{
                if(generate) {
                    api_key = randomstring.generate(20)
                    let apikey = await req.models.API_KEYS.create({
                        api_key: api_key,
                    })

                    return {
                        status: 200,
                        message: "API KEY created successfully!",
                        data: apikey
                    }

                }

                if(api_key){
                    if(
                        api_key.length < 6 ||
                        api_key.length > 50
                    ) {
                        throw new UserInputError("Invalid API KEY!")
                    }

                    const api_keys = await req.models.API_KEYS.findAll()
                    if(api_keys.find(api_key => api_key.api_key == api_key)) {
                        throw new UserInputError("The API KEY Already exists!")
                    }
                    let apikey = await req.models.API_KEYS.create({
                        api_key: api_key,
                    })

                    return {
                        status: 200,
                        message: "API KEY created successfully!",
                        data: apikey
                    }
        
                }
    
            }
        },

        delete_api: async(_, args, req) => {
            let { apiId } = args
            const {token} = req.headers

            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, userId, isAdmin } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }

            if(!isAdmin) {
                throw new UserInputError("You haven't this permission!")
            }

            const api_key = await req.models.API_KEYS.findOne({
                where: {
                    api_id: apiId
                }
            })

            if(!api_key) {
                throw new UserInputError("The API KEY doesn't exists!")
            }

            await api_key.destroy()
            return {
                status: 200,
                message: "API KEY deleted successfully!",
                data: api_key
            }

        },

        
    },

    API_KEY: {
        apiId: global => global.api_id,
        apiKey: global => global.api_key,
        apiCreatedAt: global => global.api_created_at,
    }
}