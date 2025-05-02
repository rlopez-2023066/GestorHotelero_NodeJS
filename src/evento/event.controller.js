import Event from "./event.model.js"
import Service from "../servicio/servicio.model.js"

//Create Event
export const createEvent = async (req, res) => {
    try {
      const data = req.body 
      
      const servicesArray = [] 
      
      const existingEvent = await Event.findOne({
        startTime: data.startTime,
        endTime: data.endTime
      });
  
      if (existingEvent) {
        return res.status(400).send({
          success: false,
          message: 'An event with the same date and time already exists.'
        })
      } 
      for (const item of data.services) {
        const service = await Service.findById(item.serviceId) 
  
        if (!service) {
          return res.status(404).send({
            success: false,
            message: `Service not found`
          }) 
        }
  
        if (service.amount < item.quantity) {
          return res.status(400).send({
            success: false,
            message: `Not enough quantity for Service`
          }) 
        }
  
        service.amount -= item.quantity 
  
        await service.save() 
  
        servicesArray.push({
          serviceId: item.serviceId,
          quantity: item.quantity,
          price: service.price
        }) 
      }
  
      data.services = servicesArray 
  
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

//Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const existingEvent = await Event.findOne({
      startTime: data.startTime,
      endTime: data.endTime,
      _id: { $ne: id } // excluir el mismo evento que se está actualizando
    })

    if (existingEvent) {
      return res.status(400).send({
        success: false,
        message: 'An event with the same date and time already exists.'
      })
    }

    const servicesArray = []

    for (const item of data.services) {
      const service = await Service.findById(item.serviceId)

      if (!service) {
        return res.status(404).send({
          success: false,
          message: `Service not found`
        })
      }

      if (service.amount < item.quantity) {
        return res.status(400).send({
          success: false,
          message: `Not enough quantity for Service`
        })
      }

      service.amount -= item.quantity
      await service.save()

      servicesArray.push({
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: service.price
      })
    }

    data.services = servicesArray

    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true })
    if (!updatedEvent) {
      return res.status(404).send({
        success: false,
        message: 'Event not found and not updated'
      })
    }

    return res.send({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
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
  
      const event = await Event.findById(id) 
  
      if (!event) {
        return res.status(404).send({
          success: false,
          message: 'Event not found'
        }) 
      }
  
      for (const item of event.services) {
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

