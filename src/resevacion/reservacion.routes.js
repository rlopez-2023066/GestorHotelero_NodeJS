import {Router} from "express"

import {
    createReservationRoom,
    updateReservationRoom,
    getReservationsByHotel,
    deleteReservationRoom,
    getReservationsByUser
} from './reservacion.controller.js'

//Importación de validaciones
import {
    registerReservationValidator,
    updateReservationValidator
} from '../../middlewares/validators.js'


import {validateJwt, authorizeRoles} from '../../middlewares/validate.jwt.js'

const api = Router()


//Listar Reservaciones por Usuario
api.get('/getReservationsByUser', validateJwt, authorizeRoles('ADMIN_HOTEL', 'CLIENT'), getReservationsByUser)

//Listar Reservaciones por Hotel
api.get('/listReservationHotel/:id', validateJwt, authorizeRoles('ADMIN','ADMIN_HOTEL'), getReservationsByHotel)

//Crear Reservación Habitación
api.post('/createReservation', validateJwt, registerReservationValidator, authorizeRoles('ADMIN_HOTEL', 'CLIENT'), createReservationRoom)

//Actualizar Reservación
api.put('/updateReservation/:id', validateJwt, updateReservationValidator, authorizeRoles('ADMIN_HOTEL', 'CLIENT'), updateReservationRoom)

//Eliminar Reservación
api.put('/deleteReservationRoomAndEvent/:id', validateJwt, authorizeRoles('ADMIN_HOTEL', 'CLIENT'), deleteReservationRoom)





export default api


