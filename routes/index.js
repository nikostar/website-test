
const express=require('express')
const router=express.Router()
const{ensureAuthenticated,ensureGuest}=require('../config/auth')


//login/landing page
//@route Get /
router.get('/',(req,res)=>{
    //res.locals.session = req.flash();.{message:'123232'};
    res.render('welcome',{
        layout: 'login',
    })
})


//dashboard page
//@route Get /dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name: req.user.name
    })
})

module.exports=router