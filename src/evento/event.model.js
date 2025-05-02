// model of event
import mongoose, {Schema, model} from "mongoose" 

const EventSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },
    
    type: {
      type: String,
      required: true,
      trim: true
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
      enum: ['Scheduled', 'Canceled', 'Finished'],
      default: 'Scheduled'
    },

    services: [
      {
        serviceId:{
          type: Schema.Types.ObjectId,
          ref: 'Service',
        },
        quantity: {
          type: Number,
          required: true
        },

        price: {
          type: Number
        }
      }
    ],


}, {
  timestamps: true
})

export default model('Event', EventSchema) 