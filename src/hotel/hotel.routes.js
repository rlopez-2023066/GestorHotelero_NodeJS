import { Router } from "express" 

import { updateHotelValidator, registerHotelValidator } from "../../middlewares/validators.js" 
import { addHotel, 
    getAllHotels, 
    updateHotel, 
    deleteHotel, 
    withoutId,
    getHotelsAtoZ,
    getHotelsZtoA,
    getHotelById
    } from "./hotel.controller.js";

import { isAdmin, validateJwt, isClient , authorizeRoles} from "../../middlewares/validate.jwt.js" 


const api = Router()


//Rutas para el Cliente
//Obtener Hoteles
api.get('/getHotels', validateJwt,  authorizeRoles('ADMIN', 'CLIENT') ,getAllHotels)
//Obtener Hoteles por orden alfabético Z-A
api.get('/getHotelZA',validateJwt,   authorizeRoles('ADMIN', 'CLIENT'), getHotelsZtoA)
//Obtener Hoteles por orden alfabético A-Z
api.get('/getHotelAZ',validateJwt,  authorizeRoles('ADMIN', 'CLIENT'), getHotelsAtoZ)
//Obtener Hotel por ID
api.get('/getHotels/:id',validateJwt, authorizeRoles('ADMIN', 'CLIENT'),  getHotelById)







//Rutas para el Admin

//Agregar Hotel
 api.post('/addHotel', validateJwt, registerHotelValidator, isAdmin , addHotel)

 
//Actualizar Hotel
api.put('/updateHotel/:id',validateJwt, updateHotelValidator, isAdmin, updateHotel)
api.put('/updateHotel/',validateJwt, isAdmin, withoutId)


//Eliminar Hotel
 api.delete('/deleteHotel/:id', validateJwt, isAdmin, deleteHotel)
 api.delete('/deleteHotel/',validateJwt, isAdmin, withoutId)





export default api