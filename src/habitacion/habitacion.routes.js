import { Router } from "express";
import { 
    saveRoom, 
    getAll, 
    getRoomById, 
    updateRoom, 
    deleteRoom 
} from "./habitacion.controller.js";

import { validateJwt } from "../../middlewares/validate.jwt.js";



const api = Router();

//Buscar todos los Hoteles
api.get('/getRoom', validateJwt, getAll);
//Buscar Hotel por ID
api.get('/getRoomById/:id', validateJwt,getRoomById);
//Agregar Hotel
api.post('/addRoom', validateJwt, saveRoom)
//Actualizar Hotel
api.put('/updateRoom/:id', validateJwt, updateRoom)
//Eliminar Hotel
api.delete('/deleteRoom/:id',validateJwt, deleteRoom)

export default api;
