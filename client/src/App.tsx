import AppLayout from 'components/layout/AppLayout'
import { createContext, useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'wouter'
import PageNotFound from 'pages/404'
import Dashboard from 'pages/dashboard'
import Login from 'pages/login'
import Today from 'pages/today'
import { User } from 'types/User'
import PrivateRoute from './PrivateRoute'

type AuthContextType = {
    user: User | null
    updateUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const getUserFromLocalStorage = () => {
    try {
        const user = localStorage.getItem('user')
        if (user === null) return null
        return JSON.parse(user)
    } catch (error) {
        // incase error in json parsing
        return null
    }
}

function App() {
    const [user, setUser] = useState<User | null>(getUserFromLocalStorage)

    const updateUser: AuthContextType['updateUser'] = (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    //     useEffect(() => {
    // 	if (user) {

    // 	}
    //     }, [user])

    return (
        <AuthContext.Provider value={{ user, updateUser }}>
            <Switch>
                <Route path="/">
                    {user ? <Redirect to="/app/dashboard" /> : <Login />}
                </Route>
                <Route path="/login">
                    {user ? <Redirect to="/app/dashboard" /> : <Login />}
                </Route>
                <PrivateRoute path="/app/dashboard">
                    <AppLayout view={<Dashboard />} />
                </PrivateRoute>
                <PrivateRoute path="/app/today">
                    <AppLayout view={<Today />} />
                </PrivateRoute>
                <Route>
                    <PageNotFound />
                </Route>
            </Switch>
        </AuthContext.Provider>
    )
}

export default App
