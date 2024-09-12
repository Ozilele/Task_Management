import { useEffect, useState } from "react"
import api from "../api"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        authenticate().catch(() => {
            setIsAuthorized(false);
        })
    }, [])

    const refreshToken = async () => {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN)
        try {
            const response = await api.post("/api/auth/token/refresh/", {
                refresh: refresh_token,
            });
            if(response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch(err) {
            console.log(err)
            setIsAuthorized(false)
        }
    }

    const authenticate = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000 // to seconds
        if(tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if(isAuthorized == null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to="/auth/login"/>
}   

export default ProtectedRoute