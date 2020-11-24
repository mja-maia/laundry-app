import React, { useCallback, useState } from "react";
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Creators as UserActions } from '../../store/ducks/user'

import firebase from '../../config/firebase'
import 'firebase/auth'

import './login.css'

function Login() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const db = firebase.firestore()


  const handleLogin = useCallback(() => {
    setIsLoading(true)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        db.collection('users').where('id', '==', firebase.auth().currentUser.uid).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            dispatch(UserActions.setUserData(doc.data()))
            localStorage.setItem('laundrySky@user', JSON.stringify(doc.data()))
            history.push('/home')
          })
        }).catch(() => {
          setIsLoading(false)
        })
      }).catch(() => {
        setIsLoading(false)
      })
  }, [email, password, db, dispatch, history])

  return (
    <div className="login-content d-flex align-items-center">
      <form className="form-signin mx-auto">
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 font-weight-normal text-white font-weight-bold">Login</h1>
        </div>

          <input
            type="email"
            id="inputEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control my-2"
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="inputPassword"
            className="form-control my-2"
            placeholder="Senha"
          />

        {
          isLoading ? (
            <Spinner animation="border" variant="light"/>
          ) : (
            <button className="btn btn-lg btn-primary btn-block btn-login" type="button" onClick={handleLogin}>
              Entrar
            </button>
          )
        }

        <div className="login-options mt-5 text-center">
          <Link to="/signup" className="mx-2">Criar Conta</Link>
          <span className="text-white">&#9733;</span>
          <a href="#" className="mx-2">Recuperar Senha</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
