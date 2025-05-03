import {Router} from 'express'

import {
    createInvoice
} from '../factura/factura.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//Crear Factura
api.post('/createInvoice', validateJwt, createInvoice)

export default api
