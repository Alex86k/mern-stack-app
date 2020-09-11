const {Router} = require('express')
const Subscriber = require('../models/subscriber')
const User = require('../models/user')
const Post = require('../models/post')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.post('/subscribeNumber', auth,  async (req, res) => {
    try {
        const follow = await Subscriber.find({userTo: req.body.currentUser})
        const following = await Subscriber.find({userFrom: req.body.currentUser})

        res.json({followNumber: follow.length, followingNumber: following.length})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})


router.post('/isSubscribed', auth,  async (req, res) => {
    try {
        const subscribe = await Subscriber.find({ userFrom: req.body.userFrom, userTo: req.body.userTo})

        let result = false;
        if (subscribe.length !== 0) {
            result = true
        }
        res.json(result)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }

})


router.post('/', auth,  async (req, res) => {

    try {
        const subscribe = new Subscriber({userFrom: req.body.userFrom, userTo: req.body.userTo})
        await subscribe.save()
        res.status(201).json({message: 'Вы подписались'})
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})


router.post('/unSubscribe', auth,  async (req, res) => {

    try {
        await Subscriber.findOneAndDelete({userFrom: req.body.userFrom, userTo: req.body.userTo})
        res.status(200).json({message: 'Вы отписались'})
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }

})

router.post('/getSubscriptions', auth,   async (req, res) => {
    try {
        let mas = []
        await Subscriber.find({ userTo: req.body.userFrom }, (err, subs) => {
            if (err) return console.error(err)

            subs.map(sub => {
                mas.push(sub.userTo)
            })
        })

        const users = await User.find({ _id: { $in: mas }})
        res.json(users)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.post('/getSubscribers', auth,   async (req, res) => {
    try {
        let mas = []
        await Subscriber.find({ userTo: req.body.userTo }, (err, subs) => {
            if (err) return console.error(err)

            subs.map(sub => {
                mas.push(sub.userFrom)
            })
        })

        const users = await User.find({ _id: { $in: mas }})
        res.json(users)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})


router.post('/getSubscribersPosts', auth,   async (req, res) => {
    try {
        let mas = []
        let usersPosts = []
        await Subscriber.find({ userFrom: req.body.userFrom }, (err, subs) => {
            if (err) return console.error(err)

             subs.map(sub => {
                mas.push(sub.userTo)
            })
        })

        const posts = await Post.find({ author: { $in: mas }}).sort({ created: 'desc' })
        const users = await User.find({ _id: { $in: mas }})
        await posts.map(post => {
            const user1 = (users.find(user => user._id.toString() === post.author.toString()))

                    post = {post, name: user1.name, image: user1.image}
                    usersPosts.push(post)

        })
         res.json(usersPosts)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
})


module.exports = router;