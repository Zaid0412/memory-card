import { useEffect, useState } from 'react'

import { Loading } from './Components/Loading';

import './Styles/App.css'

function App() {
  let comp = null
  let curPokemons = []
  let userScore = 0
  let clickedPokes = []
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (curPokemons.length === 0) {
      setLoading(true)
    }

    return () => {
      setLoading(false)
    }
  }, [curPokemons])

  function displayPokemons(info){
    if(document.querySelector('.pokemon-display')){
      document.querySelector('.pokemon-display').textContent = ''
      document.querySelector('.pokemon-display').style.display = 'grid'
      document.querySelector('.lost-screen').innerHTML = ``

    }
    let p = []
    for (const poke of info) {    
      let html = `
              <div class="pokemon">
                <img src=${poke.sprites.front_default} alt=${poke.name}>
                <h2>${poke.name}</h2>
              </div>
                `
      document.querySelector('.pokemon-display').insertAdjacentHTML('afterbegin', html)

    } 

    const pokes = document.querySelectorAll('.pokemon')
    for (const pokeCard of pokes) { // Looping over all the cards and adding an eventListener to them
      pokeCard.addEventListener('click', (e) => {
        shufflePokemos(e)
      })
    }
  }

  function shuffleArray(array) {  // Shuffles and returns the array
    for (let i = array.length - 1; i> 0; i--) {  
    const j = Math.floor(Math.random() * (i + 1));  
    [array[i], array[j]] = [array[j], array[i]];  
    }  
    return array;  
    }  

    function checkIfArrayIsUnique(array) {
      return array.length === new Set(array).size;
    }
  

 const generateUniqueRandomNumbers = (count, min, max) => { // Generates random unique numbers
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers);
  };

  const fetchRandomPokemons = async (count) => { 
    const pokemonIds = generateUniqueRandomNumbers(count, 1, 1010)
    const promises = pokemonIds.map((id) => 
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) =>
        response.json()
      )
    );
    const pokes = await Promise.all(promises);
    return pokes
  };

  fetchRandomPokemons(8)
  .then(res => {
    curPokemons = res
    displayPokemons(res)
  })


  function handleCardClick() {
    console.log(checkIfArrayIsUnique(clickedPokes))
    if (checkIfArrayIsUnique(clickedPokes)) {
      userScore++
      document.querySelector('.userScore').textContent = userScore
    }else if (!checkIfArrayIsUnique(clickedPokes)) {
      document.querySelector('.userScore').textContent = userScore
      displayLostScreen()
    }
  }

  function displayLostScreen(){
    console.log('a');
    
    document.querySelector('.pokemon-display').style.display = 'none'
    document.querySelector('.lost-screen').innerHTML = `<h1>YOU LOST THE GAME!</h1>`
  }
  function shufflePokemos(e){ // Shuffles the current array of pokemon cards
    displayPokemons(shuffleArray(curPokemons))
    if (e.target.children[0]) {
      clickedPokes.push(e.target.children[0].currentSrc)
    }else if (e.target.nodeName == 'H2') {
      clickedPokes.push(e.target.previousElementSibling.src)  
    }else{
      clickedPokes.push(e.target.currentSrc)
    }
    console.log(clickedPokes);
    handleCardClick()
  }
  

  return (
    <>
    <nav>
    <h1 className="heading">Pokemon Memory Game</h1>
    <p>User Score: <span className='userScore'>0</span></p>
    <button className='shuffle' onClick={() => fetchRandomPokemons(8)
                                                .then(res => {
                                                curPokemons = res
                                                displayPokemons(res)
                                                clickedPokes = []
                                                userScore = 0
                                                document.querySelector('.userScore').textContent = userScore

                                          })
}>Fetch New Cards</button>
     </nav>
    <div className="pokemon-display">
      {loading ? (<Loading />) : null}
    </div>
    <div className="lost-screen"></div>
    </>
  )
}

export default App
