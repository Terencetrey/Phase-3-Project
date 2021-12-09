import React, {useState, useEffect} from 'react'
import Deck from './Deck'


function App() {

  const [players, setPlayers] = useState([])
  const [scores, setScores] = useState([])

  useEffect(()=> {
  //Gets patients and clinics
    fetch('http://localhost:9292/players')
    .then(res => res.json())
    .then(setPlayers)
    
    fetch('http://localhost:9292/scores')
    .then(res => res.json())
    .then(setScores)
  },[])

  //Creates a Patient 
  const postPlayer = (player) => {
    fetch('http://localhost:9292/players',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(player)
    })
    .then(res => res.json())
    .then(newPlayer => {
      setPlayers([newPlayer,...players])
    })
  }
//patches patient
  const patchPlayer = (player) => {
    fetch(`http://localhost:9292/players/${player.id}`,{
      method:'PATCH',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({...player})
    })
    .then(res => res.json())
    .then(data => {
      setPlayers(players.map(p => {
        if(p.id === data.id){
          return data
        } else {
          return p
        }
      }))
    })
  } 




  return (
    <div className="App">
      <Deck postPlayer={postPlayer} scores={scores}/>
    </div>
  );
}

export default App;

