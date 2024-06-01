import express from 'express'
import CountryController from '../controllers/Country.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = new express.Router()

router.get('/getall', CountryController.getAll)
router.get('/getone/:id([0-9]+)', CountryController.getOne)
router.post('/create', authMiddleware, adminMiddleware, CountryController.create)
router.put('/update/:id([0-9]+)', authMiddleware, adminMiddleware, CountryController.update)
router.delete('/delete/:id([0-9]+)', authMiddleware, adminMiddleware, CountryController.delete)

export default router