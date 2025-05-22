'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../utils/db.validators.js'


export const validateJwt = async (req, res, next) => {
  try {
    let secretKey = process.env.SECRET_KEY;
    let { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Invalid token format' });
    }
    const token = authorization.split(' ')[1];

    let user = jwt.verify(token, secretKey);

    const validateUser = await findUser(user.uid);
    if (!validateUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found - unauthorized',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: 'Invalid credentials' });
  }
};


export const isClient = async(req, res, next)=>{
    try{
        const { user } = req
        if(!user || user.role !== 'CLIENT') return res.status(403).send(
            {
                success: false,
                message: `You don't have access | username ${user.username}`
            }
        )
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Error with authorization'
            }
        )
    }
}


export const isAdmin = async(req, res, next)=>{
    try{
        const { user } = req
        if(!user || user.role !== 'ADMIN') return res.status(403).send(
            {
                success: false,
                message: `You don't have access | username ${user.username}`
            }
        )
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Error with authorization'
            }
        )
    }
}

export const isAdminHotel = async(req, res, next)=>{
    try{
        const { user } = req
        if(!user || user.role !== 'ADMIN_HOTEL') return res.status(403).send(
            {
                success: false,
                message: `You don't have access | username ${user.username}`
            }
        )
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Error with authorization'
            }
        )
    }
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user  

        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient role permissions.',
            }) 
        }

        next() 
    } 
} 



/*OBSERVACIÓN: Si se llegan agregar un Validator nuevo, tomar en cuenta
su funcionalidad y agregar un comentario acerca de eso. */