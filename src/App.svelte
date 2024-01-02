<script>
  import FetchCapitalsQuestion from "./FetchCapitalsQuestion.svelte";
  import TelegramLoginWidget from "./TelegramLoginWidget.svelte";
  import {customFetch} from "./CustomFetch.js";
  import {urlBase, urlTgAuth} from "./Constants.js";
  import HighScores from "./HighScores.svelte";

  export let name;
  let timeTotal = 0;

  export let gameId = null;
  export let inProgress = false;
  export let scoreToWin = 54;

  export let finalScore = null;

  export let gameType = 'CAPITALS_EUROPE';

  const updateTimeTotal = (event) => {
      timeTotal += event.detail.data;
    console.log('TIME UPDATED', event.detail.data, timeTotal);
  }

  const onTelegramAuth = async (user) => {
    try {
      console.log(gameType);

      startGame(); // TODO fix bug
      let response = await fetch(`${urlTgAuth}?${new URLSearchParams(user)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      // todo check ?
      localStorage.setItem('accessToken', data.token);
      inProgress = true;
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
        scoreToWin = 46;
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
        scoreToWin = 53;
        break;
    }
  }

  const gameOver = (event) => {
    customFetch(`${urlBase}/game-over`,
          {
            method : 'POST',
            body: JSON.stringify({'score' : event.detail.score, 'sessionTimer' : timeTotal, 'gameId' : localStorage.getItem('gameId')})
          });
    timeTotal = 0;
    localStorage.setItem('gameId', null);
  }

  const devModeOn = () => {
    console.log('DEV MODE');
    // startGame('CAPITALS_EUROPE');
    // inProgress = true;
  }

  const changeGameType = (type) => gameType = type;

</script>
<div>
  {#if inProgress}
    <h4>Time elapsed: {timeTotal} </h4>
    <FetchCapitalsQuestion on:updateTimeTotal={updateTimeTotal} on:triggerGameOver={gameOver} timeTotal="{timeTotal}" inProgress="{inProgress}" scoreToWin="{scoreToWin}" gameId="{gameId}"/>
  {:else}
    <HighScores gameType="{gameType}" changeGameType="{changeGameType}"/>
    <center>
      <TelegramLoginWidget onTelegramAuth={onTelegramAuth} onDevMode="{devModeOn}"/>
    </center>
  {/if}
</div>

<style>
  h4 {
    margin: 0;
    padding: 0;
  }
</style>
