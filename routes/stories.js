
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

//show all stories
//@route Get /stories/add
router.get('/',ensureAuthenticated,async(req,res)=>{
    //res.locals.session = req.flash();.{message:'123232'};
    try{
        const stories=await Story.find({status:'public'})
            .populate('user')
            .sort({createdAt:'desc'})
            .lean()
        res.render('stories/index',{
            stories
        })
    }
    catch (err){
        console.log(err)
    }
}) 

//show edit page
//@route Get /stories/edit/:id
router.get('/edit/:id',ensureAuthenticated,async(req,res)=>{
    try{    
        const story=await Story.findOne({
            _id:req.params.id
        }).lean()

        if(!story){
            console.log('No story')
        }

        if(story.user!=req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story
            })
        }
        
    }catch(err){
        console.log(err)
    }
}) 

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        console.error('No story')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
  })

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        console.error('No Story')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
  })

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate('user').lean()
  
      if (!story) {
        console.error('No Story')
      }
  
      res.render('stories/show', {
        story,
      })
    } catch (err) {
      console.error(err)
    }
  })

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
    }
  })

module.exports=router