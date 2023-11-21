<script>
  import FetchCapitalsQuestion from "./FetchCapitalsQuestion.svelte";
  import TelegramLoginWidget from "./TelegramLoginWidget.svelte";
  import {customFetch} from "./CustomFetch.js";
  import {urlBase, urlTgAuth} from "./Constants.js";
  import HighScores from "./HighScores.svelte";

  export let name;
  let timeTotal = 0;

  let gameId = null;
  export let inProgress = false;

  export let finalScore = null;


  const updateTimeTotal = (event) => {
      timeTotal += event.detail.data;
    console.log('TIME UPDATED', event.detail.data, timeTotal);
  }




  const onTelegramAuth = async (user) => {
    try {
      let response = await fetch(`${urlTgAuth}?${new URLSearchParams(user)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      // todo check ?
      localStorage.setItem('accessToken', data.token);
      inProgress = true;
      startGame();
    } catch (err) {
      let error = err.message;
    }
  };

  const startGame = async () => {
    let response = await customFetch(`${urlBase}/game-start`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let data = await response.json();
    localStorage.setItem('gameId', data.gameId);
    gameId = data.gameId;
  }

  const gameOver = (event) => {
    customFetch(`${urlBase}/game-over`,
          {
            method : 'POST',
            body: JSON.stringify({'score' : event.detail.score, 'sessionTimer' : timeTotal})
          });
    timeTotal = 0;
  }

  const devModeOn = () => {
    startGame();
    inProgress = true;
  }

</script>
<div>
  {#if inProgress}
    <h4>Time elapsed: {timeTotal} </h4>
    <FetchCapitalsQuestion on:updateTimeTotal={updateTimeTotal} on:triggerGameOver={gameOver} timeTotal="{timeTotal}" inProgress="{inProgress}"/>
  {:else}
    <HighScores/>
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
