import { Router } from 'express' 

import { 
    createEvent, 
        deleteEvent, 
        getAllEvents, 
        getEventById, 
        updateEvent 
    } from './event.controller.js' //Import function of controller event

import { validateJwt } from '../../middlewares/validate.jwt.js' 



const api = Router() 

//Routes from Event
api.post('/addEvent', validateJwt, createEvent) //Create Event
api.put('/updateEvent/:id', validateJwt, updateEvent) //Update Event
api.delete('/deleteEvent/:id', validateJwt, deleteEvent) //Delete Event
api.get('/listEventAll', validateJwt, getAllEvents)  //Get All Events
api.get('/listEventById/:id', validateJwt, getEventById) //Get Event by id

export default api