<script>
  import FetchCapitalsQuestion from "./FetchCapitalsQuestion.svelte";
  import TelegramLoginWidget from "./TelegramLoginWidget.svelte";
  import {customFetch} from "./CustomFetch.js";
  import {urlBase, urlTgAuth} from "./Constants.js";
  import HighScores from "./HighScores.svelte";
  import {onMount} from "svelte";

  export let name;
  let timeTotal = 0;

  export let gameId = null;
  export let inProgress = false;
  export let scoreToWin = 54;

  export let finalScore = null;

  export let gameType = 'CAPITALS_EUROPE';

  let displayLogin = true;
  let loggedIn = false;
  const updateTimeTotal = (event) => {
      timeTotal += event.detail.data;
    console.log('TIME UPDATED', event.detail.data, timeTotal);
  }

  let bgImg = '../img/bg01.webp';
  // let bgCol = '#c1dbec';
  let bgCol = 'none';
  const onTelegramAuth = async (user) => {
    try {
      console.log(gameType);

      // startGame(); // TODO fix bug
      let response = await fetch(`${urlTgAuth}?${new URLSearchParams(user)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      // todo check ?
      localStorage.setItem('accessToken', data.token);
      let loggedIn = true;
      // inProgress = true;
    } catch (err) {
      let error = err.message;
    }
  };

  const startGame = async () => {
    console.log(gameType);
    let response = await customFetch(`${urlBase}/game-start/${gameType}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let data = await response.json();
    // localStorage.setItem('gameId', data.gameId);
    gameId = data.gameId;

    switch (gameType) {
      case 'CAPITALS_EUROPE':
        scoreToWin = 45;
        break;
      case 'CAPITALS_ASIA':
        scoreToWin = 48;
        break;
      case 'CAPITALS_AFRICA':
        scoreToWin = 54;
        break;
      case 'CAPITALS_OCEANIA':
        scoreToWin = 25;
        break;
      case 'CAPITALS_AMERICAS':
        scoreToWin = 55;
        break;
    }
    flipBG();
    inProgress = true;
  }

  const gameOver = (event) => {
    customFetch(`${urlBase}/game-over`,
          {
            method : 'POST',
            body: JSON.stringify({'score' : event.detail.score, 'sessionTimer' : timeTotal, 'gameId' : gameId})
          });
    timeTotal = 0;
  }

  const devModeOn = () => {
    console.log('DEV MODE');
    // startGame('CAPITALS_EUROPE');
    // inProgress = true;
  }


  onMount(() => {

    // document.body.style.backgroundImage = `url('')`;
    // console.log(document.body);


    // Now, you can manipulate the DOM element as needed
    // bodyElement.backgroundImage = '';
    // console.log('OK');
    // console.log(bodyElement.children[0].remove());
    // console.log(bodyElement.children);

    if (localStorage.getItem('accessToken')) {
      loggedIn = true;
    }

  });

  const changeGameType = (type) => gameType = type;
  const flipBG = () => {
    bgImg = bgImg === '../img/bg01.webp' ? '' : '../img/bg01.webp';
    bgCol = bgCol === '#c1dbec' ? 'none' : '#c1dbec';
  }

</script>
<body style="background-image: url('{bgImg}'); background-color: {bgCol};">
<!--<body>-->
<div>
  {#if loggedIn}
    {#if inProgress}
      <h5>Time elapsed: {timeTotal} </h5>
      <FetchCapitalsQuestion on:updateTimeTotal={updateTimeTotal} on:triggerGameOver={gameOver} timeTotal="{timeTotal}" inProgress="{inProgress}" scoreToWin="{scoreToWin}" gameId="{gameId}" flipBG="{flipBG}"/>
    {:else}
      <HighScores gameType="{gameType}" changeGameType="{changeGameType}" flipBG="{flipBG}"/>
      <div class="centerContent frozenGlass buttonsBlock">
        <button on:click={startGame}>START</button>
      </div>
    {/if}
  {/if}
</div>
{#if !loggedIn}
  <h2 class="centerContent">Worldly Capitals Challenge 🌐</h2>
  <div class="buttonsBlock centerContent frozenGlass">
      <TelegramLoginWidget onTelegramAuth={onTelegramAuth} onDevMode="{devModeOn}"/>
  </div>
{/if}
</body>
<style>
  h4 {
    margin: 0;
    padding: 0;
  }

  .buttonsBlock {
    width: 100%;
    height: 100px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .frozenGlass {
    background: rgba(255, 255, 255, 0.4); /* White background with opacity */
    /*border-radius: 10px; !* Optional: for rounded corners *!*/
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: for subtle shadow */
    /* Backdrop filter for the frosted glass effect */
    backdrop-filter: blur(13px);
    /* Cross-browser compatibility */
    -webkit-backdrop-filter: blur(10px);
    /*left: */
  }

  .hidden {
    display: none;
  }

  body {
    background-position: 74%;
    background-size: 140%;
    background-repeat: no-repeat;
    animation: bounceBackground 10s linear infinite; /* Adjust the duration as needed */
    padding: 0;
    margin-top: -22px;
  }
  .centerContent {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes bounceBackground {
    0%, 100% {
      background-position: 20% 0%;
    }
    50% {
      background-position: 80% 0%;
    }
  }

  h2 {
    padding-top: 20px;
  }
  h5 {
    padding-top: 5px;
  }
</style>
