import { Router } from 'express' 

import { 
    createEvent, 
    deleteEvent, 
    getAllEvents, 
    getEventById,
    getEventByHotel
} from './event.controller.js' //Import function of controller event

import {
    createEventValidator
} from './../../middlewares/validators.js'


import { validateJwt, authorizeRoles } from '../../middlewares/validate.jwt.js' 



const api = Router() 

//Routes from Event

//Get event by ID
api.get('/listEventById/:id', validateJwt, authorizeRoles('ADMIN_HOTEL','CLIENT'), getEventById) //Get Event by id

//Get All Event
api.get('/listEventAll', validateJwt, authorizeRoles('ADMIN_HOTEL','CLIENT'), getAllEvents)  

//Get event by Hotel
api.get('/listEventByHotel', validateJwt, authorizeRoles('ADMIN_HOTEL','CLIENT'), getEventByHotel) //Get Event by hotel id








//Create Event
api.post('/addEvent', validateJwt, createEventValidator, createEvent) 

//Delete Event
api.delete('/deleteEvent/:id', validateJwt, deleteEvent) 




export default api