import {useState, useCallback,  useContext} from 'react'
import {useHttp} from "./http.hook";
import {AuthContext} from "../context/AuthContext";

export const useSubscribe = () => {

    const { request } = useHttp()
    const { token } = useContext(AuthContext)

    const [isSubscribed, setSubscribed] = useState(false)
    const [followNumber, setFollowNumber] = useState(0)
    const [followingNumber, setFollowingNumber] = useState(0)

    const checkSubscribed = useCallback(async (userFrom, userTo) => {
        try {
            const res = await request(`/api/subscribe/isSubscribed`, 'POST', {userFrom, userTo}, {
                Authorization: `Bearer ${token}`
            })
            setSubscribed(res)

        } catch (e) {
        }
    }, [request, token])

    const getSubscribeNumber = useCallback(async (currentUser) => {
        try {
            const countOfSubscribe = await request(`/api/subscribe/subscribeNumber`, 'POST',  { currentUser }, {
                Authorization: `Bearer ${token}`
            })

            setFollowNumber(countOfSubscribe.followNumber)
            setFollowingNumber(countOfSubscribe.followingNumber)
        } catch (e) {
        }
    }, [request, token])

    const subscribe = useCallback(async (userFrom, userTo) => {
        try {
            await request(`/api/subscribe/`, 'POST', {userFrom, userTo}, {
                Authorization: `Bearer ${token}`
            })
            setSubscribed(true)
            setFollowNumber(followNumber + 1)
        } catch (e) {
        }
    }, [request, token, setSubscribed, setFollowNumber, followNumber])


    const unSubscribe = useCallback(async (userFrom, userTo) => {
        try {
            await request(`/api/subscribe/unSubscribe`, 'POST', {userFrom, userTo}, {
                Authorization: `Bearer ${token}`
            })
            setSubscribed(false)
            setFollowNumber(followNumber - 1)

        } catch (e) {
        }
    }, [request, token, setSubscribed, setFollowNumber, followNumber])




    return {checkSubscribed, getSubscribeNumber, subscribe, unSubscribe, isSubscribed, setFollowNumber, followNumber,setFollowingNumber, followingNumber}
}