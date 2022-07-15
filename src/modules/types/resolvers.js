export default {

    GlobalType: {
        __resolveType: object => {
            if (object.user_name) return 'User'
            if(object.api_key) return 'API_KEY'
            if(object.message) return 'Commits'
            return null
        }
    }
}