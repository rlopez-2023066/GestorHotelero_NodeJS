import { Router } from 'express'

import {getAllServices,
     addService, 
     updateService, 
     deleteService } from './servicio.controller.js'
import {validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/getService',getAllServices)
api.post('/addService', addService)
api.put('/updateSerive/:id', validateJwt,updateService)
api.delete('/deleteService/:id',validateJwt, deleteService)

export default api