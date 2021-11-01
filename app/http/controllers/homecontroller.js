const Menu = require('../../models/menu')
function homecontroller(){
    return{
        async index(req, res){
            const pizzas = await Menu.find()
            return res.render('home', { pizzas: pizzas })
        },
        async error(req, res) {
            res.render('error404')
        }
    }
}


module.exports = homecontroller


