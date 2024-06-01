import { Country as CountryMapping } from './mapping.js'
import AppError from '../errors/AppError.js'

class Country {
    async getAll() {
        const countries = await CountryMapping.findAll({
            order: [
                ['name', 'ASC'],
            ],
        })
        return countries
    }

    async getOne(id) {
        const country = await CountryMapping.findByPk(id)
        if (!country) {
            throw new Error('Страна не найдена в БД')
        }
        return country
    }

    async create(data) {
        const {name} = data
        const exist = await CountryMapping.findOne({where: {name}})
        if (exist) {
            throw new Error('Такая страна уже есть')
        }
        const country = await CountryMapping.create({name})
        return country
    }

    async update(id, data) {
        const country = await CountryMapping.findByPk(id)
        if (!country) {
            throw new Error('Страна не найдена в БД')
        }
        const {name = country.name} = data
        await country.update({name})
        return country
    }

    async delete(id) {
        const country = await CountryMapping.findByPk(id)
        if (!country) {
            throw new Error('Страна не найдена в БД')
        }
        await country.destroy()
        return country
    }
}

export default new Country()