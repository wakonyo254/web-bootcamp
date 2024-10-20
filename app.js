const db = require('./config/db');   //database connection
const express = require('express');  // for web server
const bodyParser = require('body-parser');   // helps capture input parameters from a form
const session = require('express-session');    //capture and manage session
const MySqlStore = require('express-mysql-session')(session);     //helps store sessions to database
const dotenv = require('dotenv');      //manage environment variables
const path = require('path');

//initialize env management
dotenv.config();

//initialize app
const app = express();

//config middleware  a function/feature that lies btwn two interfaces
app.use(express.static(path.join(__dirname,'frontend')));
app.use(bodyParser.json());  //use json
app.use(bodyParser.urlencoded({extended: true }));  //capture form data

//config session store
const sessionStore = new MySqlStore({}, db);

//config session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60  // 1 hour
    }
}));

//config routes  //paths within web serve/web application
app.use('/telemedicine/api/users', require('./routes/userRoutes'));

app.use('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
})

const PORT = process.env.PORT || 5500;   //state a port value to use if the one on .env isn't found

//start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});