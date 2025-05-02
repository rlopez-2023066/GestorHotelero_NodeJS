'use strict'

//ECModules | ESModules


import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import hotelRoutes from '../src/hotel/hotel.routes.js'
import serviceRoutes from '../src/servicio/servicio.routes.js'
import eventRoutes from '../src/evento/event.routes.js'
import roomRoutes from '../src/habitacion/habitacion.routes.js'
import reservationRouter from '../src/resevacion/reservacion.routes.js'
import invoiceRouter from '../src/factura/factura.routes.js'



const configs = (app) => {
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
}

const routes = (app) => {
    /*Se agrega Rutas de los Modelos 
    OBSERVACIÓN: Agregar un comentario antes de las rutas, asi mismo para identificar.*/

    //Rutas de Autenticación
    app.use(authRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/hotel',hotelRoutes)
    app.use('/v1/service',serviceRoutes)
    app.use('/v1/events', eventRoutes)
    app.use('/v1/rooms',roomRoutes)
    app.use('/v1/reservation', reservationRouter)
    app.use('/v1/invoice', invoiceRouter)
    

}

export const initServer = () => {
    const app = express()
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Servidor ejecutándose en el puerto ${process.env.PORT}`);

    }catch (error){
        
        console.error('Error en el Servidor', error)
    }
}

/* Cumplir los requirimientos a la hora de agregar nuevas rutas, asi mismo para evitar complicaciones a futuros*/
