import Event from "./event.model.js"
import Service from "../servicio/servicio.model.js"
import Room from '../habitacion/habitacion.model.js'


// Create Event
export const createEvent = async (req, res) => {
  try {


    const data = req.body  

    let hotelIdJwt = req.user.hotel
    
    if(!hotelIdJwt){
        return res.status(403).send(
            {
                success: false,
                message: 'You are not the hotel manager.'
            }
        )
    }
    
    if( data.hotel.toString() !== hotelIdJwt){
        return res.status(403).send(
            {
                success: false,
                message: 'You do not have permission to modify this service'
            }
        )
    }


    const servicesArray = []  

    // Verificar si ya existe un evento con la misma fecha y hora
    const existingEvent = await Event.findOne({
      startTime: data.startTime,
      endTime: data.endTime
    })  

    if (existingEvent) {
      return res.status(400).send({
        success: false,
        message: 'An event with the same date and time already exists.'
      })  
    }

    const room = await Room.findById(data.room)  

    //Validar que la habitación exista
    if (!room) {
      return res.status(404).send({
        success: false,
        message: 'Room not found'
      })  
    }

    if (String(room.hotel) !== String(data.hotel)) {
      return res.status(403).send({
        success: false,
        message: 'Room does not belong to the selected hotel'
      })  
    }

    if (room.type !== 'Living_room') {
      return res.status(400).send({
        success: false,
        message: 'Only rooms of type "Living_room" can be used for events'
      })  
    }
    console.log(room.type);

    if(room.state !== 'available') {
      return res.status(400).send(
        {
          success: false, 
          message: 'Room is not available'
        }
      )
    }

    // Validar que todos los servicios pertenezcan al hotel
    for (const item of data.services) {
      const service = await Service.findById(item.serviceId)  

      if (!service) {
        return res.status(404).send({
          success: false,
          message: `Service not found`
        })  
      }

      if (String(service.hotel) !== String(data.hotel)) {
        return res.status(403).send({
          success: false,
          message: `Service ${service.name} does not belong to the selected hotel`
        })  
      }

      if (service.amount < item.quantity) {
        return res.status(400).send({
          success: false,
          message: `Not enough quantity for Service: ${service.name}`
        })  
      }

      service.amount -= item.quantity  
      await service.save()  

      servicesArray.push({
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: service.priceOne
      })  
    }

    data.services = servicesArray  

    room.state = 'busy'
    await room.save()

    const event = new Event(data)  
    await event.save()  

    return res.send({
      success: true,
      message: 'Event created successfully',
      event
    })  

  } catch (err) {
    console.error('General error', err)  
    return res.status(500).send({
      success: false,
      message: 'General error',
      err
    })  
  }
}  




//Delete Event
export const deleteEvent = async (req, res) => {
  try {

      
    const { id } = req.params 
    
    const eventData = await Event.findById(id) 
    const roomData = await Room.findById(eventData.room)

    let hotelIdJwt = req.user.hotel
  
    if(!hotelIdJwt){
        return res.status(403).send(
            {
                success: false,
                message: 'You are not the hotel manager.'
            }
        )
    }
    
    if( eventData.hotel.toString() !== hotelIdJwt){
        return res.status(403).send(
            {
                success: false,
                message: 'You do not have permission to modify this service'
            }
        )
    }
  
  
    if (!eventData) {
      return res.status(404).send({
        success: false,
        message: 'Event not found'
      }) 
    }

    for (const item of eventData.services) {
      const service = await Service.findById(item.serviceId) 

      if (!service) {
        return res.status(404).send({
          success: false,
          message: `Service with ID ${item.serviceId} not found`
        }) 
      }

      service.amount += item.quantity 

      await service.save() 
    }

    roomData.state = 'available'
    await roomData.save()


    await Event.findByIdAndDelete(id) 

    return res.send({
      success: true,
      message: 'Event removed successfully'
    }) 

  } catch (err) {
    console.error('General error', err) 
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
        console.error('General error', err) 
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
      console.error('General error', err) 
      return res.status(500).send({
          success: false,
          message: 'General error',
          err
      })
  }
}

//Get Event by Hotel
export const getEventByHotel = async (req, res) => {
  try{
      const { hotel } = req.body

      const event = await Event.find({ hotel })
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
      console.error('General error', err) 
      return res.status(500).send({
          success: false,
          message: 'General error',
          err
      })
  }
}

