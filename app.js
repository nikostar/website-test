const path=require('path')
const express= require('express')
const morgan=require('morgan')
const mongoose=require('mongoose')
const connectDB=require('./config/db')
const exphbs=require('express-handlebars')
const dotenv= require('dotenv')
const methodOverride=require('method-override')
const flash=require('express-flash')
const passport=require('passport')
const session=require('express-session')
const MongoStore=require('connect-mongo')(session)
const app=express()

//load config... Private variables
dotenv.config({path:'./config/config.env'})

//Passport config
require('./config/passport-config')(passport)


connectDB()


//logging using morgan
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
)

//Handlebar helpers
const{formatDate,stripTags,editIcon,truncate,select}=require('./helpers/hbs')

//handlebars for webpages
app.engine('.hbs',exphbs({helpers:{formatDate,stripTags,editIcon,truncate,select},
    defaultLayout: 'main', 
    extname: '.hbs'}));
app.set('view engine', '.hbs');

//Static folder for css stuff
app.use(express.static(path.join(__dirname,'public')))





//session and flash
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//global variables

app.use((req,res,next)=>{
    res.locals.user=req.user||null
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    next();
})



//Routes. Folder to route the pages for order
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))
app.use('/stories',require('./routes/stories'))


const PORT=process.env.PORT||3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
