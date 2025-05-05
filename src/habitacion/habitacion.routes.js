import { Router } from "express";
import { 
    saveRoom, 
    getAll, 
    getRoomById, 
    updateRoom, 
    deleteRoom,
    getRoomByState
} from "./habitacion.controller.js";

import { validateJwt, authorizeRoles} from "../../middlewares/validate.jwt.js";
import { saveRoomValidator, updateRoomValidator } from "../../middlewares/validators.js";



const api = Router();

//Role Cliente
//Buscar todos las habitaciones
api.get('/getRoom', validateJwt , authorizeRoles('ADMIN_HOTEL','CLIENT'), getAll);
//Buscar habitacion por ID
api.get('/getRoomById/:id', validateJwt, authorizeRoles('ADMIN_HOTEL', 'CLIENT'), getRoomById);
//Buscar habitacion no reservadas
api.get('/getRoomByState', validateJwt, authorizeRoles('ADMIN_HOTEL','CLIENT'), getRoomByState);




//Role Admin_Hotel
//Agregar habitacion
api.post('/addRoom',saveRoomValidator, validateJwt, saveRoom)
//Actualizar habitacion
api.put('/updateRoom/:id',updateRoomValidator, validateJwt, updateRoom)
//Eliminar habitacion
api.delete('/deleteRoom/:id',validateJwt, deleteRoom)

export default api;