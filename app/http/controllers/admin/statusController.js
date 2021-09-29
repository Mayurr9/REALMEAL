const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
           const getOrderDetails = Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
            //    console.log(data + " orders")
                if(err) {
                    // console.log(err + "status admin")
                    return res.redirect('/admin/orders')
                }
                //emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController