import { Router } from 'express'

import {
     getAllServices,
     addService, 
     updateService, 
     deleteService } from './servicio.controller.js'

import {validateJwt, authorizeRoles } from '../../middlewares/validate.jwt.js'

import {
     serviceCreateValidator,
     serviceUpdateValidator
} from './../../middlewares/validators.js'

const api = Router()



api.get('/getService',validateJwt, authorizeRoles('ADMIN_HOTEL', 'ADMIN') ,getAllServices)
api.post('/addService', validateJwt, serviceCreateValidator, authorizeRoles('ADMIN_HOTEL', 'ADMIN'), addService)
api.put('/updateService/:id', validateJwt, serviceUpdateValidator, authorizeRoles('ADMIN_HOTEL', 'ADMIN'), updateService)
api.delete('/deleteService/:id',validateJwt, authorizeRoles('ADMIN_HOTEL', 'ADMIN'), deleteService)

export default api