//moving between pages and storing the passwords
const express=require('express')
const passport=require('passport')
const router=express.Router()
const bcrypt=require('bcrypt')
const flash=require('express-flash')
const session=require('express-session')
const dotenv= require('dotenv')
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
    res.render('Login',{
        layout: 'login',
    })
})

//register page
//@route Get /
router.get('/register',(req,res)=>{
    res.render('Register',{
        layout: 'register',
    })
})

router.post('/',passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect: '/',
    failureFlash: true

}))

router.post('/register',async (req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})


//dashboard page
//@route Get /dashboard
router.get('/dashboard',(req,res)=>{
    res.render('Dashboard')
})

module.exports=router