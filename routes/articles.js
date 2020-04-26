const express = require('express')
const router = express.Router();

//Bring in Article model
let Article = require('../models/articles');
let User =require('../models/user')
router.get('/add',(req,res)=>{
    res.render('add_article',{
        title: 'Add Articles'
    });

})

//Get Single article
router.get('/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
        User.findById(article.author,(err,user)=>{
            res.render('article',{
                article:article,
                author: user.name
            })
        })
    })
})

//Add Submit Post route
router.post('/add',ensureAuthenticated,(req,res)=>{
    req.checkBody('title','Title is required').notEmpty()
    // req.checkBody('author','Author is required').notEmpty()
    req.checkBody('body','Body is required').notEmpty()
    //get err
    let errors = req.validationErrors();
    if(errors){
        res.render('add_article',{
            errors:errors,
            title:'Add article'
        })
    }else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save((err)=>{
            if(err){
                console.log(err)
            }else{
                req.flash('success','Article added')
                res.redirect('/')
            }

        });
    }



})
//Load edit form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
        if(article.author != req.user._id) {
            req.flash('danger', 'Not authorized')
            res.redirect('/')
        }
        res.render('edit_article',{
            article:article,
            title:'Edit article'
        })
    })
})
//Update Submit Post route
router.post('/edit/:id',ensureAuthenticated,(req,res)=>{
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    let query ={_id:req.params.id}
    Article.updateOne(query,article,(err)=>{
        if(err){
            console.log(err)
        }else{
            req.flash('success','Article updated')
            res.redirect('/')
        }

    });

})

//Delete a article
router.delete('/:id',(req,res)=>{
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}
    Article.findById(req.params.id,(err,article)=>{
        if(article.author!=req.user._id){
            res.status(500).send();
        }else{
            Article.deleteOne(query,(err)=>{
                if(err){
                    console.log(err);
                }
                res.send('Success')
            })
        }

    })
})
//Add comment
router.post('/comment/:id',(req,res)=>{
    let author_id=req.params.id;
    let data = JSON.stringify(req.body)
    let comment = JSON.stringify(req.body.comment);
    let number = parseInt(JSON.stringify(req.body.number));
    console.log(author_id,data,comment,number);
    res.status(200).send('Success');
    console.log('comment added');
})


//Access Control
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger',"Please login");
        res.redirect('/users/login')
    }

}


module.exports = router;