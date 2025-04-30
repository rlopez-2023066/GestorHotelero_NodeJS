import { Router } from "express";
import { 
    saveRoom, 
    getAll, 
    getRoomById, 
    updateRoom, 
    deleteRoom 
} from "./habitacion.controller.js";

const api = Router();

api.get('/getRoom', getAll);
api.get('/:id', getRoomById);
api.post(
    '/',
    saveRoom
)

api.put(
    '/:id',
    updateRoom
)

api.delete(
    '/delete/:id',
    deleteRoom
)

export default api;
