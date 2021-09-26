const flash = require('express-flash')
const User = require('../../models/user')
const bcrypt = require('bcrypt')

function authcontroller(){
    return{
        login(req, res){
            res.render('auth/login')
        },

        register(req, res){
            res.render('auth/register')
        },
        async postRegister(req, res) {
            const { name, email, password} = req.body
            //validate req.
            if(!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }
            
            //check if email exist
            User.exists({ email: email }, (err, result) =>  {
                if(result) {
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
                }
            })

            const hashedPassword = await bcrypt.hash(password, 10)
            //create a user //hash password
            const user = new User({
                name,
                email,
                password: hashedPassword
            })

            user.save().then((user) => {
               
                return res.redirect('/')

            }).catch(err => {
                req.flash('error', 'Something went wrong')

            })
// strange nantr baghu nahitr
// auth controller complete nai kela tu?? video madhi jitKA ZALA TITKA COMPLETE AHE
            console.log(req.body)
        }
    }
}
module.exports = authcontroller
