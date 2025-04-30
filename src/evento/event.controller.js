import Event from "./event.model.js"
import Service from "../servicio/servicio.model.js"

//Create Event
export const createEvent = async (req, res) => {
try{
    const data = req.body;

    //Validate that the service exists
    const servicesExist  = await Service.findById(data.services);
    if(!servicesExist ){
        return res.status(404).send({
            success: false,
            message: 'Service not found'
        })
    }

    //Create Event
    const event = new Event(data)
    await event.save()

    return res.send({
        success: true,
        message: 'Event created succesfully =0',
        event
    })
} catch (err) {
    console.error('General error', err);
    return res.status(500).send({
        success: false,
        message: 'General error',
        err
    })
}
}

//Update Event
export const updateEvent = async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        //Validate that the service exists
        if(!data.service){
            const serviceExist = await Service.findyByid(data.service)
            if(!serviceExist){
                return res.status(404).send({
                    success: false,
                    message: 'Service not found'
                })
            }
        }
        //Update Event
        const updateEvent = await Event.findByIdAndUpdate(
            id,
            data,
            { new:true }
        ).populate("services")

        if(!updateEvent){
            return res.status(404).send({
                success: false,
                message: 'Event not found and not updated'
            })
        }

        return res.send({
            success: true,
            message: 'Event updated succesfully',
            event: updateEvent
        })
    } catch (err){
        console.error('General error', err);
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

//Delete Event
export const deleteEvent = async (req, res) => {
    try{
        const { id } = req.params
        const deleteEvent = await Event.findByIdAndDelete(id)

        if(!deleteEvent){
            return res.status(404).send({
                success: false,
                message: 'Event not found'
            })
        }
        return res.send({
            success: true,
            message: 'Event removed successfully'
        })

    }catch (err){
        console.error('General error', err);
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

//Get all Events
export const getAllEvents = async (req, res) => {
    try{ 
        const { limit = 20, skip = 0 } = req.query
        const event = await Event.find()
            .populate("services")
            .skip(Number(skip))
            .limit(Number(limit))

            if (event.length ===0) {
                return res.status(404).send({
                    success: false,
                    message:  'Event not found'
                })
            }
            return res.send({
                success: true,
                message:  'Event found:',
                event
            })
    }catch (err){
        console.error('General error', err);
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

//Get by ID Event
export const getEventById = async (req, res) => {
    try{
        const { id } = req.params
        const event = await Event.findById(id)
            .populate("services")
        
        if(!event){
            return res.status(404).send({
                success: false,
                message: 'Event not found'
            })
        }
        return res.send({
            success: true,
            message: 'Event found:',
            data: event
        })
    }catch (err){
        console.error('General error', err);
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}