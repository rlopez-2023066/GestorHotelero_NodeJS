import { Router } from 'express'

import {getAllServices,
     addService, 
     updateService, 
     deleteService } from './servicio.controller.js'
import {validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/getService',validateJwt, getAllServices)
api.post('/addService', validateJwt, addService)
api.put('/updateSerive/:id', validateJwt,updateService)
api.delete('/deleteService/:id',validateJwt, deleteService)

export default api