
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
app.post("/remove-cart", cartcontroller().remove);

var moment = require('moment');
// const { count } = require("console");
app.locals.moment = require('moment');

//customer routes
app.post('/orders', auth, orderController().store)
app.get('/customers/orders', auth, orderController().index)
app.get('/customers/orders/:id', auth, orderController().show)
app.get('/contact/:id', auth , homecontroller().contact)
app.get('/profile/:id', auth, homecontroller().profile)

app.post('/contact/:id', homecontroller().postContact)

//admin routes
app.get('/admin/orders', admin, adminOrderController().index)
app.post('/admin/order/status', admin, statusController().update)
app.get('/admin/messages',admin,  homecontroller().adMessage)



app.get('*',  homecontroller().error)

}

module.exports = initRoutes