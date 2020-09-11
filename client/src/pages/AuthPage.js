import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const history = useHistory()
    const {loading, error, clearError, request} = useHttp()
    const [form, setForm] = useState({
         email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const loginHandler = async event => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
            history.push(`/user/${data.userId}`)
        } catch (e) {}
    }
    
    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h3 className="center-align indigo-text text-darken-1">Авторизация</h3>
                <form className="col s12" method="post">
                    <div className='row'>
                        <div className='col s12'>
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

                    <br/>

                    <div className='row'>
                        <button
                            type='submit'
                            name='btn_login'
                            className='col s12 btn btn-large waves-effect indigo darken-1'
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Войти
                        </button>
                    </div>
                    <hr/>
                    <div className='row'>
                        <button
                            type='submit'
                            name='btn_registr'
                            className='col s8 offset-s2 btn btn-small waves-effect grey'
                        >
                            Забыли пароль?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
