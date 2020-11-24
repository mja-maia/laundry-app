import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import firebase from '../../config/firebase'
import moment from 'moment'

import './styles.css'

function Home() {
  const { user } = useSelector(state => state.user)
  const [washOneHistory, setWashOneHistory] = useState([])
  const [washTwoHistory, setWashTwoHistory] = useState([])
  const [machineOneStatus, setMachineOneStatus] = useState(false)
  const [machineTwoStatus, setMachineTwoStatus] = useState(false)
  const history = useHistory()
  const db = firebase.firestore()

  const fetchHistoryFromMachineOne = useCallback(() => {
    db.collection('washes').where('machine', '==', 1).get()
      .then(query => {
        if (query.docs.length) {
          query.forEach(doc => {
            db.collection('users').get().then(users => {
              const user = users.docs.find(user => user.data().id === doc.data().user)
              setWashOneHistory(oldState => {
                return [
                  ...oldState,
                  {
                    date: `${moment(doc.data().created.toDate()).format('DD/MM/YYYY')} as ${moment(doc.data().created.toDate()).format('HH:mm')}`,
                    userParsed: user.data(),
                    ...doc.data()
                  }
                ]
              })
            })
          })
        }
      })
  }, [db])

  const fetchHistoryFromMachineTwo = useCallback(() => {
    setWashTwoHistory([])
    db.collection('washes').where('machine', '==', 2).get()
      .then(query => {
        if (query.docs.length) {
          query.forEach(doc => {
            db.collection('users').get().then(users => {
              const user = users.docs.find(user => user.data().id === doc.data().user)
              setWashTwoHistory(oldState => [
                ...oldState,
                {
                  date: `${moment(doc.data().created.toDate()).format('DD/MM/YYYY')} as ${moment(doc.data().created.toDate()).format('HH:mm')}`,
                  userParsed: user.data(),
                  ...doc.data()
                }
              ])
            })
          })
        }
      })
  }, [db])

  const fecthMachinesStatus = useCallback(() => {
    db.collection('machines').get().then(query => {
      if(query.docs.length){
        query.docs.forEach(machine => {
          const machineData = machine.data()
          if(machineData.code === 1){
            setMachineOneStatus(machineData.in_use)
          } else if (machineData.code === 2) {
            setMachineTwoStatus(machineData.in_use)
          }
        })
      }
    })
  }, [db])

  useEffect(() => {
    const unsubscribeWashes = db.collection('washes').onSnapshot(() => {
      fetchHistoryFromMachineTwo()
      fetchHistoryFromMachineOne()
    })

    const unsubscribeMachines = db.collection('machines').onSnapshot(() => {
      fecthMachinesStatus()
    })

    return () => {
      unsubscribeMachines()
      unsubscribeWashes()
    };
  }, []);

  return (
    <div className="home-container pt-5">
      <div className="button-wash-container mb-3">
        <Button variant="success" onClick={() => history.push('wash/start')}>Iniciar Lavagem</Button>
      </div>

      {
        machineOneStatus && washOneHistory.find(wash => wash.user === user.id) ? (
          <div className="button-wash-container mb-3">
            <Button variant="primary" onClick={() => history.push('wash/pause/1')}>Parar Lavagem na Maquina 1</Button>
          </div>
        ) : null
      }

{
        machineTwoStatus && washTwoHistory.find(wash => wash.user === user.id) ? (
          <div className="button-wash-container mb-3">
            <Button variant="primary" onClick={() => history.push('wash/pause/2')}>Parar Lavagem na Maquina 2</Button>
          </div>
        ) : null
      }

      <Card className="home-cards mx-auto">
      <Card.Header>Maquina 01 {machineOneStatus ? ' - Em uso' : ' - Disponível para uso'}</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Unidade</th>
                <th className="text-center">Data</th>
                <th className="text-center">Registro Inicial KWH</th>
                <th className="text-center">Registro Final KWH</th>
                <th className="text-center">Registro Inicial Hidrômetro</th>
                <th className="text-center">Registro Final Hidrômetro</th>
                <th className="text-center">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {
                washOneHistory.length ? (
                  washOneHistory.map((history, idx) => (
                    <tr key={idx}>
                      <td className="text-center">{history.userParsed.unit}</td>
                      <td className="text-center">{history.date}</td>
                      <td className="text-center">{history.initial_kwh}</td>
                      <td className="text-center">{history.final_kwh || ''}</td>
                      <td className="text-center">{history.initial_water}</td>
                      <td className="text-center">{history.final_water || ''}</td>
                      <td className="text-center">{history.userParsed.name}</td>
                    </tr>
                  ))
                ) : null
              }
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="home-cards mx-auto mt-5">
        <Card.Header>Maquina 02 {machineTwoStatus ? ' - Em uso' : ' - Disponível para uso'}</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Unidade</th>
                <th className="text-center">Data</th>
                <th className="text-center">Registro Inicial KWH</th>
                <th className="text-center">Registro Final KWH</th>
                <th className="text-center">Registro Inicial Hidrômetro</th>
                <th className="text-center">Registro Final Hidrômetro</th>
                <th className="text-center">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {
                washTwoHistory.map((history, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{history.userParsed.unit}</td>
                    <td className="text-center">{history.date}</td>
                    <td className="text-center">{history.initial_kwh}</td>
                    <td className="text-center">{history.final_kwh || ''}</td>
                    <td className="text-center">{history.initial_water}</td>
                    <td className="text-center">{history.final_water || ''}</td>
                    <td className="text-center">{history.userParsed.name}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
