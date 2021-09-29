const flash = require('express-flash')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authcontroller(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/'
    }
    
    return{
        login(req, res){
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { email, password} = req.body
            //validate req.
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, () => {
                    if(err) {
                        req.flash('error', info.message )
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
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
                // req.flash('error', 'login with email and password again')
                return res.render('auth/login')

            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/')
            })
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}
module.exports = authcontroller