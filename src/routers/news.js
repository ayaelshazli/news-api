const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')


//////////////////////////
// Add 

router.post('/news',auth,async(req,res)=>{
    // ... spread operator --> Take copy of data
    const news = new News({...req.body,owner:req.user._id})
    try{
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})
/////////////////////////////////////
// get all

router.get('/news',auth,async(req,res)=>{
    try{
       await req.user.populate('news').execPopulate()
       res.send(req.user.news)
    }
    catch(e){
        res.status(500).send(e)
    }
})
////////////////////////////////////
// get by id

router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOne({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send('News not found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})
///////////////////////////////////
// patch
router.patch('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try{
        const news = await News.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('News is not found')
        }
        updates.forEach((update)=> news[update] = req.body[update])
        await news.save()
        res.send(news)
    }
    catch(e){
        res.status(400).send(e)
    }

})
///////////////////////////
// Delete
router.delete('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOneAndDelete({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send('News is not found')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})
////////////////////////////////////////
//upload

const upload = multer({
    limits:{
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
                return cb(new Error('Please upload an image'))
            }
            cb(null. true)
        }
    }
})
/////////////////////////////////
//news id

router.post('/newsAvtar/:id', auth,upload.single('image'),async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOne({_id,owner:req.user._id})
        if(!news){
            return res.send('no news to add image')
        }
        news.image = req.file.buffer
        await news.save()
        res.send('saved')
    }
    catch(e){
        res.send(e)
    }
})
//////////////
module.exports = router