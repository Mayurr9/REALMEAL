
const homecontroller = require('../app/http/controllers/homecontroller')
const authcontroller = require('../app/http/controllers/authController')
const cartcontroller = require('../app/http/controllers/customers/cartcontroller')
const guest = require('../app/http/middlewares/guest')

function initRoutes(app) {
app.get('/',homecontroller().index)
app.get('/login', guest, authcontroller().login)
app.post('/login', authcontroller().postLogin)
app.get('/register', guest, authcontroller().register)
app.post('/register', authcontroller().postRegister)
app.post('/logout', authcontroller().logout)

app.get('/cart', cartcontroller().index)
app.post('/update-cart', cartcontroller().update)
}

module.exports = initRoutes