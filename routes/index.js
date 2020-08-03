const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const users=[]

router.use(express.urlencoded({extended:false}))
//login/landing page
//@route Get /
router.get('/',(req,res)=>{
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