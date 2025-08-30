const router = require('express').Router();
let User = require('../models/userModel');

router.route('/register').post((req,res) => {
    const {username, password, industry} = req.body;

    const newUser = new User({
        username,
        password,
        industry
    });
    newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;