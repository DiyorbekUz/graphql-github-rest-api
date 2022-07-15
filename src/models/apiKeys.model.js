import { Model, DataTypes } from 'sequelize';

export default async function ({sequelize}) {
    class API_KEYS extends Model {}

    API_KEYS.init({
        api_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
         
        api_key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
         
    }, {
        tableName: 'api_keys',
        modelName: 'API_KEYS',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        underscored: true, 
        sequelize,
        logging: false
    })
}