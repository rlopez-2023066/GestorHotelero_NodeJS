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

import {validateJwt} from '../../middlewares/validate.jwt.js'

const api = Router()

//Crear Reservación
api.post('/createReservation', validateJwt, createReservationRoom)

//Actualizar Reservación
api.put('/updateReservation/:id', validateJwt, updateReservationRoom)

//Eliminar Reservación y Evento
api.put('/deleteReservationRoomAndEvent/:id', validateJwt, deleteReservationRoomAndEvent)

//Listar Reservaciones por Hotel
api.get('/listReservationHotel/:id', validateJwt, getReservationsByHotel)

//Crear Reservacion para Eventos
api.post('/createReservationEvent', validateJwt, createReservationEvent)

//Actualizar Reservacion para Eventos
api.put('/updateReservationEvent/:id', validateJwt, updateReservationEvent)



export default api


