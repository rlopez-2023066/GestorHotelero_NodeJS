import { Router } from 'express'

import {getAllServices,
     addService, 
     updateService, 
     deleteService } from './servicio.controller.js'
import {validateJwt} from '../../middlewares/validate.jwt.js'
import { serviceCreateValidator,serviceUpdateValidator} from '../../middlewares/validators.js'

const api = Router()

api.get('/getService',getAllServices)
api.post('/addService',validateJwt,serviceCreateValidator, addService)
api.put('/updateSerive/:id', validateJwt,serviceUpdateValidator,updateService)
api.delete('/deleteService/:id',validateJwt, deleteService)

export default api