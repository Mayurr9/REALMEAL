const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      customerId: {
        type: String,
        required: true,
        trim: true,
      },
      orderId: {
        type: String,
        // required: true,
        trim: true,
        default:false,
      },
      customerMessage: {
        type: String,
        required: true,
        trim: true,
      },
      adminMessage: {
        type: String,
        default:false,
        // required: true,
        trim: true,
      },
      receivedAt: {
        type: String,
        default: new Date(),
      }
})

module.exports = mongoose.model('message', messageSchema)