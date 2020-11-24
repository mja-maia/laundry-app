import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import moment from 'moment'

import firebase from '../../config/firebase'

import { Form, Row, Button, Spinner } from 'react-bootstrap'

function StartWash() {
  const { user } = useSelector(state => state.user)
  const db = firebase.firestore()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)

  const handleStarWash = () => {
    setIsLoading(true)
    db.collection('washes').add({
      initial_kwh: formData.final_kwh,
      initial_water: formData.final_water,
      user: user.id,
      machine: parseInt(selectedMachine),
      created: new Date(),
    }).then(() => {
      db.collection('machines').where('code', '==', parseInt(selectedMachine)).get()
      .then(query => {
        if(query.docs.length){
          query.docs[0].ref.update({in_use: true})
        }
        setIsLoading(false)
        toast.success('Lavagem iniciada com sucesso')

        setTimeout(() => {
          history.push('/home')
        }, 1500)
      }).catch(() => {
        setIsLoading(false)
      })
    }).catch(() => {
      setIsLoading(false)
    })
  }

  const [formData, setFormData] = useState({
    final_kwh: "",
    final_water: ""
  })
  const [selectedMachine, setSelectedMachine] = useState(1)
  const [machinesList, setMachinesList] = useState([])

  const fetchMachinesList = useCallback(() => {
    const machinesArray = []
    db.collection('machines').get()
      .then(query => {
        if(query.docs.length){
          query.docs.forEach(machine => {
            machinesArray.push(machine.data())
          })
        }
        setMachinesList(machinesArray)
      })
  }, [db])

  useEffect(() => {
    db.collection('washes').where('machine', '==', parseInt(selectedMachine)).orderBy('created', 'desc').limit(1).get()
      .then(query => {
        if(query.docs.length){
          query.forEach(doc => {
            setFormData(doc.data())
          })
        } else {
          setFormData({
            final_kwh: "",
            final_water: ""
          })
        }
      })
  }, [selectedMachine, db])


  useEffect(() => {
    const unsubscribe = db.collection('machines').onSnapshot(() => {
      fetchMachinesList()
    })

    return () => {
      unsubscribe()
    };
  }, [db]);

  return (
    <div className="login-content d-flex align-items-center">
      <Form className="mx-auto">
        <Form.Group as={Row}>
          <Form.Label className="text-white">Selecione o número da maquina</Form.Label>
          <Form.Control value={selectedMachine} as="select" onChange={(e) => setSelectedMachine(e.target.value)}>
            {
              machinesList.map(machine => (
                <option key={machine.code} value={machine.code}> {machine.name} {machine.in_use ? '(em uso)' : '(livre)'}</option>
              ))
            }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Data</Form.Label>
          <Form.Control value={moment().format('DD/MM/YYYY HH:mm')} onChange={() => {}} name="created" type="text" disabled />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Registro Inicial KWH</Form.Label>
          <Form.Control value={formData.final_kwh} onChange={() => {}} placeholder="Consumo inicial em KWH" name="initial_kwh" type="text" disabled />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Registro Inicial Hidrômetro</Form.Label>
          <Form.Control value={formData.final_water} onChange={() => {}} name="passwordConfirmation" type="text" disabled placeholder="Consumo inicial hidrômetro" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label className="text-white">Usuário</Form.Label>
          <Form.Control value={user.unit} onChange={() => {}}  name="unit" type="text" placeholder="Número do seu apartamento" disabled/>
        </Form.Group>

        <Form.Group as={Row}>
          {
            isLoading ? (
              <Spinner animation="border" variant="light"/>
            ) : (
              <Button variant="primary" type="button" onClick={handleStarWash}>
                Confirmar Inicio
              </Button>
            )
          }
        </Form.Group>
      </Form>
    </div>
  );
}

export default StartWash;
