
const homecontroller = require('../app/http/controllers/homecontroller')
const authcontroller = require('../app/http/controllers/authController')
const cartcontroller = require('../app/http/controllers/customers/cartcontroller')

function initRoutes(app) {
app.get('/',homecontroller().index)
app.get('/cart', cartcontroller().index)
app.get('/login', authcontroller().login)
app.get('/register', authcontroller().register)

}

module.exports = initRoutes