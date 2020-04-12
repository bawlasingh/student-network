const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT ||8080;
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

//DB
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true ,useUnifiedTopology: true }).then(()=> console.log("DB Connected"));

mongoose.connection.on("error",err=>{
  console.log('DB Connection error:${err.message}');
});
//bring in routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/",postRoutes);
app.use("/",authRoutes);
app.use("/",userRoutes);

// error response for unauthorized login
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
