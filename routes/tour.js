import express from 'express'
import TourController from '../controllers/Tour.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import TourPropController from '../controllers/TourProp.js'

const router = new express.Router()

// список туров выбранной категории и выбранной страны
router.get('/getall/categoryId/:categoryId([0-9]+)/countryId/:countryId([0-9]+)', TourController.getAll)
// список туров выбранной категории
router.get('/getall/categoryId/:categoryId([0-9]+)', TourController.getAll)
// список туров выбранной страны
router.get('/getall/countryId/:countryId([0-9]+)', TourController.getAll)
// список всех туров каталога
router.get('/getall', TourController.getAll)
// получить один тур каталога
router.get('/getone/:id([0-9]+)', TourController.getOne)
// создать тур каталога — нужны права администратора
router.post('/create', authMiddleware, adminMiddleware, TourController.create)
// обновить тур каталога  — нужны права администратора
router.put('/update/:id([0-9]+)', authMiddleware, adminMiddleware, TourController.update)
// удалить тур каталога  — нужны права администратора
router.delete('/delete/:id([0-9]+)', authMiddleware, adminMiddleware, TourController.delete)

// список свойств тура
router.get('/:tourId([0-9]+)/property/getall', TourPropController.getAll)
// одно свойство тура
router.get('/:tourId([0-9]+)/property/getone/:id([0-9]+)', TourPropController.getOne)
// создать свойство тура
router.post(
    '/:tourId([0-9]+)/property/create',
    authMiddleware,
    adminMiddleware,
    TourPropController.create
)
// обновить свойство тура
router.put(
    '/:tourId([0-9]+)/property/update/:id([0-9]+)',
    authMiddleware,
    adminMiddleware,
    TourPropController.update
)
// удалить свойство тура
router.delete(
    '/:tourId([0-9]+)/property/delete/:id([0-9]+)',
    authMiddleware,
    adminMiddleware,
    TourPropController.delete
)

export default router