import { Rating as RatingMapping } from './mapping.js'
import { Tour as TourMapping } from './mapping.js'
import { User as UserMapping } from './mapping.js'
import AppError from '../errors/AppError.js'

class Rating {
    async getOne(tourId) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const votes = await RatingMapping.count({where: {tourId}})
        if (votes) {
            const rates = await RatingMapping.sum('rate', {where: {tourId}})
            return {rates, votes, rating: rates/votes}
        }
        return {rates: 0, votes: 0, rating: 0}
    }

    async create(userId, tourId, rate) {
        const tour = await TourMapping.findByPk(tourId)
        if (!tour) {
            throw new Error('Тур не найден в БД')
        }
        const user = await UserMapping.findByPk(userId)
        if (!user) {
            throw new Error('Пользователь не найден в БД')
        }
        const rating = await RatingMapping.create({userId, tourId, rate})
        return rating
    }
}

export default new Rating()