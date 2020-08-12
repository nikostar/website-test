
const express=require('express')
const router=express.Router()
const{ensureAuthenticated}=require('../config/auth')

//story model
const Story=require('../models/Story')


//show add page
//@route Get /stories/add
router.get('/add',ensureAuthenticated,(req,res)=>{
    //res.locals.session = req.flash();.{message:'123232'};
    res.render('stories/add')
}) 

//Process add form
//@route POST /stories
router.post('/',ensureAuthenticated, async(req,res)=>{
    try{
        req.body.user=req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch(err){
        console.log(err)
    }
    
}) 

module.exports=router