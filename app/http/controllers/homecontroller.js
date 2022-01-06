const Menu = require('../../models/menu')
const userss = require('../../models/user')
const msg = require('../../models/message')
const order = require('../../models/order')

var moment = require('moment');

function homecontroller(){
    return{
        async index(req, res){
            const realmeals = await Menu.find()
            return res.render('home', { realmeals: realmeals })
        },
        async profile(req, res) {
            const userID = req.params.id
            // console.log(id)
            const user_id = await userss.findById(userID)
            const getMsg = await msg.find({customerId : userID}).sort({ _id: -1 });

            const getOrderCountAll = await order.count({customerId : userID}, function (err, count) {
                console.log("Number of All orders:", count);
            })
            const getCompletedOrder = await order.count({ customerId: userID , status : 'completed'}, function (err, count) {
                console.log("Number of completed orders:", count);
            })

            const getMsgCountAll = await msg.count({customerId : userID}, function (err, count) {
                console.log("Number of user msg:", count);
            })
            const getResponsedCount = await msg.count({ customerId: userID , adminMessage: { $ne: 'false' }}, function (err, count) {
                console.log("Number of msg admin responsed:", count);
            })

            const orders = await order.find({ customerId: userID , status : 'completed'},
                null,
                { sort: { 'createdAt': -1 }})
            const ordersCan = await order.find({ customerId: userID , status : 'cancelled'},
                null,
                { sort: { 'createdAt': -1 }})
           if(user_id){

               res.render('customers/profile' , {user: user_id , userMsg : getMsg , userOrder : orders, userCanOrder : ordersCan , allOrder: getOrderCountAll, comOrder: getCompletedOrder, countMsg: getMsgCountAll, resMsg: getResponsedCount })
           }
        },
        async contact(req, res) {
            var id = req.query.oid;
        
            
          
            const userID = req.params.id
            console.log(id)
            const user_id = await userss.findById(userID)
           if(user_id){
               res.render('contact' , {user: user_id , oid : id})
           }
        },

        async postContact (req,res) {

            try {

            // var id = req.query.oid;
            var id = req.query.oid;
            console.log(id)
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

        res.render('contact' , { oid : id}) 
    }catch (e) {
        res.send(e);
        // if user is not logged in ... render him to login page !
        console.log(e);
    }
        },

        async adMessage(req, res) {   
            const getMsg = await msg.find({}).sort({ _id: -1 });
        var receivedAt = req.body.receivedAt;
        let createdOn = moment(receivedAt).toString();      
            res.render('admin/adMessage', { getMsg, moment: moment })
        },
        async adminReply(req, res) {   
            var id = req.body.id;
            var admessage = req.body.admessage;
            const updateUser = await msg.updateOne({ _id: id }, { $set: { adminMessage: admessage }});
            // console.log(updateUser);
            const getMsg = await msg.find({}).sort({ _id: -1 });
            var receivedAt = req.body.receivedAt;
            let createdOn = moment(receivedAt).toString();      
            res.render('admin/adMessage', { getMsg, moment: moment })
        }
    }
}


module.exports = homecontroller


