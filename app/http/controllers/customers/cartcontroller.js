const { json } = require("express")

function cartcontroller(){
    return{
        index(req, res){
            res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         realmealId: { item: realmealObject, qty:0 },
            //         realmealId: { item: realmealObject, qty:0 },
            //         realmealId: { item: realmealObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart

            // Check if item does not exist in cart 
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        },

        remove(req, res) {
            let cart = req.session.cart;
            if (cart.totalQty > 0) {
              cart.totalQty = cart.totalQty - 1;
              cart.totalPrice = cart.totalPrice - req.body.price;

              if (cart.items[req.body._id].qty === 1) {
                delete cart.items[req.body._id];
                // window.location.reload();
              } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1;
                // window.location.reload();
              }
              if (cart.totalQty === 0) {
                delete req.session.cart;
                // window.location.reload();
              }
            }
            let totalQty = cart ? cart.totalQty : 0;
            return res.json({ totalQty: totalQty, cartItems: cart.items });
            
            
        },
    }
}

module.exports = cartcontroller




