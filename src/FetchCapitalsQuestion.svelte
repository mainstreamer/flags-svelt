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

  const fetchData = async () => {
    try {
      timerCommand = {action : 'start'}
      // timerCommand = {action : 'stop'}
      answerResult = null;
      const response = await customFetch(`${urlBase}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      data = await response.json();

      displayLives();
    } catch (err) {
      error = err.message;
    }
  };

  const reply = async (countryCode, answer) => {
    try {
      timerCommand = { action : 'stop'}; // this stops timer and updates total time via event
      answer = btoa(answer);
      const response = await customFetch(`${urlBase}/${countryCode}/${answer}`);
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
    // timerCommand = { action : 'stop'}; // this stops timer and updates total time via event
    dispatch('triggerGameOver', {score: score});
    answerResult =  { text : `GAME OVER 👾`, stat: `scored ${score} in ${timeTotal} sec`}
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
    inProgress = false;
    location.reload();
  }

  onMount(() => fetchData());
</script>
<div class="mainContainer">
  {#if !data}
<!--    <button on:click={fetchData}>START</button>-->
  {/if}
  {#if error}
    <p style="color: red;">Error: {error}</p>
  {:else if data}
    <div class="scoreBox">
      <div>Score: {score}</div>
      <div>Lives: {livesText}</div>
    </div>

    <Component action={timerCommand} on:timerStopped={timerStopped} on:timeout={onTimeout}/>
    <div class="questionContainer">
      <div class="question"> {data.text}</div> <div class="questionFlag">{data.flag}</div>
    </div>
    <hr>

      <div class="messageBox">
        {#if answerResult}
          {#if answerResult.text.includes('GAME OVER') }
            <marquee behavior="alternate">
              {answerResult.text}
              <div class="smallerText">{answerResult.stat}</div>
            </marquee>
          {:else}
            {answerResult.text}
          {/if}
        {/if}
      </div>

    {#each data.options as option}
      <div class="optionLineContainer">
        <div class="optionButton"><button on:click={reply(data.isoCode, option.option)}>{option.option}</button></div>
        <div class="optionFlag">{#if answerResult}{option.flag}{:else}&nbsp;{/if}</div>
        <div class="optionText">{#if answerResult}{option.country}{:else}&nbsp;{/if}</div>
      </div>
    {/each}
    <center>
      {#if livesCount > 0}
        <button class="megabutton" on:click={fetchData}>GO NEXT</button>
      {:else}
        <button class="megabutton" on:click={restartGame}>GO AGAIN</button> <button on:click={goBack}>BACK TO MAIN</button>
      {/if}
    </center>
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
</style>
