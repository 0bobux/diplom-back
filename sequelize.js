import {Sequelize} from 'sequelize'

export default new Sequelize(
    process.env.DB_NAME, // база данных
    process.env.DB_USER, // пользователь
    process.env.DB_PASS, // пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        define: {
            underscored: true, // использовать snake_case вместо camelCase для полей таблиц БД
            timestamps: false, // не добавлять поля created_at и updated_at при создании таблиц
        }
    }
)