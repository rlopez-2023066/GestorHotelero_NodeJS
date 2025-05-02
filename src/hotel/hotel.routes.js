import { Router } from "express";

import { updateHotelValidator, registerHotelValidator } from "../../middlewares/validators.js";
import { addHotel, 
        getAllHotels, 
        updateHotel, 
        deleteHotel, 
        withoutId,
        getHotelsAtoZ,
        getHotelsZtoA,
        getHotelById,
        geHoteltByName } from "./hotel.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";


const api = Router()

//Agregar Hotel
api.post('/addHotel', validateJwt, registerHotelValidator, addHotel)

//Obtener Hoteles
api.get('/getHotels', validateJwt, getAllHotels)


api.get('/getHotels/ZA',validateJwt,getHotelsZtoA)

api.get('/getHotels/AZ',validateJwt,getHotelsAtoZ)


api.get('/getHotels/:id',validateJwt,getHotelById)

api.get('/get',validateJwt,geHoteltByName)

//Actualizar Hotel
api.put('/updateHotel/:id',validateJwt,updateHotelValidator,updateHotel)

api.put('/updateHotel/',validateJwt,withoutId)

//Eliminar Hotel
api.delete('/deleteHotel/:id',validateJwt,deleteHotel)

api.delete('/deleteHotel/',validateJwt,withoutId)



export default api