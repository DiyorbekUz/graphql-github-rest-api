export default async function ({ sequelize }) {
    // mock user data
    const user = await sequelize.models.User.bulkCreate([
        { user_name: 'admin', user_password: '25f43b1486ad95a1398e3eeb3d83bc4010015fcc9bedb35b432e00298d5021f7', user_is_admin: true},
        { user_name: 'javohir', user_password: '88352a08f28e611a4780fc24f5f5216b9c5aa633eb1ea422f251a70b2ec7c7bf', user_is_admin: false},
    ])

    const api_keys = await sequelize.models.API_KEYS.bulkCreate([
        { api_key: '12345678'},
    ])

} 