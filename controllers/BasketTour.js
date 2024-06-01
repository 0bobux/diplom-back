import BasketTourModel from '../models/BasketTour.js'
import AppError from '../errors/AppError.js'

const check = async (req, res, next) => {
    try {
        if (!req.signedCookies.basketId) {
            throw new Error('Корзина еще не создана')
        }
        const exist = await BasketModel.isExist(req.signedCookies.basketId)
        if (!exist) {
            res.clearCookie('basketId')
            throw new Error('Корзина не найдена в БД')
        }
    } catch(e) {
        next(AppError.badRequest(e.message))
    }
}

class BasketTour {
    async getAll(req, res, next) {
        await check(req, res, next) // проверяем существование корзины
        try {
            const tours = await BasketTourModel.getAll(req.signedCookies.basketId)
            res.json(tours)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        await check(req, res, next) // проверяем существование корзины
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            const item = await BasketTourModel.create(
                req.signedCookies.basketId,
                req.params.tourId,
                req.body
            )
            res.json(item)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        await check(req, res, next) // проверяем существование корзины
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            const item = await BasketTourModel.update(
                req.signedCookies.basketId,
                req.params.tourId,
                req.body
            )
            res.json(item)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        await check(req, res, next) // проверяем существование корзины
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            const item = await BasketTourModel.delete(
                req.signedCookies.basketId,
                req.params.tourId,
            )
            res.json(item)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new BasketTour()