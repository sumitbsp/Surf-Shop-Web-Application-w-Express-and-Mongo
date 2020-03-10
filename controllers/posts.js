const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'sumitbsp',
    api_key: '443418978116892',
    api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
    // Post Index
    async postIndex (req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },
    // Post New
    postNew (req, res, next) {
        res.render('posts/new')
    },
    // posts create
    async postCreate (req, res, next) {
        req.body.post.images = [];
        for (const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            })
        }
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`);
    },
    // posts show
    async postShow (req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    },
    // posts edit
    async postEdit (req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },
    // posts update
    async postUpdate (req, res, next) {
        console.log(req.params.id);
        let post = await Post.findByIdAndUpdate(req.params.id);
        // check if there is any image deletion
        if (req.body.deleteImages && req.body.deleteImages.length) {
            let deleteImages = req.body.deleteImages;
            // loop over delete images
            for (const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete images from post.images
                for(const image of post.images) {
                    if(image.public_id === public_id) {
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1);   
                    }
                }
            }
        }
        // check if there are new images for upload
        if (req.files) {
            // upload images
            for (const file of req.files) {
                let image = await cloudinary.v2.uploader.upload(file.path);
                // add images to post.images array
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                })
            }  
        }

        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        post.location = req.body.post.location;

        // save the post on db
        post.save();

        res.redirect(`/posts/${post.id}`);
    },
    // posts destroy
    async postDestroy (req, res, next) {
        let post = await Post.findById(req.params.id);
        for(const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        post.remove();
        res.redirect('/posts');
    }
}