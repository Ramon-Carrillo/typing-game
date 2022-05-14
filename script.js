const word = document.getElementById('word')
const text = document.getElementById('text')
const scoreEl = document.getElementById('score')
const timeEl = document.getElementById('time')
const endgameEl = document.getElementById('end-game-container')
const settingsBtn = document.getElementById('settings-btn')
const settings = document.getElementById('settings')
const settingsForm = document.getElementById('settings-form')
const difficultySelect = document.getElementById('difficulty')
const YOURAPIKEY =
  'Get your API key from https://developer.wordnik.com/docs#!/words/getRandomWords'

const getWords = async () => {
  try {
    const res = await fetch(
      `https://api.wordnik.com/v4/words.json/randomWords?limit=3&api_key=${YOURAPIKEY}`,
    )
    const data = await res.json()
    // Gets random Word
    const word = data[Math.floor(Math.random() * data.length)]
    return word.word
  } catch (error) {
    console.log('No Good Dr. Jones')
  }
}

// Init word
let randomWord

// Init score
let score = 0

// Init time
let time = 10

// Set difficulty to value in ls or medium
let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'easy'

// Set difficulty select value
difficultySelect.value =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'easy'

// Focus on text on start
text.focus()

//Game over, show end screen
const gameOver = () => {
  endgameEl.innerHTML = `
  <h1>Time ran out</h1>
  <p>Your Final Score is ${score}</p>
  <button onclick="location.reload()">Reload</button> 
  `

  endgameEl.style.display = 'flex'
}

// Update time
const updateTime = () => {
  time--
  timeEl.innerText = time + 's'

  if (time == 0) {
    clearInterval(timeInterval)
    // end game
    gameOver()
  }
}

// Start count down timer
const timeInterval = setInterval(updateTime, 1000)

// Update Score
const updateScore = () => {
  score++
  scoreEl.innerText = score
}

// Add word to Dom
const addWordToDOM = async () => {
  randomWord = await getWords()
  word.innerText = randomWord
}

addWordToDOM()

// Event Listener

// Typing
text.addEventListener('input', (e) => {
  const insertedText = e.target.value
  if (insertedText === randomWord) {
    addWordToDOM()
    updateScore()

    // Clear
    e.target.value = ''

    if (difficulty === 'hard') {
      time += 2
    } else if (difficulty === 'medium') {
      time += 3
    } else {
      time += 5
    }
    updateTime()
  }
})

// Setting btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'))

// Setting select
settingsForm.addEventListener('change', (e) => {
  difficulty = e.target.value
  localStorage.setItem('difficulty', difficulty)
})
