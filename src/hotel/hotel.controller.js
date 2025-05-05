'use strict'

import Hotel from './hotel.model.js'

//Agregar Hotel
export const addHotel = async(req,res) =>{
    try {

        
        const data = req.body
        

        const hotel = new Hotel(data)

        await hotel.save()

        return res.status(201).send(
            {
                success: true, 
                message: 'Hotel saved successfully'
            }
        )
        
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Obtener Hoteles
export const getAllHotels = async(req, res)=>{
    try {
        const hotels = await Hotel.find()

        if(!hotels){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Could not found Hotels '
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Hotels found: ',
                hotel: hotels
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Actualizar Hotel
export const updateHotel = async(req,res)=>{
    try {
        const {id} = req.params

        const data = req.body

        const hotel = await Hotel.findByIdAndUpdate(id,data,{new:true})

        if(!hotel){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Hotel not found'
                }
            )
        }

        return res.status(200).send(
            {
                success:true,
                message: 'Hotel updated successfully',
                hotel
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Eliminar Hotel
export const deleteHotel = async(req,res)=>{
    try {
        const {id} = req.params

        const hotel = await Hotel.findByIdAndDelete(id)

        if(!hotel){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Hotel not found'
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Hotel deleted successfully'
            }
        )

    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Obtener Hoteles por orden alfabético Z-A
export const getHotelsAtoZ = async(req,res)=>{
    try {
        const hotels = await Hotel.find().sort({name: 1})

        if(!hotels){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Could not found Hotels '
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Hotels found: ',
                hotel: hotels
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Obtener Hoteles por orden alfabético A-Z
export const getHotelsZtoA = async(req,res)=>{
    try {
        const hotels = await Hotel.find().sort({name: -1})

        if(!hotels){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Could not found Hotels '
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Hotels found: ',
                hotel: hotels
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Obtener Hotel por ID
export const getHotelById = async(req,res)=>{
    try {
        const {id} = req.params

        const hotels = await Hotel.findById(id)

        if(!hotels){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Could not found Hotels '
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Hotels found: ',
                hotel: hotels
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

//Mensage de error para cuando no se envia el ID
export const withoutId = async(req,res)=>{
    try {
        return res.status(404).send(
            {
                success: false,
                message: 'Please entre an Id'
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal  error',
                error
            }
        )
    }
}

