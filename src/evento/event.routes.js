import { Router } from 'express';

import { 
    createEvent, 
        deleteEvent, 
        getAllEvents, 
        getEventById, 
        updateEvent 
    } from './event.controller.js' //Import function of controller event

const api = Router() 

//Routes from Event
api.post('/events', createEvent) //Create Event
api.put('/events/:id', updateEvent) //Update Event
api.delete('/events/:id', deleteEvent) //Delete Event
api.get('/events', getAllEvents); //Get All Events
api.get('/events/:id', getEventById) //Get Event by id

export default api