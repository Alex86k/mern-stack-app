const {Router} = require('express')
const User = require('../models/user')
const Post = require('../models/post')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.put('/userUpdate', auth,  async (req, res) => {
    try {

        const updateUser = await User.findByIdAndUpdate(req.body.id, {$set: {image: req.body.url}}, {
            new: true,
            useFindAndModify: false
        })
        res.json(updateUser)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.post('/searchUsers', auth,  async (req, res) => {
    try {
        const userPattern = new RegExp('^' + req.body.query)
        const searchUser = await User.find({ login: {$regex: userPattern}})
            .select("_id name")
        res.json(searchUser)

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})


router.post('/:id', auth, async (req, res) => {
    try {
        const post = new Post({author: req.user.userId, text: req.body.text })
        await post.save()
        res.status(201).json({ post, message: 'Пост добавлен' })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})


router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const posts = await Post.find({ author: req.params.id}).sort({ created: 'desc' })
        res.json({user,posts})
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})



module.exports = router