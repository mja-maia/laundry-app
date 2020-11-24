import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Creators as UserActions } from '../store/ducks/user'

import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import Home from '../pages/Home'
import StartWash from '../pages/StartWash'
import PauseWash from '../pages/PauseWash'

function Routes() {
  const dispatch = useDispatch()

  useEffect(() => {
    const user = localStorage.getItem('laundrySky@user')
    if(user){
      dispatch(UserActions.setUserData(JSON.parse(user)))
    }

  }, [dispatch])

  return (
    <Switch>
      <Route exact path="/">
        <Login/>
      </Route>

      <Route path="/signup">
        <SignUp/>
      </Route>

      <Route path="/home">
        <Home/>
      </Route>

      <Route path="/wash/start">
        <StartWash/>
      </Route>

      <Route path="/wash/pause/:id">
        <PauseWash/>
      </Route>
    </Switch>
  );
}

export default Routes;
