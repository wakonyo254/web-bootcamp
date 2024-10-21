const db = require('../config/db');  //connect to db
const bcrypt = require('bcryptjs');  //hash passwords
const { validationResult } = require('express-validator');  // validate on the backend as a doublecheck of the frontend
//validation will be on the route
// register user function
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
//check if errors in validation
if(!errors.isEmpty()){
    return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() });
}
//fetch input parameters from the req body
const { name, email, password } = req.body;
try{
    //check if user exists with the email  ***select email from users where email =?
    const [user] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
    if(user.length > 0){
        return res.status(400).json({ message: 'User already exists!' });
    }
    //prepare the data if user is new...hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //insert the records
    await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    //response
    return res.status(201).json({message: 'New user registered successfully.'});
} catch(error) {
 console.error(error);
 res.status(500).json({message: 'Error during registration', error: error.message});
}
}

//login
exports.loginUser = async (req, res) => {
    //fetch the email & passsword from req.body
   const { email, password } = req.body;
   try{
    //check if user exists
    const [user] = await db.execute('SELECT * FROM users WHERE  email = ?', [email]);  
    if(user.length === 0){
        return res.status(400).json({ message: 'User does not exists! Please register' });
    }
    //check password if user exists[compare with the passord stored]
    const isMatch = await bcrypt.compare(password, user[0].password);
    
    if(!isMatch){
        return res.status(400).json({message: 'Invalid email/password combination'});
    }
    //if a match create session  *saves on the req.session*
    req.session.userId = user[0].id;
    req.session.name = user[0].name;
    req.session.email = user[0].email;

    return res.status(200).json({message: 'Successfully login!'})
   } catch(error){
    console.error(error);
    return res.status(500).json({message: 'Error occured during login', error: error.message});
   }

}

//logout
exports.logoutUser = (req, res) =>{
   req.session.destroy( (err) => {
    if(err){
        console.error(err)
        return res.status(500).json({message: 'Error occured in logout', error: err.message});
    }
    return res.status(200).json({ message: 'Successfully logged out!'});
   }); 
}

//getuser information
exports.getUser = async (req, res) => {
//check if user is logged in/ authorised
if(!req.session.userId){
  return res.status(401).json({ message: 'Unauthorized!'});
}
   try{
    //fetch user
    const [user] = await db.execute('SELECT name, email FROM users WHERE id = ?', [req.session.userId]);
    if(user.length === 0){
        return res.status(400).json({ message: 'User not found!' });
    }
    return res.status(200).json({ message: 'User details fetched for editing', user: user[0] });
   } catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Error occured while fetching user details', error: error.message });
   }
}

//fuction for editing user information
exports.editUser = async (req, res) => {
    
    if(!req.session.userId){
        return res.status(401).json({ message: 'Unauthorized. Please login to continue.'});
     }
     const errors = validationResult(req);
    //check if errors in validation
    if(!errors.isEmpty()){
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() });
    }
    // fetch user details for request body   *401[unauthorized]*
    const { name, email, password } = req.body;
   
    //prepare data - hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await db.execute('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPassword, req.session.userId] );
        return res.status(200).json({ message: 'User details updated successfully'});
    } catch(error){
        console.error(error);
        return res.satus(500).json({ message: 'An error occured during edit', error: error.message});
    }
}