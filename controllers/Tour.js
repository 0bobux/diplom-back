import TourModel from '../models/Tour.js'
import AppError from "../errors/AppError.js"

class Tour {
    async getAll(req, res, next) {
        try {
            const {categoryId = null, countryId = null} = req.params
            let {limit = null, page = null} = req.query
            limit = limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3
            page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1
            const options = {categoryId, countryId, limit, page}
            const tours = await TourModel.getAll(options)
            res.json(tours)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id тура')
            }
            const tour = await TourModel.getOne(req.params.id)
            res.json(tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const tour = await TourModel.create(req.body, req.files?.image)
            res.json(tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id тура')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const tour = await TourModel.update(req.params.id, req.body, req.files?.image)
            res.json(tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id тура')
            }
            const tour = await TourModel.delete(req.params.id)
            res.json(tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new Tour()