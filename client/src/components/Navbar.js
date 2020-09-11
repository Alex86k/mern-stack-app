import React, {useContext, useRef, useState, useEffect, useCallback} from 'react'
import {NavLink, useHistory} from "react-router-dom"
import {AuthContext} from "../context/AuthContext";
import M from 'materialize-css'
import {useHttp} from "../hooks/http.hook";


export const Navbar = () => {
    const history = useHistory()
    const {token, userId, logout, isAuthenticated} = useContext(AuthContext)
    const searchModal = useRef(null)
    const {request} = useHttp()
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const logoutHandler =  event => {
        event.preventDefault()
        logout()
        history.push('/')
    }

    const searchUsers = useCallback(async (query) => {
        try {
            await setSearch(query)
            const res = await request('/api/user/searchUsers', 'POST', {query}, {
                Authorization: `Bearer ${token}`
            })
            setUserDetails(res)
        } catch (e) {}
    }, [request, token, setUserDetails, setSearch])

    const links = []

    if (isAuthenticated) {
        links.push(<li key="1" className="li-search modal-trigger" data-target="modal1"><i  className="large material-icons ">search</i></li>)
        links.push(<li key="2"><NavLink to={`/user/${userId}`} activeClassName="active-tab">Моя страница</NavLink></li>)
        links.push(<li key="3"><NavLink to="/news" activeClassName="active-tab">Новости</NavLink></li>)
        links.push(<li key="4"><NavLink to="/" onClick={logoutHandler}>Выйти</NavLink></li>)
    } else {
        links.push(<li key="5"><NavLink exact to="/" activeClassName="active-tab">Вход</NavLink></li>)
        links.push(<li key="6"><NavLink exact to="/register" activeClassName="active-tab">Регистрация</NavLink></li>)
    }


    return (
        <nav>
            <div className="nav-wrapper gradient-45deg-indigo-purple">
                <a href="/" className="brand-logo">Logo</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {links}
                </ul>
            </div>

            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <div className='row'>
                        <div className='input-field col s12'>
                            <input
                                className='validate'
                                type='text'
                                name='login'
                                id='login'
                                autoComplete="off"
                                value={search}
                                onChange={e => searchUsers(e.target.value)}
                            />
                            <label htmlFor='login'>Логин пользователя</label>

                        </div>
                    </div>

                    <ul className="collection" >
                        {userDetails.map(item => {
                            return <NavLink key={`${item._id}`} to={`/user/${item._id}`} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item indigo-text text-darken-1"  >{item.name?.firstName} {item.name?.lastName}</li></NavLink>
                        })}

                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Закрыть</button>
                </div>
            </div>
        </nav>
    )
}