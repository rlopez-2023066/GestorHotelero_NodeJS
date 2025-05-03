import { Router } from "express";
import { 
    saveRoom, 
    getAll, 
    getRoomById, 
    updateRoom, 
    deleteRoom 
} from "./habitacion.controller.js";

import { validateJwt } from "../../middlewares/validate.jwt.js";
import { deleteRoomValidator, saveRoomValidator, updateRoomValidator } from "../../middlewares/validators.js";



const api = Router();

//Buscar todos las habitaciones
api.get('/getRoom', validateJwt, getAll);
//Buscar habitacion por ID
api.get('/getRoomById/:id', validateJwt,getRoomById);
//Agregar habitacion
api.post('/addRoom',saveRoomValidator, validateJwt, saveRoom)
//Actualizar habitacion
api.put('/updateRoom/:id',updateRoomValidator, validateJwt, updateRoom)
//Eliminar habitacion
api.delete('/deleteRoom/:id',deleteRoomValidator,validateJwt, deleteRoom)

export default api;
