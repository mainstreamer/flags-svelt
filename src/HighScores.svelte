<script>

  import {urlBase} from "./Constants.js";

  let data = null;
  let mappedSlug = '';

  let getItems = async () => {
    console.log(`${urlBase}/high-scores`);
    switch (localGameType) {
      case 'CAPITALS_EUROPE':
        mappedSlug = 'europe';
        break;
      case 'CAPITALS_ASIA':
        mappedSlug = 'asia';
        break;
      case 'CAPITALS_AFRICA':
        mappedSlug = 'africa';
        break;
      case 'CAPITALS_OCEANIA':
        mappedSlug = 'oceania';
        break;
      case 'CAPITALS_AMERICAS':
        mappedSlug = 'americas';
        break;
    }

    let response = await fetch(`${urlBase}/high-scores/${mappedSlug}`);

    if (!response.ok) {
      throw new Error('Error fetching high scores');
    }
    data = await response.json();
    // return data;
  }

  let localGameType = 'CAPITALS_EUROPE';
  let func = (arg) => {
    self.gameType = arg;
    console.log(self.gameType);
    localGameType = arg;
    getItems();
  }

  getItems();

</script>

<div class="highScores">
  <center>
    Imagine beautiful landing page ✨
  </center>
  <div class:clicked={localGameType === 'CAPITALS_EUROPE'} on:click={() => func('CAPITALS_EUROPE')}>EUROPE</div>
  <div class:clicked={localGameType === 'CAPITALS_ASIA'} on:click={() => func('CAPITALS_ASIA')}>ASIA</div>
  <div class:clicked={localGameType === 'CAPITALS_AFRICA'} on:click={() => func('CAPITALS_AFRICA')}>AFRICA</div>
  <div class:clicked={localGameType === 'CAPITALS_OCEANIA'} on:click={() => func('CAPITALS_OCEANIA')}>OCEANIA</div>
  <div class:clicked={localGameType === 'CAPITALS_AMERICAS'} on:click={() => func('CAPITALS_AMERICAS')}>AMERICAS</div>
  {#if data}
    <ol>
      {#each data as item}
          <li>
            <tr>
              <td>{item.userName}</td>
              <td>Time: {item.sessionTimer}</td>
              <td>Score: {item.score}</td>
            </tr>
         </li>
      {/each}
    </ol>
  {/if}
</div>
<style>
  td {
    min-width: 100px;
  }
.highScores {

}
.clicked {
  background-color: #54a9eb;
}
</style>
