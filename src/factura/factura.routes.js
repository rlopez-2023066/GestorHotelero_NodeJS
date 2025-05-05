import {Router} from 'express'

import {
    createInvoice,
    createInvoiceEvent
} from '../factura/factura.controller.js'

import {
    createInvoiceValidator
} from '../../middlewares/validators.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//Crear Factura
api.post('/createInvoice', validateJwt, createInvoice)

api.post('/createInvoiceEvent', validateJwt, createInvoiceValidator, createInvoiceEvent)

export default api
