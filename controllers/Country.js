import CountryModel from '../models/Country.js'
import AppError from '../errors/AppError.js'

class Country {
    async getAll(req, res, next) {
        try {
            const countries = await CountryModel.getAll()
            res.json(countries)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id страны')
            }
            const country = await CountryModel.getOne(req.params.id)
            res.json(country)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (!req.body.name) {
                throw new Error('Нет названия страны')
            }
            const country = await CountryModel.create(req.body)
            res.json(country)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id страны')
            }
            if (!req.body.name) {
                throw new Error('Нет названия страны')
            }
            const country = await CountryModel.update(req.params.id, req.body)
            res.json(country)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id страны')
            }
            const country = await CountryModel.delete(req.params.id)
            res.json(country)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new Country()