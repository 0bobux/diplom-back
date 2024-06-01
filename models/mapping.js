import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database

// модель «Пользователь», таблица БД «users»
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
})

// модель «Корзина», таблица БД «baskets»
const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// связь между корзиной и турами через промежуточную таблицу «basket_tour»
// у этой таблицы будет составной первичный ключ (basket_id + tour_id)
const BasketTour = sequelize.define('basket_tour', {
    quantity: {type: DataTypes.INTEGER, defaultValue: 1},
})


// модель «Тур», таблица БД «tour»
const Tour = sequelize.define('tour', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    image: {type: DataTypes.STRING, allowNull: false},
})

// модель «Категория», таблица БД «categories»
const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

// модель «Страна», таблица БД «country»
const Country = sequelize.define('country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

// связь между туром и пользователем через промежуточную таблицу «rating»
// у этой таблицы будет составной первичный ключ (tour_id + user_id)
const Rating = sequelize.define('rating', {
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

// свойства туров, у одного тура может быть много свойств
const TourProp = sequelize.define('tour_prop', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false},
})

// модель «Заказ», таблица БД «orders»
const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    amount: {type: DataTypes.INTEGER, allowNull: false},
    status: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    comment: {type: DataTypes.STRING},
    prettyCreatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
            const value = this.getDataValue('createdAt')
            const day = value.getDate()
            const month = value.getMonth() + 1
            const year = value.getFullYear()
            const hours = value.getHours()
            const minutes = value.getMinutes()
            return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
        }
    },
    prettyUpdatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
            const value = this.getDataValue('updatedAt')
            const day = value.getDate()
            const month = value.getMonth() + 1
            const year = value.getFullYear()
            const hours = value.getHours()
            const minutes = value.getMinutes()
            return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
        }
    },
})

// позиции заказа, в одном заказе может быть несколько позиций
const OrderItem = sequelize.define('order_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
})

/*
 * Описание связей
 */

// связь many-to-many туров и корзин через промежуточную таблицу basket_tour;
// тур может быть в нескольких корзинах, в корзине может быть несколько туров
Basket.belongsToMany(Tour, { through: BasketTour, onDelete: 'CASCADE' })
Tour.belongsToMany(Basket, { through: BasketTour, onDelete: 'CASCADE' })

// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
Basket.hasMany(BasketTour)
BasketTour.belongsTo(Basket)
Tour.hasMany(BasketTour)
BasketTour.belongsTo(Tour)

// связь категории с турами: в категории может быть несколько туров, но
// каждый тур может принадлежать только одной категории
Category.hasMany(Tour, {onDelete: 'RESTRICT'})
Tour.belongsTo(Category)

// связь страны с турами: в стране может быть много туров, но каждый тур
// может принадлежать только одной стране
Country.hasMany(Tour, {onDelete: 'RESTRICT'})
Tour.belongsTo(Country)

// связь many-to-many туров и пользователей через промежуточную таблицу rating;
// за один тур могут проголосовать несколько зарегистрированных пользователей,
// один пользователь может проголосовать за несколько туров
Tour.belongsToMany(User, {through: Rating, onDelete: 'CASCADE'})
User.belongsToMany(Tour, {through: Rating, onDelete: 'CASCADE'})

// super many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
// это обеспечит возможность любых include при запросах findAll, findOne, findByPk
Tour.hasMany(Rating)
Rating.belongsTo(Tour)
User.hasMany(Rating)
Rating.belongsTo(User)

// связь тура с его свойствами: у тура может быть несколько свойств, но
// каждое свойство связано только с одним туром
Tour.hasMany(TourProp, {as: 'props', onDelete: 'CASCADE'})
TourProp.belongsTo(Tour)

// связь заказа с позициями: в заказе может быть несколько позиций, но
// каждая позиция связана только с одним заказом
Order.hasMany(OrderItem, {as: 'items', onDelete: 'CASCADE'})
OrderItem.belongsTo(Order)

// связь заказа с пользователями: у пользователя может быть несколько заказов,
// но заказ может принадлежать только одному пользователю
User.hasMany(Order, {as: 'orders', onDelete: 'SET NULL'})
Order.belongsTo(User)

export {
    User,
    Basket,
    Tour,
    Category,
    Country,
    Rating,
    BasketTour,
    TourProp,
    Order,
    OrderItem
}