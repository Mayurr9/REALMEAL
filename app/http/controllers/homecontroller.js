const Menu = require('../../models/menu')
const userss = require('../../models/user')
const msg = require('../../models/message')

var moment = require('moment');

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
            const userID = req.params.id
            // console.log(userID)
            const user_id = await userss.findById(userID)
           if(user_id){
               res.render('contact' , {user: user_id})
           }
        },

        async postContact (req,res) {
            // Grab the data from user and store in database for further query resolution -- {START} --
        const addNewMsg = new msg({
            name: req.body.customerName,
            email: req.body.customerEmail,
            customerId : req.body.customerID,
            orderId : req.body.orderId,
            customerMessage: req.body.customerMessage,
            
        });
        // Grab the data from user and store in database for further query resolution -- {END} --

        //  save new message !
        const newMessage = await addNewMsg.save();

        res.render("contact")
        },

        async adMessage(req, res) {   
            const getMsg = await msg.find({}).sort({ _id: -1 });
        var receivedAt = req.body.receivedAt;
        let createdOn = moment(receivedAt).toString();      
            res.render('admin/adMessage', { getMsg, moment: moment })
        }
    }
}


module.exports = homecontroller


