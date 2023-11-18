<script>
  import FetchCapitalsQuestion from "./FetchCapitalsQuestion.svelte";
  let timeTotal = 0;

  const updateTimeTotal = (event) => {
    console.log('updatetimetital');
    console.log(event);
      timeTotal += event.detail.data;
  }

</script>

<div>
  <h4>Time total: {timeTotal} </h4>
  <FetchCapitalsQuestion on:updateTimeTotal={updateTimeTotal}/>
</div>
