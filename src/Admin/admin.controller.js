'use strict'


import User from '../user/user.model.js'

/*Observación: Colocar comentario de la función a crear. */

//Update Usuario
export const updateUser = async(req, res) => {
    try{
        const {id} = req.params

        const data = req.body

        const idC = req.user.uid

        const userC = await User.findById(id)

       
        const update = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        return res.send(
            {
                success: true,
                message: 'User updated successfully',
                user: update
            }
        )

    }catch (error){
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Internal server error',
                error
            }
        )
    }
}


//Delete User
export const deleteUser = async(req, res) => {
    try{
        let {id} = req.params
        const userC = await User.findById(id)
        
        if(!userC) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        
        await User.findByIdAndDelete(id)
        return res.send({
            success: true,
            message: 'User deleted successfully'

        })
    } catch(error){
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}

//Listar todos los usuarios
export const getAllUsers = async(req, res) => {
    try{
        const users = await User.find()
        return res.send({
            success: true,
            message: 'Users found',
            users
        })
    } catch(error){
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}

//Listar usuario por id
export const getUserById = async(req, res) => {
    try{
        const {id} = req.params
        const user = await User.findById(id)

        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User found',
            user
        })
    }catch(error){
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}

//Listar usuario por ROLE
export const getUserByRole = async(req, res) => {
    try{
        const {role} = req.body

        if(role !== 'ADMIN' && role !== 'CLIENT' && role !== 'ADMIN_HOTEL'){
            return res.status(400).send({
                success: false,
                message: 'Invalid role'
            })
        }

        const user = await User.find({role})

        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User found',
            user
        })
    }catch(error){
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}
