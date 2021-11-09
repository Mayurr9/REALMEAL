const Menu = require('../../models/menu')
function homecontroller(){
    return{
        async index(req, res){
            const pizzas = await Menu.find()
            return res.render('home', { pizzas: pizzas })
        },
        async error(req, res) {
            res.render('error404')
        },
        async contact(req, res) {
            res.render('contact')
        }
    }
}


module.exports = homecontroller


