<script>
  import {createEventDispatcher, onDestroy} from "svelte";

  export let action;
  let secondsSpent = 0;
  let maxTime = 20;
  let timerStoppedEvent = ((dispatch = createEventDispatcher()) =>
          () => { dispatch('timerStopped', {data: secondsSpent});}
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
    alert('Game Over');
    stop();
  }
  const stop = () => {
    clearInterval(timer);
    timerStoppedEvent();
  }

  onDestroy(() => {
    stop();
  });

</script>

<div>
  time: {maxTime - secondsSpent} <button on:click={stop}>STOP!</button>
<!--  <button on:click={restart}>START!</button>-->


<!--  <h5>sec: {secondsSpent}</h5>-->
</div>
<style>
</style>
