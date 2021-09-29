
const homecontroller = require('../app/http/controllers/homecontroller')
const authcontroller = require('../app/http/controllers/authController')
const cartcontroller = require('../app/http/controllers/customers/cartcontroller')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')



//middlewares
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')


function initRoutes(app) {
app.get('/', homecontroller().index)
app.get('/login', guest, authcontroller().login)
app.post('/login', authcontroller().postLogin)
app.get('/register', guest, authcontroller().register)
app.post('/register', authcontroller().postRegister)
app.post('/logout', authcontroller().logout)

app.get('/cart', cartcontroller().index)
app.post('/update-cart', cartcontroller().update)


//customer routes
app.post('/orders', auth, orderController().store)
app.get('/customers/orders', auth, orderController().index)
app.get('/customers/orders/:id', auth, orderController().show)


//admin routes
app.get('/admin/orders', admin, adminOrderController().index)
app.post('/admin/order/status', admin, statusController().update)


}

module.exports = initRoutes