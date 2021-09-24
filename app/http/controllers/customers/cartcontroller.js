function cartcontroller(){
    return{
        index(req, res){
            res.render('customers/cart')
        }
    }
}

module.exports = cartcontroller


