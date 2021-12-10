import React, {useState, useEffect} from 'react'
import Deck from './Deck'
import axios from 'axios'


function App() {
  const [scores, setScores] = useState([])
  const [trigger, setTrigger] =useState(0)

  useEffect(()=> {
  //Gets patients and clinics
    fetch('http://localhost:9292/highscore')
    .then(res => res.json())
    .then(setScores)
  },[trigger])


const handleDelete = () => {
  fetch(`http://localhost:9292/scores/${scores.score_id}`,{
    method:'DELETE',
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    setTrigger(trigger + 1)
  })
}



  return (
    <div className="App">
      <h1>High Score</h1>
      <h2>Name:{scores.name}</h2>
      <h2>Score:{scores.score}</h2>
      <button className="delete" onClick={handleDelete}>Delete</button>
      <Deck />
    </div>
  );
}

export default App;

