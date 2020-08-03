const path=require('path')
const express= require('express')
const morgan=require('morgan')
const connectDB=require('./config/db')
const exphbs=require('express-handlebars')
const dotenv= require('dotenv')

//load config... Private variables
dotenv.config({path:'./config/config.env'})
connectDB()

const app=express()

//logging using morgan
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//handlebars for webpages
app.engine('.hbs',exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Static folder for css stuff
app.use(express.static(path.join(__dirname,'public')))

//Routes. Folder to route the pages for order
app.use('/',require('./routes/index'))

const PORT=process.env.PORT||3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
