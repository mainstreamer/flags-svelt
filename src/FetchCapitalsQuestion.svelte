<script>
  import {createEventDispatcher} from "svelte";

  let data = null;
  let error = null;
  let answerResult = null;
  let urlBase = 'http://localhost/capitals';
  import Component from "./Component.svelte";
  let dataValue = 0;
  let timerCommand = null;

  const fetchData = async () => {
    try {
      timerCommand = {action : 'stop'}
      answerResult = null;
      const response = await fetch(`${urlBase}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      data = await response.json();
      timerCommand = {action : 'start'}
    } catch (err) {
      error = err.message;
    }
  };

  const reply = async (countryCode, answer) => {
    try {
      answer = btoa(answer);
      const response = await fetch(`${urlBase}/${countryCode}/${answer}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      answerResult = await response.json();
      timerCommand = { action : 'stop'};
    } catch (err) {
      error = err.message;
    }
  }

  const updateTimeTotal = ((dispatch = createEventDispatcher()) => () => {
    dispatch('updateTimeTotal', {data: dataValue});
  })();
  let timerStopped = (event) =>
  {
    dataValue = event.detail.data;
    updateTimeTotal();
  }
</script>
<main>
  {#if !data}
    <button on:click={fetchData}>START</button>
  {/if}
  {#if error}
    <p style="color: red;">Error: {error}</p>
  {:else if data}
    <Component action={timerCommand} on:timerStopped={timerStopped}/>

    <div class="center container">
      <div class="text-mid"> {data.text}</div> <div class="large-text">{data.flag}</div>
    </div>
    <hr>
    {#each data.options as option}
      <div class="container">
        <div class="box-l title"> <button class="button" on:click={reply(data.isoCode, option.option)}>{option.option}</button></div>
        {#if answerResult}
          <div class="box-r title">
            <div class="flag text">
              <span class="large-text">{option.flag}</span>
            </div>
            <div class="text">{option.country}</div>
          </div>
        {/if}
      </div>
    {/each}
    <h3>
      {#if answerResult}
        {answerResult.text}
      {:else }
        &nbsp;
      {/if}
    </h3>
    <button on:click={fetchData}>NEXT</button>
  {/if}
</main>

<style>
  h3 {
    line-height: 25px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  main {
    text-align: center;
    margin-top: 50px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
  }

  .flag {
    font-size: 65px;
    margin-left: 10px;
    /*display: inline;*/
    /*flex-direction: column;*/
    /*vertical-align: text-bottom;*/
  }

  .text {
    display: inline;
    font-size: 20px;
    vertical-align: middle;
  }

  .center {
    align-items: center;
  }
  .title {
    font-size: x-large;
    font-weight: bold;
    vertical-align: middle;
  }

  .header {
    font-size: xx-large;
  }

  .container {
    display: flex;
    /*align-items: center;*/
  }

  .text-mid {
    line-height: 85px;
    font-size: 35px;
  }

  .large-text {
    margin-left: 5px;
    line-height: 85px;
    font-size: 60px;
  }


  /*height: 85px;*/
  .box-l {
    flex-direction: row;
    width: 40%;
    /*border: 1px solid black;*/
    text-align: right;
    height: 85px;
  }

  .box-r {
    flex-direction: row;
    width: 60%;
    /*border: 1px solid black;*/
    text-align: left;
    height: 85px;
  }

  .button {
    width: 100%;
  }
</style>

