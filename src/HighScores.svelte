<script>

  import {urlBase} from "./Constants.js";

  let data = null;
  let mappedSlug = '';
  export let gameType;
  export let changeGameType;

  let getItems = async () => {
    console.log(gameType);
    console.log(`${urlBase}/high-scores`);
    switch (gameType) {
      case 'CAPITALS_EUROPE':
        mappedSlug = 'europe';
        changeGameType(gameType);
        break;
      case 'CAPITALS_ASIA':
        mappedSlug = 'asia';
        changeGameType(gameType);
        break;
      case 'CAPITALS_AFRICA':
        mappedSlug = 'africa';
        changeGameType(gameType);
        break;
      case 'CAPITALS_OCEANIA':
        mappedSlug = 'oceania';
        changeGameType(gameType);
        break;
      case 'CAPITALS_AMERICAS':
        mappedSlug = 'americas';
        changeGameType(gameType);
        break;
      default:
        break;
    }

    let response = await fetch(`${urlBase}/high-scores/${mappedSlug}`);

    if (!response.ok) {
      throw new Error('Error fetching high scores');
    }
    data = await response.json();
    // return data;
  }

  let func = (arg) => {
    gameType = arg;
    console.log(gameType);
    getItems();
  }

  getItems();

</script>

<div class="highScores">
  <center>
    Imagine beautiful landing page ✨
  </center>
  <div class:clicked={gameType === 'CAPITALS_EUROPE'} on:click={() => func('CAPITALS_EUROPE')}>EUROPE</div>
  <div class:clicked={gameType === 'CAPITALS_ASIA'} on:click={() => func('CAPITALS_ASIA')}>ASIA</div>
  <div class:clicked={gameType === 'CAPITALS_AFRICA'} on:click={() => func('CAPITALS_AFRICA')}>AFRICA</div>
  <div class:clicked={gameType === 'CAPITALS_OCEANIA'} on:click={() => func('CAPITALS_OCEANIA')}>OCEANIA</div>
  <div class:clicked={gameType === 'CAPITALS_AMERICAS'} on:click={() => func('CAPITALS_AMERICAS')}>AMERICAS</div>
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
