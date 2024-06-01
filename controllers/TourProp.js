import TourPropModel from '../models/TourProp.js'
import AppError from '../errors/AppError.js'

class TourProp {
    async getAll(req, res, next) {
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            const properties = await TourPropModel.getAll(req.params.tourId);
            res.json(properties)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            if (!req.params.id) {
                throw new Error('Не указано id свойства')
            }
            const property = await TourPropModel.getOne(req.params.tourId, req.params.id)
            res.json(property)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const property = await TourPropModel.create(req.params.tourId, req.body)
            res.json(property)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            if (!req.params.id) {
                throw new Error('Не указано id свойства')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const property = await TourPropModel.update(req.params.tourId, req.params.id, req.body)
            res.json(property)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.tourId) {
                throw new Error('Не указан id тура')
            }
            if (!req.params.id) {
                throw new Error('Не указано id свойства')
            }
            const property = await TourPropModel.delete(req.params.tourId, req.params.id)
            res.json(property)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new TourProp()