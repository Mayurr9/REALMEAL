const order = require('../../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(req, res) {
            //validate req
            const { phone, address } = req.body
            if(!phone || !address) {
                // console.log("All fields are required")

                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }
            const orders = new order({ 
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            orders.save().then(result => {
                req.flash('success', 'order placed successfully')
                delete req.session.cart
                return res.redirect('customers/orders')
            }).catch(err => {
                req.flash('error', 'something went wrong' )
                return res.redirect('/cart')
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
        }
    }
}

module.exports = orderController