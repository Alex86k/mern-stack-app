const {Router} = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator');
const User = require('../models/user')
const router = Router()

router.post('/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('login', 'Введите ваш логин').notEmpty(),
        check('first_name', 'Введите ваше имя').notEmpty(),
        check('last_name', 'Введите вашу фпмилию').notEmpty(),
        check('password', 'Минимальная длина пароля - 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: errors.array(),
                    message: errors.array()[0].msg
                })
            }

            const {first_name, last_name, login, image, email, password} = req.body

            const emailExist = await User.findOne({email})
            const loginExist = await User.findOne({login})
            if (emailExist) {
                res.status(400).json({message: 'Данный email уже зарегистрирован в системе'})
            } else if (loginExist) {
                res.status(400).json({message: 'Данный login уже зарегистрирован в системе'})
            }

            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({
                name: {firstName: first_name, lastName: last_name},
                login,
                image,
                email,
                password: hashPassword
            })

            await user.save()

            res.status(201).json({message: 'Пользователь создан'})


        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

router.post('/login',
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: errors.array(),
                    message: errors.array()[0].msg
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: 'Пользователь с таким email не зарегистрирован'})
            }


            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// router.post('/logout',
//     async (req, res) => {
//         try {
//
//             res.clearCookie('token')
//                 .json('success')
//
//
//         } catch (e) {
//             res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
//         }
//     })

// router.get('/getToken',
//     async (req, res) => {
//         try {
//             const token = req.cookies.token
//             res.json(token)
//         } catch (e) {
//             res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
//         }
//     })


module.exports = router