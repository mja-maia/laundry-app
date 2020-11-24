import React, { useState } from 'react';
import { Form, Row, Button, Spinner } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'



import firebase from '../../config/firebase'


function StartWash() {
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const db = firebase.firestore()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    final_kwh: "",
    final_water: ""
  })

  const handleStopWash = () => {
    setIsLoading(true)
    db.collection('washes').where('machine', '==', parseInt(id)).orderBy('created', 'desc').limit(1).get()
    .then(query => {
      if(query.docs.length){
        query.docs[0].ref.update({
          final_kwh: formData.final_kwh,
          final_water: formData.final_water,
          updated: new Date()
        }).then(() => {
          db.collection('machines').where('code', '==', parseInt(id)).get()
          .then(query => {
            if(query.docs.length){
              query.docs[0].ref.update({in_use: false})
            }
            toast.success('Lavagem pausada com sucesso')
            setTimeout(() => {
              history.push('/home')
            }, 1500)
            setIsLoading(false)
          }).catch(() => {
            setIsLoading(false)
          })
        }).catch(() => {
          setIsLoading(false)
        })
      }
    })
  }

  return (
    <div className="login-content d-flex">
      <Form className="mx-auto">
        <div className="mb-5">
          <h2 className="text-white">Pausar Lavagem na Maquina {id}</h2>
        </div>
        <Form.Group as={Row}>
          <Form.Label className="text-white">Registro Final KWH</Form.Label>
          <Form.Control value={formData.final_kwh} onChange={(e) => setFormData({...formData, final_kwh: e.target.value})} placeholder="Consumo final em KWH" type="text" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Registro Final Hidrômetro</Form.Label>
          <Form.Control value={formData.final_water} onChange={(e) => setFormData({...formData, final_water: e.target.value})} type="text" placeholder="Consumo final do hidrômetro" />
        </Form.Group>

        <Form.Group as={Row}>
          {
            isLoading ? (
              <Spinner animation="border" variant="light"/>
            ) : (
              <Button variant="primary" type="button" onClick={handleStopWash}>
                Confirmar Fim da Lavagem
              </Button>
            )
          }
        </Form.Group>
      </Form>
    </div>
  );
}

export default StartWash;
