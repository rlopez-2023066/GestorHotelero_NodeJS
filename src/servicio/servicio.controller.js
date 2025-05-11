import Hotel from '../hotel/hotel.model.js'
import Service from '../servicio/servicio.model.js'

export const getAllServices = async (req,res) => {
    console.log("req.user:", req.user);

    try {
        const hotelId =  req.user.hotel
        console.log(hotelId);
        const {limit,skip}= req.query
        const service = await Service.find({hotel: hotelId})

        .populate('hotel')
        .skip(skip)
        .limit(limit)

        if(service.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message:'Services not found'
                }
            )
        }
        return res.send(
            {
                success:true,
                message:'Services found',
                total:service.length,
                service
            }
        )

    } catch (error) {
        console.error('general error',error)
        return res.status(500).send(
            {
                success:false,
                message: 'general error with getAllServices',
                error
            }
        )
    }
}

export const addService = async (req,res) => {
    try {
        const data = req.body

        let hotelId = await Hotel.findById(data.hotel)
        let hotelIdJwt = req.user.hotel

        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }

        if(data.hotel !== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }
        
        if(!hotelId) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Hotel not found'
                }
            )
        }
        let service = new Service(data)
        
        await service.save()
        await service.populate('hotel')
        return res.status(201).send(
            {
                success:true,
                message:'service created successsfully',
                service
            }
        )
        
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success:false,
            message:'Generar error with addService',
            error
            }
        )
    }
    
}

export const updateService = async (req, res) => {
    try {
        const {id}=req.params
        const data = req.body
        let hotelIdJwt = req.user.hotel
        
        const serviceData = await Service.findById(id)

        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( serviceData.hotel.toString() !== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }
        
        

        const service = await Service.findById(id)
        if(!service){
            return res.status(404).send(
                {
                    success:false,
                    message:'Service not found'
                }
            )
        }

        const updateService = await Service.findByIdAndUpdate(
            id,
            data,
            {new:true}
        )
        if(!updateService){
            return res.status(404).send(
                {
                    success:false,
                    message:'Service not found',
                    
                }
            )
        }
        return res.status(200).send(
            {
                success:true,
                message:'Service updated successfully',
                updateService
            }
        )
        
    } catch (error) {
        console.error('general error',error)
        return res.status(500).send(
            {
                success:false,
                message:'general error with updateService'
            }
        )
    }
}

export const deleteService = async (req,res) => {
    try {
        const {id}= req.params
        let hotelIdJwt = req.user.hotel
        
        const serviceData = await Service.findById(id)

        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( serviceData.hotel.toString() !== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }
        
        const deleteService = await Service.findByIdAndDelete(id)
        
        if(!deleteService){
            return res.status(404).send(
                {
                    success:false,
                    message:'Service not found'
                }
            )
        }
        return res.send(
            {
                success:true,
                message:'Service deleted successfully'
            }
        )
    } catch (error) {
        console.error('General error', error)
        return res.status(500).send(
            {
                message:'general error with deleteService',
                error
            }
        )
    }
}