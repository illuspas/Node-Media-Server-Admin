import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from '../utils/Util';

export const PrivateRoute = ({ children, ...rest }) => {

    const [isLogin, setIsLogin] = useState('false');
    useEffect(() => {
        isAuthenticated().then(res=> {
            setIsLogin(res)
        })
    }, []);
      if(rest.location.pathname === '/admin/'){
        return <Redirect to='/admin/dashboard'/>;
      }
      if (isLogin) return <Route {...rest} render={() => children} />;
      return <Redirect to='/admin/login'/>;
    }
