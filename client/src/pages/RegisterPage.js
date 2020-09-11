import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
const config = require('config')


export const RegisterPage = () => {
    const message = useMessage()
    const history = useHistory()
    const {loading, error, clearError, request} = useHttp()

    const [image, setImage] = useState('')

    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', password: '', login: ''
    })


    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async event => {

        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'mern-stack-app')
        formData.append('cloud_name', 'dieq4abgy')

        try {
            event.preventDefault()

            await fetch(config.get('cloudinaryUri'), {
                method: "post",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    request('/api/auth/register', 'POST', {...form, image: data.url})
                    history.push('/login')
                })
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h3 className="center-align indigo-text text-darken-1">Регистрация</h3>
                <form className="col s12" method="post">

                    <div className="row">
                        <div className="input-field col s6">
                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                className="validate"
                                required={true}
                                onChange={changeHandler}
                            />
                            <label htmlFor="first_name">Ваше Имя</label>
                        </div>
                        <div className="input-field col s6">
                            <input
                                id="last_name"
                                type="text"
                                name="last_name"
                                className="validate"
                                onChange={changeHandler}
                            />
                            <label htmlFor="last_name">Ваша Фамилия</label>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='input-field col s12'>
                            <input
                                className='validate'
                                type='text'
                                name='login'
                                id='login'
                                onChange={changeHandler}
                            />
                            <label htmlFor='login'>Введите ваш логин</label>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='input-field col s12'>
                            <input
                                className='validate'
                                type='email'
                                name='email'
                                id='email'
                                onChange={changeHandler}
                            />
                            <label htmlFor='email'>Введите ваш email</label>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='input-field col s12'>
                            <input
                                className='validate'
                                type='password'
                                name='password'
                                id='password'
                                onChange={changeHandler}
                            />
                            <label htmlFor='password'>Введите ваш пароль</label>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='file-field input-field'>
                            <div className="btn indigo darken-1">
                                <span>Изображение профиля</span>
                                <input
                                    type='file'
                                    name='image'
                                    id='image'
                                    onChange={(e) => {
                                        setImage(e.target.files[0])
                                    }}
                                />

                            </div>
                            <div className='file-path-wrapper'>
                                <input className='file-path validate' type="text"/>
                            </div>
                        </div>
                    </div>
                    <br/>

                    <div className='row'>
                        <button
                            type='submit'
                            name='btn-register'
                            className='col s12 btn btn-large waves-effect indigo darken-1'
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
