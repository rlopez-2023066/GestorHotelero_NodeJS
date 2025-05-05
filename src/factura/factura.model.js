import {Schema, model} from 'mongoose'

const invoiceSchema = new Schema(
    {
        reservation: {
            type: Schema.Types.ObjectId,
            ref: 'Reservation'      
        },
        
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true
        },

        issueDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        
        tax: {
            type: Number,
            required: true
        },

        total:{
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ['paid', 'unpaid'],
            default: 'unpaid'
        },


    },
    {
        versionKey: false, //Deshabilitar el __v(Versión del documento)
        timestamps: true //Agrega propiedades de fecha (Fecha de creación y de ultima actualización)
    }
)

export default model('Invoice', invoiceSchema)