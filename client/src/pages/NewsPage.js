import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {dateConverter} from "../modules/dateConverter";

export const NewsPage = () => {

    const [userData, setUserData] = useState([])
    const {request, loading} = useHttp()
    const {token, userId} = useContext(AuthContext)

    const getData = useCallback(async () => {
        try {
            const user = await request(`/api/subscribe/getSubscribersPosts`, 'POST', {userFrom: userId}, {
                Authorization: `Bearer ${token}`
            })
            await setUserData(user)
        } catch (e) {}
    }, [request, token, userId, setUserData])

    useEffect(() => {
        getData()

    }, [getData])

    if (loading) {
        return <Loader/>
    }

    return (
        <div className="row small-row">

            <h3>Новости</h3>
            {userData.map(post =>
                <React.Fragment key={post?.post?._id}>
                    <div className="row mt-5" >
                        <div className="col s1 pr-0 ">
                            <div className="small-photo">
                            <img className="responsive-img personPhoto"
                                             src={post.image} alt="" />
                            </div>
                        </div>
                        <div className="col s11">
                            <p className="m-0" id="post-head"><NavLink className="post-head" to={`/user/${post?.post?.author}`} >{post?.name?.firstName} {post?.name?.lastName}</NavLink> <span><i
                                className="material-icons vertical-align-bottom">access_time</i>
                                {dateConverter(post?.post?.created)}</span></p>
                            <div className="row">
                                <div className="col s12">
                                    <div className="card card-border z-depth-2">
                                        <div className="card-content">{post?.post?.text}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="mt-5"/>
                </React.Fragment>
            )}
        </div>

    )
}
