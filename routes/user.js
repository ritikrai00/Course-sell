const { Router } = require("express");
const router = Router();
const {User, Course}=require('../db')
const jwt = require('jsonwebtoken')
const {JWT_SECRET}=require('../config.js')
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', async (req, res) => {
    const username=req.body.username
    const password=req.body.password

    //cheack if user already  exist or not
    await User.create({
        username,
        password
    })
    res.json({message: 'User created successfully'})
});

router.post('/signin', async (req, res) => {
    const username=req.body.username
    const password=req.body.password

    const user=await User.find({
        username,
        password
    })
    if(user){
        const token=jwt.sign({username}, JWT_SECRET)
        res.json({
            token
        })
    }else{
        res.status(403).json({msg: "Wrong user authentication"})
    }
});

router.get('/courses', async (req, res) => {
    const courses=await Course.find({});
    res.json({
        courses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    
    const username=req.username;
    const courseId=req.params.courseId;
    await User.updateOne({username},{
        "$push":{
            purchasedCourses:courseId
        }
    })
    res.json({
        msg: "Purchase complete"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const username=req.username;
    const user=await User.findOne({
        username
    })
    const course=await Course.find({
        _id:{
            "$in":user.purchasedCourses
        }
    })
    res.json({
        course
    })
});

module.exports = router