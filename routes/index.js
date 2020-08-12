
const express=require('express')
const router=express.Router()
const{ensureAuthenticated,ensureGuest}=require('../config/auth')

//story model
const Story=require('../models/Story')


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
router.get('/dashboard',ensureAuthenticated,async(req,res)=>{
    try{
        const stories=await Story.find({user:req.user.id}).lean()
        res.render('dashboard',{
            name: req.user.name,
            stories
        })
    }catch(err){
        console.error(err)
    }
    
})

module.exports=router