<script>
  import {createEventDispatcher} from "svelte";
  import {customFetch} from "./CustomFetch.js";
  import {urlBase} from "./Constants.js";
  import Component from "./Component.svelte";
  import {onMount} from "svelte";

  export let inProgress;
  export let timeTotal;
  let livesCount = 3;
  let data = null;
  let error = null;
  let answerResult = null;
  let dataValue = 0;
  let timerCommand = null;
  let score = 0;
  let livesText = null;
  let youWin = false;
  export let scoreToWin;
  export let gameId;
  export let flipBG;

  const fetchData = async () => {
    try {
      timerCommand = {action : 'stop'}
      answerResult = null;
      const response = await customFetch(`${urlBase}/question/${gameId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      data = await response.json();
      displayLives();
      timerCommand = {action : 'start'}
    } catch (err) {
      error = err.message;
    }
  };

  const reply = async (countryCode, answer) => {
    try {
      timerCommand = { action : 'stop'}; // this stops timer and updates total time via event
      answer = btoa(answer);
      const response = await customFetch(`${urlBase}/answer/${gameId}/${countryCode}/${answer}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      answerResult = await response.json();
      checkLivesLeft(answerResult);
    } catch (err) {
      error = err.message;
    }
  }

  // todo rename - something about score update ?
  const checkLivesLeft = (answerResult) => {
    answerResult.isCorrect === false
            ? (livesCount === 1 ? (livesCount=0, triggerGameOver()) : (() => { livesCount-- })())
            : (timerCommand = {action : 'stop'}, score++);
    displayLives();
    checkWin();
  }

  const displayLives = () => {
    if (livesCount >= 3) {
      livesText = '👾👾👾';
    } else if (livesCount === 2) {
      livesText = '👾👾❌';
    } else if (livesCount === 1) {
      livesText = '👾❌❌';
    } else if (livesCount === 0) {
      livesText = '❌❌❌';
    }
  }
  const triggerGameOver = ((dispatch = createEventDispatcher()) => () => {
    dispatch('triggerGameOver', {score: score});
    if (score === scoreToWin) {
      answerResult =  { text : `You Won! 👾🎊`, stat: `scored ${score} in ${timeTotal} sec`}
    } else {
      answerResult =  { text : `GAME OVER 👾`, stat: `scored ${score} in ${timeTotal} sec`}
    }
  })();

  const onFinalScore = () => {
    answerResult =  { text : `GAME OVER 👾`, stat: `scored ${score} in ${timeTotal} sec`}
  }
  const updateTimeTotal = ((dispatch = createEventDispatcher()) => () => {
    dispatch('updateTimeTotal', {data: dataValue});
  })();
  let timerStopped = (event) =>
  {
    dataValue = event.detail.data;
    updateTimeTotal();
  }

  let onTimeout = () => {
    answerResult = {text : '⏰ Time up'};
    checkLivesLeft({isCorrect : false});
  }

  const restartGame = () => {
    score = 0;
    livesCount = 3;
    fetchData();
  }

  const goBack = () => {
    location.reload();
    localStorage.setItem('gameId', null);
    inProgress = false;
    flipBG();
  }

  onMount(() => {
    if (undefined !== gameId && null !== gameId) {fetchData()}}
  );

  const checkWin = () => {
    if (score === scoreToWin) {
      youWin = true;
      triggerGameOver();
    }
  }

</script>
<div class="mainContainer">
  {#if !data}
<!--    <button on:click={fetchData}>START</button>-->
  {/if}
  {#if error}
    <p style="color: red;">Error: {error}</p>
  {:else if data}
    {#if youWin}
      <div class="hooray">🏆🥇✨</div>
    {/if}
    <div class="scoreBox">
      <div>Score: {score}</div>
      <div>Lives: {livesText}</div>
    </div>

    <Component action={timerCommand} on:timerStopped={timerStopped} on:timeout={onTimeout}/>
    <div class="questionContainer">
      <div class="question"> {data.text}</div> <div class="questionFlag">{data.flag}</div>
    </div>
    <hr>

      <div class="messageBox frozenGlass2">
        {#if answerResult}
          {#if answerResult.text.includes('GAME OVER') || answerResult.text.includes('You Won')}
            <marquee behavior="alternate">
              {answerResult.text}
              <div class="smallerText">{answerResult.stat}</div>
            </marquee>
          {:else}
            {answerResult.text}
          {/if}
        {/if}
      </div>
    <div class="optionsContainer frozenGlass">
        {#each data.options as option}
          <div class="optionLineContainer">
            <div class="optionButton"><button on:click={reply(data.isoCode, option.option)}>{option.option}</button></div>
            <div class="optionFlag">{#if answerResult}{option.flag}{:else}&nbsp;{/if}</div>
            <div class="optionText">{#if answerResult}{option.country}{:else}&nbsp;{/if}</div>
          </div>
        {/each}
    </div>
    <div class="buttonsBlock centerContent frozenGlass">
      <div>
<!--      <center>-->
        {#if livesCount > 0}
          <button class="megabutton" on:click={fetchData}>GO NEXT</button>
        {:else}
          <button class="megabutton" on:click={restartGame}>GO AGAIN</button> <button on:click={goBack}>BACK TO MAIN</button>
        {/if}
      </div>
<!--      </center>-->
    </div>
  {/if}

</div>

<style>
  .questionContainer {
    display: flex;
    width: 100%;
    align-items: center;
    -webkit-align-items: center;
    justify-content: center;
    height: 40px;
  }

  .question, .questionFlag {
    margin-left: 10px;
    font-size: 25px;
    font-weight: 500;
  }

  .questionFlag {
    font-size: 50px;
  }

  .optionLineContainer {
    display: flex;
    width: 100%;
      line-height: 60px;
    height: 60px;
  }

  .optionButton {
    margin-top: 10px;
    margin-left: 5px;
    font-size: 16px;
    font-weight: 500;
    justify-content: center;
  }

  .optionText {
    flex-direction: row;
    min-width: 100px;
    margin-top: 10px;
    margin-left: 5px;
    width: 45%;
    justify-content: left;
    font-size: 15px;
    text-wrap: nowrap;
  }

  .optionButton button {
    min-width: 125px;
    margin: 0;
    width: 100%;
    font-weight: 500;
  }

  .optionFlag {
      margin-left: 5px;
      margin-top: 10px;
      min-width: 25px;
      max-width: 60px;
    font-size: 50px;
  }

  .megabutton
  {
    margin-top: 20px;
    min-height: 50px;
    /*background-color: cadetblue;*/
    width: 75%;
  }

  .messageBox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    font-size: 26px;
  }

  .smallerText {
    width: 150px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scoreBox {
    position: absolute;
    top: 5px;
    right: 5px;
  }


  .hooray {
    height: 100%;
    width: 100%;

    line-height: 400px;

    font-size: 55px;
    position: absolute;
    /*top: 20%;*/
    text-align: center;

    background: rgba(255, 255, 255, 0.4); /* White background with opacity */
    border-radius: 10px; /* Optional: for rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: for subtle shadow */

    /* Backdrop filter for the frosted glass effect */
    backdrop-filter: blur(10px);

    /* Cross-browser compatibility */
    -webkit-backdrop-filter: blur(10px);
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

  .frozenGlass2 {
    background: rgba(255, 255, 255, -0.6); /* White background with opacity */
    /*border-radius: 10px; !* Optional: for rounded corners *!*/
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: for subtle shadow */
    /* Backdrop filter for the frosted glass effect */
    backdrop-filter: blur(10px);
    /* Cross-browser compatibility */
    -webkit-backdrop-filter: blur(10px);
    /*left: */
  }

  .centerContent {
    display: flex;
    justify-content: center;
    /*align-items: center;*/
  }

  .optionsContainer {
    padding-bottom: 20px;
  }

  .mainContainer {
    /*padding-top: 20px;*/
  }
</style>
