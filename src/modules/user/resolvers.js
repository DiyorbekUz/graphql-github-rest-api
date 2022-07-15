import { UserInputError } from 'apollo-server-express'
import JWT from "../../utils/jwt.js"
import sha256 from "sha256"
import fetch from 'node-fetch'
import fs from 'fs'

export default {
    Query: {
        users: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, isAdmin } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }
            if(!isAdmin) {
                throw new UserInputError("You haven't this permission!")
            }
            const users = await req.models.User.findAll()
            return users
        },
        getHello: async(_, args, req) => {
            return "Hello World!"
        }
        
    },

    Mutation: {
        register: async(_, args, req) => {
            let { username, password,} = args
            let users = await req.models.User.findAll()

            username = username.trim()
            password = password.trim()
            if(
                !username ||
                username.length > 50
            ) {
                throw new UserInputError("The username cannot be empty!")
            }

            if(
                !password || password.length < 6 ||
                password.length > 50
            ) {
                throw new UserInputError("Invalid password!")
            }

            if(users.find(user => user.username == username)) {
                throw new UserInputError("The user Already exists!")
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agent = req.headers['user-agent']

            let insert = await req.models.User.create({
                user_name: username,
                user_password: sha256(password),
            })

            function get_random (list) {
                return list[Math.floor((Math.random()*list.length))];
            }
              
            const apiKeys = await req.models.API_KEYS.findAll()
            console.log(apiKeys, "salom");
            let key = get_random(apiKeys)
            console.log(key);

            return {
                    status: 200,
                    message: 'The user successfully registered!',
                    token: JWT.sign({ agent, ip, userId: insert.user_id, isAdmin: insert?.user_is_admin, }),
                    data: insert,
                    API_ID: key['api_key'],
                }

        },
        commits: async(_, args, req) => {
            const {token} = req.headers
            const {apiKey} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            const apikeys = await req.models.API_KEYS.findAll()

            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, isAdmin } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }

            const findData = apikeys.find(key => key.api_key === apiKey)
            if(!findData && !isAdmin) {
                throw new UserInputError("Invalid API Key!")
            }


            async function func(){
                const commitMessages = [];
                let data = await fetch(`https://api.github.com/repos/facebook/react/commits?per_page=100`, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `${process.env.TOKEN}` }
                })
                const json = await data.json()
                json.forEach(commit => commitMessages.push(commit.commit))
                fs.writeFileSync('./commits.json', JSON.stringify(commitMessages))
                return commitMessages
            }
            return {
                status: 200,
                message: 'OK',
                data: (await func())[0]
            }
        },

        login: async(_, args, req) => {
            let { username, password } = args
            const users = await req.models.User.findAll({
                where: {
                    user_name: username
                }
            })
            function get_random (list) {
                return list[Math.floor((Math.random()*list.length))];
            }
              
            const apiKeys = await req.models.API_KEYS.findAll()
            let key = get_random(apiKeys)
            // console.log(JSON.stringify(users, null, 2));
            if(!users.length) {
                throw new UserInputError("The user does not exist!")
            }
            const user = users[0]
            if(user.user_password != sha256(password)) {
                throw new UserInputError("Invalid password!")
            }
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agent = req.headers['user-agent']
            return {
                status: 200,
                message: 'The user successfully logged in!',
                token: JWT.sign({ agent, ip, isAdmin: user?.user_is_admin, }),
                data: user,
                API_KEY: key['api_key']
            }
        },
        add_admin: async(_, args, req) => {
            const {token} = req.headers
            const ipp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const agentt = req.headers['user-agent']
            if(!token) {
                throw new UserInputError("User is un authorizate!")
            }

            const {ip, agent, isAdmin } = JWT.verify(token)
            if(!(ipp === ip) || !(agent === agentt)) {
                throw new UserInputError("Token is invalid!")
            }
            if(!isAdmin) {
                throw new UserInputError("You haven't this permission!")
            }
            const {userId} = args
            const user = await req.models.User.findAll({
                where: {
                    user_id: userId
                }
            })
            if(!user.length) {
                throw new UserInputError("The user does not exist!")
            }
            const user_ = user[0]
            user_.user_is_admin = true
            await user_.save()
            return {
                status: 200,
                message: 'The user successfully added to admin!',
                data: user_
            }
        }
    },

    User: {
        userId: global => global.user_id,
        username: global => global.user_name,
        userCreatedAt: global => global.user_created_at,
        userIsAdmin: global => global.user_is_admin
    }
}