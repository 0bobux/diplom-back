import { Tour as TourMapping } from './mapping.js'
import { TourProp as TourPropMapping } from './mapping.js'
import { Country as CountryMapping } from './mapping.js'
import { Category as CategoryMapping } from './mapping.js'
import AppError from '../errors/AppError.js'
import FileService from '../services/File.js'

class Tour {
    async getAll(options) {
        const {categoryId, countryId, limit, page} = options
        const offset = (page - 1) * limit
        const where = {}
        if (categoryId) where.categoryId = categoryId
        if (countryId) where.countryId = countryId
        const tours = await TourMapping.findAndCountAll({
            where,
            limit, 
            offset,
            // для каждого тура получаем страну и категорию
            include: [
                {model: CountryMapping, as: 'country'},
                {model: CategoryMapping, as: 'category'}
            ],
            order: [
                ['name', 'ASC'],
            ],
        })
        return tours
    }

    async getOne(id) {
        const tour = await TourMapping.findByPk(id, {
            include: [
                {model: TourPropMapping, as: 'props'},
                {model: CountryMapping, as: 'country'},
                {model: CategoryMapping, as: 'category'},
            ]
        })
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        return tour
    }

    async create(data, img) {
        // поскольку image не допускает null, задаем пустую строку
        const image = FileService.save(img) ?? ''
        const {name, price, categoryId = null, countryId = null} = data
        const tour = await TourMapping.create({name, price, image, categoryId, countryId})
        if (data.props) { // свойства тура
            const props = JSON.parse(data.props)
            for (let prop of props) {
                await TourPropMapping.create({
                    name: prop.name,
                    value: prop.value,
                    tourId: tour.id
                })
            }
        }
        // возвращать будем товар со свойствами
        const created = await TourMapping.findByPk(tour.id, {
            include: [{model: TourPropMapping, as: 'props'}]
        })
        return created
    }

    async update(id, data, img) {
        const tour = await TourMapping.findByPk(id, {
            include: [{model: TourPropMapping, as: 'props'}]
        })
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        // пробуем сохранить изображение, если оно было загружено
        const file = FileService.save(img)
        // если загружено новое изображение — надо удалить старое
        if (file && tour.image) {
            FileService.delete(tour.image)
        }
        // подготавливаем данные, которые надо обновить в базе данных
        const {
            name = tour.name,
            price = tour.price,
            categoryId = tour.categoryId,
            countryId = tour.countryId,
            image = file ? file : tour.image
        } = data
        await tour.update({name, price, categoryId, image, countryId})
        if (data.props) { // свойства тура
            // удаляем старые и добавляем новые
            await TourPropMapping.destroy({where: {tourId: id}})
            const props = JSON.parse(data.props)
            for (let prop of props) {
                await TourPropMapping.create({
                    name: prop.name,
                    value: prop.value,
                    tourId: tour.id
                })
            }
        }
        // обновим объект тура, чтобы вернуть свежие данные
        await tour.reload()
        return tour
    }

    async delete(id) {
        const tour = await TourMapping.findByPk(id)
        if (!tour) {
            throw new Error('тур не найден в БД')
        }
        if (tour.image) { // удаляем изображение товара
            FileService.delete(tour.image)
        }
        await tour.destroy()
        return tour
    }

    // TODO: это вообще используется?
    async isExist(id) {
        const basket = await TourMapping.findByPk(id)
        return basket
    }
}

export default new Tour()