import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {UserProfile} from "../components/UserProfile";
import {UserPost} from "../components/UserPost";
import {Loader} from "../components/Loader";
import {useSubscribe} from "../hooks/subscription.hook";


export const UserPage = () => {
    const {token, userId} = useContext(AuthContext)
    const {loading,  request} = useHttp()
    const { checkSubscribed, getSubscribeNumber, subscribe,
        unSubscribe, isSubscribed, followNumber,
        followingNumber, setFollowNumber } = useSubscribe()
    const [userData, setUserData] = useState({})
    const [image, setImage] = useState(null)

    const currentPageId = useParams().id
    const isOwnPage = userId === currentPageId



    const getUserData = useCallback(async () => {
        try {
            const user = await request(`/api/user/${currentPageId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            await setUserData(user)

        } catch (e) {}
    }, [request, token, setUserData, currentPageId])

    useEffect(() => {
        getUserData()

        if (!isOwnPage) {
             checkSubscribed(userId, currentPageId)
        }
         getSubscribeNumber(currentPageId)

    }, [checkSubscribed, getSubscribeNumber, getUserData, currentPageId, userId, isOwnPage])


    const subscribeHandler = async event => {
        event.preventDefault()

        if (!isSubscribed) {
            await subscribe(userId, currentPageId)
            await setFollowNumber(followNumber + 1)
        } else {
            await unSubscribe(userId, currentPageId)
            await setFollowNumber(followNumber - 1)
        }
    }


    const addPost = useCallback(async (text) => {
        try {
            const res = await request(`/api/user/${userId}`, 'POST', {author: userId, text}, {
                Authorization: `Bearer ${token}`
            })
            await setUserData({...userData, posts: [res.post, ...userData.posts]})
        } catch (e) {}
    }, [request, token, userId, userData])

    



    if (loading) {
        return <Loader/>
    }

    return (
        <>

            <div className="content-wrapper-before gradient-45deg-indigo-purple"/>
            <div className="section">
                <div className="row user-profile mt-1 ml-0 mr-0">
                    <img className="responsive-img" alt=""
                         src="https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/gallery/profile-bg.png"/>
                </div>
                <div className="section" id="user-profile">
                    <div className="row">
                        {!loading && <UserProfile userData={userData}
                                                  isOwnPage={isOwnPage}
                                                  subscribeHandler={subscribeHandler}
                                                  followingNumber={followingNumber}
                                                  followNumber={followNumber}
                                                  isSubscribed={isSubscribed}
                                                  userImage={userData.user?.image}
                                                  setImage={setImage}
                                                  image={image}

                        />}
                        { !loading && <UserPost userData={userData} isOwnPage={isOwnPage} addPost={addPost} setImage={setImage}
                                                image={image}/> }
                    </div>
                </div>
            </div>
        </>
    )
}
