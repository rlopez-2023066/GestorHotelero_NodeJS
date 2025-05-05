
import {
    isValidObjectId
} from 'mongoose'


import User from '../src/user/user.model.js'
import Service from '../src/servicio/servicio.model.js'
import Hotel from '../src/hotel/hotel.model.js'
import Room from '../src/habitacion/habitacion.model.js'

/* Observación: Identificar en Español el 
validador, para evitar problemas a futuros. */


//Validar si el Username (Usuario) existe
export const existUsername = async(username, user) => {
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername && alreadyUsername._id != user._id){
        console.error(`Username ${username} is already taken`)
        throw new Error (`Username ${username} is already taken`) 
    }
}

//Validar si el Email (Correo) existe
export const existEmail = async(email, user) => {
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id != user._id){
        console.error(`Email ${email} is already taken`)
        throw new Error (`Email ${email} is already taken`) 
    }
}

//No requiere el campo lleno
export const notRequiredField = (value, { req, path }) => {
    if (value !== undefined) {
        throw new Error(`The field '${path}' should not be sent in the request body`)
    }
}


//Validar si el ID es válido
export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}

// Validar que el nunero de habitacion no exista en el mismo hotel
export const existRoomNumberInHotel = async (no_room, { req }) => {
    const { hotel } = req.body

    const existingRoom = await Room.findOne({ 
        no_room: Number(no_room),
        hotel: hotel
    })

    if (existingRoom) {
        console.error(`Room number ${no_room} already exists in this hotel`)
        throw new Error(`Room number ${no_room} already exists in this hotel`)
    }
    
    return true
}

// Validar que el campo sales no sea proporcionado
export const validateNoSalesField = (sales) => {
    if (sales !== undefined) {
        console.error(
            'Sales field should not be provided'
        )
        throw new Error(
            'Sales field should not be provided as it is auto-generated'
        )
    }
    return true
}

//Valida que sean id correctos
export const isValidHotelId = async (hotelId) => {
    // Verificar si es un MongoID válido
    if (!isValidObjectId(hotelId)) {
        console.error(`Invalid Hotel ID format: ${hotelId}`)
        throw new Error('The provided Hotel ID has an invalid format')
    }

    // Verificar si el hotel existe en la base de datos
    const hotelExists = await Hotel.findById(hotelId)
    if (!hotelExists) {
        console.error(`Hotel with ID ${hotelId} not found`)
        throw new Error('The provided Hotel ID does not exist in our records')
    }

    return true
}

//valida id de la habitacion exits
export const validateRoomId = async (id, { req }) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid room ID format')
    }
    
    const roomExists = await Room.findById(id)
    if (!roomExists) {
        throw new Error('Room not found')
    }
    
    req.existingRoom = roomExists
    return true
}

//No actualiza el numero de habitacion
export const preventRoomNumberUpdate = async(no_room, { req }) => {
    const roomId = req.params.id

    const currentRoom = await Room.findById(roomId)
    if (!currentRoom) {
        throw new Error('Room not found') 
    }

    const existingRoom = await Room.findOne({
        hotel: currentRoom.hotel,
        no_room: Number(no_room),
        _id: { $ne: roomId }  // excluye la habitación actual
    })

    if (existingRoom) {
        throw new Error(`Room number ${no_room} already exists in this hotel`)
    }

    return true
}

//No actualiza el numero de habitacion
export const preventHotelUpdate = (value, { req }) => {
    if (req.body.hotel !== undefined) {
        throw new Error('Hotel association cannot be changed')
    }
    return true
}
//campos que no sean vacios
export const validateNoEmptyUpdates = (value, { req }) => {
    const updates = Object.keys(req.body)
    const allowedFields = ['no_room','type', 'description', 'capacity', 'state', 'price']
    
    for (const field of updates) {
        if (req.body[field] === '' || req.body[field] === null) {
            throw new Error(`Field '${field}' cannot be empty`)
        }
    }
    
    const invalidFields = updates.filter(field => 
        ![...allowedFields, 'sales'].includes(field)
    )
    
    if (invalidFields.length > 0) {
        throw new Error(`Invalid fields for update: ${invalidFields.join(', ')}`)
    }
    
    return true
}

// Validate if service exists in DB
export const serviceExists = async (id) => {
    const service = await Service.findById(id)
    if (!service) {
      console.error(`Service with ID ${id} does not exist`)
      throw new Error(`Service with ID ${id} does not exist`)
    }
}

//Valida si el nombre del hotel ya existe
export const existName = async(name,actualName)=>{
    const alreadyName = await Hotel.findOne({name})
    if(alreadyName && alreadyName._id != actualName){
        console.error(`Name's Hotel ${name} is already taken`)
        throw new Error (`Name's Hotel ${name} is already taken`) 
    }
}

export const duplicateServiceHotel = async(value, {req}) => {
    const serviceName = value
    const hotelId = req.body.hotel
    if (!hotelId) {
        throw new Error('Hotel ID is required')
    }
    const exists = await Service.findOne({ name: serviceName, hotel: hotelId })
    if (exists) {
        throw new Error('This service already exists for this hotel')
    }
    return true
}

export const duplicateServiceHotelUpdate = async (value, { req }) => {
    const { id } = req.params   
    const service = await Service.findById(id) 
    if (!service) {
        throw new Error('Service not found') 
    }
    const hotelId = service.hotel   
    const exists = await Service.findOne({
        name: value,
        hotel: hotelId,
        _id: { $ne: id }  
    }) 
    if (exists) {
        throw new Error('This service already exists for this hotel') 
    }
    return true 
} 
