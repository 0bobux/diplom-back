import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import RatingController from '../controllers/Rating.js'

const router = new express.Router()

router.get('/tour/:tourId([0-9]+)', RatingController.getOne)
router.post('/tour/:tourId([0-9]+)/rate/:rate([1-5])', authMiddleware, RatingController.create)

export default router