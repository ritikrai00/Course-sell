const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require('jsonwebtoken')
const {Admin, Course}=require('../db')
const {JWT_SECRET} = require("../config");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    const username=req.body.username
    const password=req.body.password

    //check if user already  exist or not
    await Admin.create({
        username,
        password
    })
    res.json({message: 'Admin created successfully'})
});

router.post('/signin', (req, res) => {
    const username=req.body.username
    const password=req.body.password

    const user=Admin.find({
        username,
        password
    })
    if(user){
        const token = jwt.sign({username}, JWT_SECRET);
        res.json({
            token
        })
    }else{
        res.status(411).json({
            msg: "Incorrect email and password"
        })
    }

    
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const title=req.body.title;
    const discription=req.body.discription;
    const imageLink=req.body.imageLink;
    const price=req.body.price;

    const newCourse=await Course.create({
        title,
        discription,
        imageLink,
        price
    })

    res.json({
        message: 'Course created successfully', 
        courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses=await Course.find({})
        res.json({
            courses: allCourses
        })
});

module.exports = router;