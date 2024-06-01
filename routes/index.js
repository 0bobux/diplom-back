import express from 'express'

import tour from './tour.js'
import category from './category.js'
import country from './country.js'
import user from './user.js'
import basket from './basket.js'
import rating from './rating.js'
import order from './order.js'

const router = new express.Router()

router.use('/tour', tour)
router.use('/category', category)
router.use('/country', country)
router.use('/user', user)
router.use('/basket', basket)
router.use('/rating', rating)
router.use('/order', order)

export default router