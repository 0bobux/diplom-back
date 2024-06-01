import { BasketTour as BasketTourMapping } from './mapping.js'
import { Basket as BasketMapping } from './mapping.js'
import AppError from '../errors/AppError.js'

class BasketTour {
    async getAll(basketId) {
        const basket = await BasketMapping.findByPk(basketId)
        if (!basket) {
            throw new Error('Корзина не найдена в БД')
        }
        const items = await BasketTourMapping.findAll({where: {basketId}})
        return items
    }

    async getOne(basketId, tourId) {
        const basket = await BasketMapping.findByPk(basketId)
        if (!basket) {
            throw new Error('Корзина не найдена в БД')
        }
        const item = await BasketTourMapping.findOne({where: {basketId, tourId}})
        if (!item) {
            throw new Error('Тура нет в корзине')
        }
        return item
    }

    async create(basketId, data) {
        const basket = await BasketMapping.findByPk(basketId)
        if (!basket) {
            throw new Error('Корзина не найдена в БД')
        }
        const {quantity = 1} = data
        const item = await BasketTourMapping.create({basketId, tourId, quantity})
        return item
    }

    async update(basketId, tourId, data) {
        const basket = await BasketMapping.findByPk(basketId)
        if (!basket) {
            throw new Error('Корзина не найдена в БД')
        }
        const item = await BasketTourMapping.findOne({where: {basketId, tourId}})
        if (!item) {
            throw new Error('Тура нет в корзине')
        }
        if (data.quantity) {
            await item.update({quantity})
        } else if (data.increment) {
            await item.increment('quantity', {by: data.increment})
        } else if (data.decrement) {
            await item.decrement('quantity', {by: data.decrement})
        }
        return item
    }

    async delete(basketId, tourId) {
        const basket = await BasketMapping.findByPk(basketId)
        if (!basket) {
            throw new Error('Корзина не найдена в БД')
        }
        const item = await BasketTourMapping.findOne({where: {basketId, tourId}})
        if (!item) {
            throw new Error('Тура нет в корзине')
        }
        await item.destroy()
        return item
    }
}

export default new BasketTour()