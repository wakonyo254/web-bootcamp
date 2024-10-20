const express = require('express');
const { registerUser, loginUser, logoutUser, getUser, editUser } = require('../controllers/userController');
const { check } = require('express-validator');  //validation purposes
const router = express.Router();     //aids in directing requests

// registration router  ***perform some basic validation
router.post( 
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({min: 6 })
    ],
    registerUser
);

//login route
router.post('/login', loginUser);

//getUser
router.get('/individual', getUser);

//edit user
router.put(
    '/individual/edit',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({min: 6 })
    ],
     editUser
    );
    //logout
    router.get('/logout', logoutUser);

    module.exports = router;
