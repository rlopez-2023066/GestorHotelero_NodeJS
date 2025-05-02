import {Router} from "express"

import {
    createReservationRoom,
    updateReservationRoom,
    getReservationsByHotel,
    createReservationEvent,
    deleteReservationRoomAndEvent,
    updateReservationEvent
} from './reservacion.controller.js'

//Importación de validaciones
import {
    registerReservationValidator,
    updateReservationValidator,
    registerEventValidator
} from '../../middlewares/validators.js'


import {validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()

//Crear Reservación Habitación
api.post('/createReservation', validateJwt, registerReservationValidator, createReservationRoom)

//Actualizar Reservación
api.put('/updateReservation/:id', validateJwt, updateReservationValidator, updateReservationRoom)

//Eliminar Reservación y Evento
api.put('/deleteReservationRoomAndEvent/:id', validateJwt, deleteReservationRoomAndEvent)

//Listar Reservaciones por Hotel
api.get('/listReservationHotel/:id', validateJwt, getReservationsByHotel)

//Crear Reservacion para Eventos
api.post('/createReservationEvent', validateJwt, registerEventValidator ,createReservationEvent)

//Actualizar Reservacion para Eventos
api.put('/updateReservationEvent/:id', validateJwt, updateReservationValidator, updateReservationEvent)



export default api


