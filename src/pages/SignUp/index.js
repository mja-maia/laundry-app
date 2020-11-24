import React, { useCallback, useState } from "react";
import { Form, Button, Row, Spinner } from "react-bootstrap";
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Creators as UserActions } from '../../store/ducks/user'

import firebase from "../../config/firebase";
import '@firebase/firestore'
import "firebase/auth";

import "./signup.css";

function SignUp() {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const db = firebase.firestore()
  const history = useHistory()

  const handleSignup = useCallback((e) => {
    e.preventDefault()

    const { name, email, password, unit, adminPassword } = formData

    if (adminPassword !== 'skystudios@2020') {
      toast.error('Senha do administrador incorreta')
    } else {
      setIsLoading(true)
      firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
        db.collection('users').add({
          id: result.user.uid,
          name,
          email,
          unit,
          created: new Date()
        })

        dispatch(UserActions.setUserData({
          name,
          email,
          unit
        }))

        setIsLoading(false)
        history.push('/home')
      }).catch(e => {
        setIsLoading(false)
        if(e.code === 'auth/email-already-in-use'){
          toast.warn('Email já cadastrado, por favor utilize outro')
        } else if(e.code === 'auth/weak-passwordc'){
          toast.warn('A senha deve conter mais de 6 digitos')
        }
      })
    }
  }, [formData, db]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-content d-flex align-items-center">
      <Form className="mx-auto">

        <Form.Group as={Row}>
          <Form.Label className="text-white">Nome</Form.Label>
          <Form.Control value={formData.name} onChange={handleInputChange} name="name" type="text" placeholder="Seu nome" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Email</Form.Label>
          <Form.Control value={formData.email} onChange={handleInputChange} name="email" type="email" placeholder="Seu email" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Senha</Form.Label>
          <Form.Control value={formData.password} onChange={handleInputChange} name="password" type="password" placeholder="Senha" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Confirmação da Senha</Form.Label>
          <Form.Control value={formData.passwordConfirmation} onChange={handleInputChange} name="passwordConfirmation" type="password" placeholder="Senha" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Unidade</Form.Label>
          <Form.Control value={formData.unit} onChange={handleInputChange} name="unit" type="text" placeholder="Número do seu apartamento" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Senha do admin</Form.Label>
          <Form.Control value={formData.adminPassword} onChange={handleInputChange} name="adminPassword" type="password" placeholder="Senha do admin" />
        </Form.Group>

        <Form.Group as={Row}>
          {
            isLoading ? (
              <Spinner animation="border" variant="light"/>
            ) : (
              <Button variant="primary" type="button" onClick={handleSignup}>
                Cadastrar
              </Button>
            )
          }
        </Form.Group>
      </Form>
    </div>
  );
}

export default SignUp;
