const order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function orderController () {
    return {
        store(req, res) {
            //validate req
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }
            const orders = new order({ 
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            orders.save().then(result => {
                // debugger
                order.populate(result, { path: 'customerId' }, (err, orderPlaced) => {
                    // req.flash('success', 'order placed successfully')
                    //stripe pay
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `food order: ${orderPlaced._id}`
                            // description: 'Food Order: ${orderPlaced._id}'
                        }).then(() => {
                            orderPlaced.paymentStatus = true;
                            orderPlaced.paymentType = paymentType
                            orderPlaced.save().then((ord) => {
                                //Emit 
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'payment successful, order placed successfully' })
                            }).catch((err) => {
                                console.log(err)
                            })
                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'Order Placed but Payment failed, You can pay at delivery time' })
                        })
                    } else {
                         //Emit 
                    //console.log(orderPlaced)
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', orderPlaced)
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
        
                    // return res.redirect('/customers/orders')
                })
            }).catch(err => {
                return res.status(500).json({ message : 'something went wrong' })
            })
        },
        async index(req, res) {
            const orders = await order.find({ customerId: req.user._id}, 
                null,
                { sort: { 'createdAt': -1 }})
                // res.header('Cache-Control', 'no-cache')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const getOrderId = req.params.id
            // console.log(getOrderId)
            const Order = await order.findById(getOrderId)
            // Authorize user
            if(req.user._id.toString() === Order.customerId.toString()) {
                return res.render('customers/singleOrder', { Order })
            }
            return  res.redirect('/')
        },
        async customerOrderCancel(req, res) {   
            var orderToCancel = req.body.orderID;
            const updateOrder = await order.updateOne({ _id: orderToCancel }, { $set: { status: 'cancelled'}});
            // console.log(updateOrder );
  	        const Order = await order.findById( orderToCancel)
            // Authorize user
            if(req.user._id.toString() === Order.customerId.toString()) {
                return res.render('customers/singleOrder', { Order })
            }
            return  res.redirect('/')
        }
    }
}

module.exports = orderController