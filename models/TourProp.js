import { TourProp as TourPropMapping } from './mapping.js'
import { Tour as TourMapping } from './mapping.js'
import AppError from '../errors/AppError.js'

class TourProp {
    async getAll(tourId) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const properties = await TourPropMapping.findAll({where: {tourId}})
        return properties
    }

    async getOne(tourId, id) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const property = await TourPropMapping.findOne({where: {tourId, id}})
        if (!property) {
            throw new Error('Свойство тура не найдено в БД')
        }
        return property
    }

    async create(tourId, data) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const {name, value} = data
        const property = await TourPropMapping.create({name, value, tourId})
        return property
    }

    async update(tourId, id, data) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const property = await TourPropMapping.findOne({where: {tourId, id}})
        if (!property) {
            throw new Error('Свойство тура не найдено в БД')
        }
        const {name = property.name, value = property.value} = data
        await property.update({name, value})
        return property
    }

    async delete(tourId, id) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const property = await TourPropMapping.findOne({where: {tourId, id}})
        if (!property) {
            throw new Error('Свойство тура не найдено в БД')
        }
        await property.destroy()
        return property
    }
}

export default new TourProp()