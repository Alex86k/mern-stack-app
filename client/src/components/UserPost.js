import React, {useState} from "react";
import {dateConverter} from "../modules/dateConverter";

export const UserPost = ({userData, isOwnPage, addPost, image}) => {
    const [text, setText] = useState('')
    const user = userData?.user
    const posts = userData?.posts


    const changeHandler = event => {
        setText(event.target.value)
    }

    return (
        <div className="col s12 m8 l6">
            <div className="row">
                <div className="card user-card-negative-margin z-depth-0" id="feed">
                    <div className="card-content card-border-gray">
                        <div className="row">
                            <div className="col s12 ">
                                <h5>{user?.name?.firstName} {user?.name?.lastName}</h5>
                                <p></p>
                            </div>
                        </div>


                        {isOwnPage && (
                            <form className="col s12" method="post">
                                <div className='row'>
                                    <div className='col s12'>
                                    </div>
                                </div>
                                <div className="row">
                                    <form className="col s12">
                                        <div className="row">
                                            <div className="input-field col s12">
                                            <textarea
                                                onChange={changeHandler}
                                                name="textarea2"
                                                id="textarea2"
                                                className="materialize-textarea"></textarea>
                                                <label htmlFor="textarea2">Новый пост</label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <br/>

                                <div className='row'>
                                    <button
                                        type='submit'
                                        name='btn_add_post'
                                        className='col s12 btn btn-small waves-effect indigo darken-1'
                                        onClick={function () {
                                            addPost(text)
                                        }}

                                    >
                                        Добавить
                                    </button>
                                </div>
                                <hr/>
                            </form>
                        )}


                        <div className="row"></div>
                        {posts?.map(post =>
                            <React.Fragment key={post._id}>
                                <div className="row mt-5">
                                    <div className="col s1 pr-0 ">
                                        <div className="small-photo">
                                            <img key={post._id} className="responsive-img personPhoto"
                                                 src={image || user.image || ''} alt=""/>
                                        </div>
                                    </div>
                                    <div className="col s11">
                                        <p className="m-0" id="post-head">{user?.name?.firstName} {user?.name?.lastName}&nbsp;
                                            <span><i
                                                className="material-icons vertical-align-bottom">access_time&nbsp;</i>
                                                {dateConverter(post?.created)}</span></p>
                                        <div className="row">
                                            <div className="col s12">
                                                <div className="card card-border z-depth-2">
                                                    <div className="card-content">{post?.text}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-5"/>
                            </React.Fragment>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}