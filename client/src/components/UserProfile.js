import React from "react";
import {useHttp} from "../hooks/http.hook";
import {useAuth} from "../hooks/auth.hook";
const config = require('config')


export const UserProfile = ({ isOwnPage, subscribeHandler, followNumber, followingNumber,
                                isSubscribed, userImage, setImage, image }) => {


    const {request} = useHttp()
    const {userId, token} = useAuth()


    const updateHandler = async event => {

        const formData = new FormData()
        formData.append('file', event.target.files[0])
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
                    setImage(data.url)
                     request(`/api/user/userUpdate`, 'PUT', {id: userId, url: data.url}, {
                        Authorization: `Bearer ${token}`
                    })

                })

        } catch (e) {}

    }
    return (
        <div className="col s12 m4 l3 user-section-negative-margin">

            <div className="row">
                <div className="col s12 center-align">
                    <div className="photo">
                    <img className="responsive-img personPhoto z-depth-5" width="120"
                         src={image || userImage} alt=""/>
                    </div>
                    <br/>

                    {!isOwnPage ? <button className={`waves-effect waves-light btn mt-5 border-radius-4 ${!isSubscribed ? 'pink accent-2' : 'grey' } `} onClick={subscribeHandler}> {!isSubscribed ? 'Подписаться' : 'Отписаться'}</button>
                    : <div className='row'>
                            <div className='file-field input-field'>
                                <div className="btn indigo darken-1">
                                    <span>Изменить фото</span>
                                    <input
                                        type='file'
                                        name='image'
                                        id='image'
                                        onChange={updateHandler}
                                    />

                                </div>
                                <div className='file-path-wrapper'>
                                    <input className='file-path validate' type="text"/>
                                </div>
                            </div>
                        </div> }
                </div>
            </div>

            <div className="row mt-5">
                <div className="col s6">
                    <h6>Подписчики</h6>
                    <h5 className="m-0 light-blue-text text-darken-1">{followNumber}</h5>
                </div>
                <div className="col s6">
                    <h6>Подписки</h6>
                    <h5 className="m-0 light-blue-text text-darken-1" >{followingNumber}</h5>
                </div>
            </div>

            <hr/>

        </div>
    )
}