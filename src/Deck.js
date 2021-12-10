import React, { useEffect, useState} from "react"
import Card from './Card'
import axios from 'axios'
import './Deck.css'

function Deck() {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    const [drawn2, setDrawn2] = useState([])
    const [gameStatus, setGameStatus] = useState("playing")
    const [points, setPoints] = useState(0)
    const [lives, setLives] = useState(3)
    const [formStatus, setFormStatus] = useState(false)
    const [formType, setFormType] = useState(0)
    const [restart, setRestart] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        age: null,
        score: 0
    })

    //loading deck from API into state
    useEffect(() => {
        async function getAPIData() {
            let res = await axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/")
            setDeck(res.data)
        }
        getAPIData()
    }, [setDeck])

    //draw one card every second if autoDraw activated
    //draw a card and add card to state "drawn" list

    useEffect(()=> {
        async function drawCard() {
            let { deck_id } = deck

            let drawRes = await axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
            //when there are no more cards left from the deck
            if (drawRes.data.remaining === 0) {
                alert('No more cards remaining, so you win!')
                setGameStatus("finished")
            }
            if (lives < 1){
                alert(`Oh no, you've lost!`)
                setGameStatus("finished")
            } else {

            
            let card = drawRes.data.cards[0]
            let card2 = drawRes.data.cards[1]
            
            if(card.value === "JACK"){
                card.value = 11
            } else if(card.value === "QUEEN"){
                card.value = 12
            } else if(card.value === "KING"){
                card.value = 13
            } else if(card.value === "ACE"){
                card.value = 14
            }

            if(card2.value === "JACK"){
                card2.value = 11
            } else if(card2.value === "QUEEN"){
                card2.value = 12
            } else if(card2.value === "KING"){
                card2.value = 13
            } else if(card2.value === "ACE"){
                card2.value = 14
            }

            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.value + 'of' + card.suit,
                    image: card.image,
                    value: parseInt(card.value)
                }
            ])
            setDrawn2(d => [
                ...d,
                {
                    id: card2.code,
                    name: card2.value + 'of' + card2.suit,
                    image: card2.image,
                    value: parseInt(card2.value)
                }
            ])}
        }


        if (deck) {
            drawCard()
        }


    }, [points, lives, deck])


    // Allows the higher/lower buttons to check whether the current player card is higher or lower than the hidden opponent's card, and awards points or takes lives based on the truthyness of that.
    const selectHigher = () => {
        if (drawn[drawn.length-1].value > drawn2[drawn2.length-1].value) {
            setPoints(points + 1)
            setFormData({...formData, score: points + 1})
        } else {
            setLives(lives - 1)
        }
    }
    const selectLower = () => {
        if (drawn[drawn.length-1].value < drawn2[drawn2.length-1].value) {
            if (lives > 0) {
                setPoints(points + 1)
                setFormData({...formData, score: points + 1})
            }
        } else {
            setLives(lives - 1)
        }
    }
    const selectEqual = () => {
        if (drawn[drawn.length-1].value === drawn2[drawn2.length-1].value) {
            if (lives > 0) {
                setPoints(points + 3)
                setLives(lives + 1)
                setFormData({...formData, score: points + 3})
            }
        } else {
            setLives(lives - 1)
        }
    }

    // Shows the player a form to add in their information to submit to the leaderboards
    const showForm1 = () => {
        setFormStatus(show => !show)
        setFormType("new")
    }
    const showForm2 = () => {
        setFormStatus(show => !show)
        setFormType("returning")
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(formType === "new"){
            fetch("http://localhost:9292/players", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
        } else if(formType === "returning"){
            fetch(`http://localhost:9292/players/${formData.name}`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
        }
        setFormStatus(show => !show)
        setRestart(true)
    }
    
    const handleRestart = () => {
        window.location.reload()
    }

    const form = (
        <form>
            <label>Name:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
            ></input><br/>
            <label>Age:</label>
            <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
            ></input><br/>
            <input type="submit" value="Submit and Replay!" onClick={handleSubmit}></input>
            
        </form>
    )

    // Makes two "piles" of cards, one for the player and one for the opponent.
    const card1 = drawn.map(c=> (
        <Card name={c.name} image={c.image} key={c.id} />
    ))
    const card2 = drawn2.map(c=> (
        <Card name={c.name} image={c.image} key={c.id}/>
    ))

    return (
        <div className="Deck">
        {/*Displays the higher/lower buttons only if the deck has been loaded and the game status is set to "playing"*/}
            {deck && (gameStatus === "playing") ? 
            (<><button className="Deck-higher" onClick={selectHigher}>
                    Higher?
                </button>
                <br/>
                <button className="Deck-split" onClick={selectEqual}>
                    Equal?
                </button>
                <br/>
                <button className="Deck-lower" onClick={selectLower}>
                    Lower?
                </button></>)  : null }
        {/* Shows the current score */}
            <div className="Deck-points"> 
                <h2>Score: {points}</h2>
            </div>
        {/* Shows the current lives. Shows 0 if lives are less than 1*/}
            <div className="Deck-lives">
                <h2>Lives: {lives < 1 ? 0 : lives}</h2>
            </div>
        {/* Once lives are 0 or lower, shows a button to open a form for leaderboard submission */}
            {gameStatus === "finished" && formStatus === false && restart === false ? 
            <>
            <button className="Deck-submitscore" onClick={showForm1}>Submit Score as New Player</button>
            <br/>
            <button className="Deck-submitscore" onClick={showForm2}>Submit Score as Returning Player</button>
            </>
            : null}
        {/* Displays the two card piles. Card pile two shows the previous round's card or no card if on the first round. */}
            <div className="Deck-cardpile1">
                <h2>Player Card</h2>
                {card1}
            </div>
            <div className="Deck-cardpile2">
                <h2>Computer Card</h2>
                {card2.length > 1 ? card2[card2.length - 2] : <h1>?</h1>}
            </div>

            {formStatus === true ? form : null}
            {restart === true ? <button className="restart" onClick={handleRestart}>New Game?</button> : null}
        </div>
    )
}


export default Deck