import { Basket as BasketMapping } from './mapping.js'
import { Tour as TourMapping } from './mapping.js'
import { BasketTour as BasketTourMapping } from './mapping.js'
import AppError from '../errors/AppError.js'

const pretty = (basket) => {
    const data = {}
    data.id = basket.id
    data.tours = []
    if (basket.tours) {
        data.tours = basket.tours.map(item => {
            return {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.basket_tour.quantity
            }
        })
    }
    return data
}

class Basket {
    async getOne(basketId) {
        let basket = await BasketMapping.findByPk(basketId, {
            attributes: ['id'],
            include: [
                {model: TourMapping, attributes: ['id', 'name', 'price']},
            ],
        })
        if (!basket) {
            basket = await BasketMapping.create()
        }
        return pretty(basket)
    }

    async create() {
        const basket = await BasketMapping.create()
        return pretty(basket)
    }

    async append(basketId, tourId, quantity) {
        let basket = await BasketMapping.findByPk(basketId, {
            attributes: ['id'],
            include: [
                {model: TourMapping, attributes: ['id', 'name', 'price']},
            ]
        })
        if (!basket) {
            basket = await BasketMapping.create()
        }
        // проверяем, есть ли уже этот тур в корзине
        const basket_tour = await BasketTourMapping.findOne({
            where: {basketId, tourId}
        })
        if (basket_tour) { // есть в корзине
            await basket_tour.increment('quantity', {by: quantity})
        } else { // нет в корзине
            await BasketTourMapping.create({basketId, tourId, quantity})
        }
        // обновим объект корзины, чтобы вернуть свежие данные
        await basket.reload()
        return pretty(basket)
    }

    async increment(basketId, tourId, quantity) {
        let basket = await BasketMapping.findByPk(basketId, {
            include: [{model: TourMapping, as: 'tours'}]
        })
        if (!basket) {
            basket = await BasketMapping.create()
        }
        // проверяем, есть ли этот тур в корзине
        const basket_tour = await BasketTourMapping.findOne({
            where: {basketId, tourId}
        })
        if (basket_tour) {
            await basket_tour.increment('quantity', {by: quantity})
            // обновим объект корзины, чтобы вернуть свежие данные
            await basket.reload()
        }
        return pretty(basket)
    }

    async decrement(basketId, tourId, quantity) {
        let basket = await BasketMapping.findByPk(basketId, {
            include: [{model: TourMapping, as: 'tours'}]
        })
        if (!basket) {
            basket = await Basket.create()
        }
        // проверяем, есть ли этот тур в корзине
        const basket_tour = await BasketTourMapping.findOne({
            where: {basketId, tourId}
        })
        if (basket_tour) {
            if (basket_tour.quantity > quantity) {
                await basket_tour.decrement('quantity', {by: quantity})
            } else {
                await basket_tour.destroy()
            }
            // обновим объект корзины, чтобы вернуть свежие данные
            await basket.reload()
        }
        return pretty(basket)
    }

    async remove(basketId, tourId) {
        let basket = await BasketMapping.findByPk(basketId, {
            include: [{model: TourMapping, as: 'tours'}]
        })
        if (!basket) {
            basket = await Basket.create()
        }
        // проверяем, есть ли этот тур в корзине
        const basket_tour = await BasketTourMapping.findOne({
            where: {basketId, tourId}
        })
        if (basket_tour) {
            await basket_tour.destroy()
            // обновим объект корзины, чтобы вернуть свежие данные
            await basket.reload()
        }
        return pretty(basket)
    }

    async clear(basketId) {
        let basket = await BasketMapping.findByPk(basketId, {
            include: [{model: TourMapping, as: 'tours'}]
        })
        if (basket) {
            await BasketTourMapping.destroy({where: {basketId}})
            // обновим объект корзины, чтобы вернуть свежие данные
            await basket.reload()
        } else {
            basket = await Basket.create()
        }
        return pretty(basket)
    }

    async delete(basketId) {
        const basket = await BasketMapping.findByPk(basketId, {
            include: [{model: TourMapping, as: 'tours'}]
        })
        if (!basket) {
            throw new Error('Корзина не найдена в БД')
        }
        await basket.destroy()
        return pretty(basket)
    }
}

export default new Basket()