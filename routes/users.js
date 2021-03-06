//moving between pages and storing the passwords
//First call the necessary libraries and create a router. Remember to export router

const express=require('express')
const passport=require('passport')
const bcrypt=require('bcryptjs')
const dotenv= require('dotenv')

const router=express.Router()
const User=require('../models/Users')

const{ensureAuthenticated,ensureGuest}=require('../config/auth')


dotenv.config({path:'./../config/config.env'})

//login/landing page
//@route Get /
router.get('/login', ensureGuest,(req,res)=>{
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

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
    })(req,res,next);
})

router.post('/register', (req,res)=>{
    try{
        const{name,email,password,password2}=req.body;
        let errors=[]
        
        //check if all fields filled in
        if(!name||!email||!password||!password2){
            errors.push({msg:'Please fill in all fields'})
        }

        //check passwords length
        if(password.length<8){
            errors.push({msg:'Password should be at least 8 characters'})
        }

        //check passwords match
        if(password!==password2){
            errors.push({msg:'Passwords do not match'})
        }

        if(errors.length>0){
            //console.log(errors)
            res.render('register',{
                layout: 'register',
                errors,
                name,
                email,
                password,
                password2
            })
        }else{
            User.findOne({email: email})
                .then(user=>{
                    if(user){
                        //user exists
                        errors.push({msg: 'Email is already registered'})
                        res.render('register',{
                            layout: 'register',
                            errors,
                            name,
                            email,
                            password,
                            password2
                        })
                    }else{
                        
                        const newUser=new User({
                            name,
                            email,
                            password
                        })
                        
                        //Hash password
                        bcrypt.genSalt(10,(err,salt)=>
                            bcrypt.hash(newUser.password,salt,(err,hash)=>
                            {
                                if(err) throw err;
                                newUser.password=hash
                                newUser.save()
                                    .then(user=>{
                                        req.flash('success_msg','You are now registered. Please log in.')
                                    res.redirect('/users/login')
                                })
                                    .catch(err=>console.log(err));
                            }))
                        
                    }
                })
            
        }
    }catch(e){
        console.log(e)
        res.redirect('/users/register')
    }
    
})


//dashboard page
//@route Get /dashboard
router.get('/dashboard',(req,res)=>{
    res.render('Dashboard')
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')
})

module.exports=router