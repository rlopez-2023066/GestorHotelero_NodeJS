import { Router } from "express" 

import { updateHotelValidator, registerHotelValidator } from "../../middlewares/validators.js" 
import { addHotel, getAllHotels, updateHotel, deleteHotel } from "./hotel.controller.js" 
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js" 


const api = Router()

//Agregar Hotel
api.post('/addHotel', validateJwt, registerHotelValidator, addHotel)

//Obtener Hoteles
api.get('/getHotels', validateJwt, getAllHotels)

//Actualizar Hotel
api.put('/updateHotel/:id',validateJwt, updateHotelValidator,updateHotel)

//Eliminar Hotel
api.delete('/deleteHotel/:id',validateJwt, deleteHotel)



export default api