const Post = require('../models/post');

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
        // use req.body to create a new post
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
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
        res.redirect(`/posts/${post.id}`);
    },
    // posts destroy
    async postDestroy (req, res, next) {
        await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }
}