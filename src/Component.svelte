<script>
  import {createEventDispatcher, onDestroy} from "svelte";

  export let action;
  let secondsSpent = 0;
  let maxTime = 30;
  let timerStoppedEvent = ((dispatch = createEventDispatcher()) =>
          () => { dispatch('timerStopped', {data: secondsSpent});}
  )();

  let timeoutEvent = ((dispatch = createEventDispatcher()) =>
                  () => { dispatch('timeout', {});}
  )();

  let timer = null;
  $: if (action) {
    switch (action.action) {
      case 'start':
        secondsSpent = 0;
        console.log('start')
        start();
        break;
      case 'restart':
        secondsSpent = 0;
        // restart();
        console.log('restart')
        break;
      case 'stop':
        stop();
        secondsSpent = 0;
        console.log('stop')
        break;
      default:
        console.log('default')
        break;
    }
  }
  const timerFunction = () => {
      console.log('timer started')
      return setInterval(() => maxTime - secondsSpent > 0 ? secondsSpent += 1 : timeout(), 1000);
  }

  let start = () => timer = timerFunction();

  const timeout = () => {
    stop();
    timeoutEvent();
  }

  const stop = () => {
    timerStoppedEvent();
    clearInterval(timer);
  }

  onDestroy(() => {
    stop();
  });

</script>

<div class="localTimerContainer">
  <h4>Time left: {maxTime - secondsSpent}</h4>
<!--  <button class="stopTimerButton" on:click={stop}>STOP!</button>-->

<!--  <button on:click={restart}>START!</button>-->

<!--  <h5>sec: {secondsSpent}</h5>-->
</div>
<style>
  div, h4 {
    margin-top: 5px;
    padding: 0;
  }

  .localTimerContainer {
    margin-top: -20px;
  }

  /*.stopTimerButton {*/
  /*  position: absolute;*/
  /*  top: 5px;*/
  /*  right: 5px;*/
  /*}*/
</style>
