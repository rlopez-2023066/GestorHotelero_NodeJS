import {model, Schema} from 'mongoose'


const reservationSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },

        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true
        },


        description:{
            type: String,
            required: true

        },

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        },
        
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        },

        price: {
            type: Number,
            required: true
        },

        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    },
    {
        versionKey: false, //Deshabilitar el __v(Versión del documento)
        timestamps: true //Agrega propiedades de fecha (Fecha de creación y de ultima actualización)
    }
)

export default model('Reservation', reservationSchema)