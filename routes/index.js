//moving between pages and storing the passwords
//First call the necessary libraries and create a router. Remember to export router

const express=require('express')
const passport=require('passport')
const bcrypt=require('bcrypt')
const flash=require('express-flash')
const session=require('express-session')
const dotenv= require('dotenv')

const router=express.Router()


const initializePassport=require('./../config/passport-config')
initializePassport(passport,email =>{
    return users.find(user=>user.email===email)
})
const users=[]

dotenv.config({path:'./../config/config.env'})
router.use(express.urlencoded({extended:false}))

router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
//login/landing page
//@route Get /
router.get('/',(req,res)=>{
    res.locals.session = req.flash(); //.{message:'123232'};
    res.render('welcome',{
        layout: 'login',
    })
})


//dashboard page
//@route Get /dashboard
router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

module.exports=router