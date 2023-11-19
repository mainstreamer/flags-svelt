<script>
  import {customFetch} from "./CustomFetch.js";
  import {urlBase} from "./Constants.js";
  let data = null;

  let getItems = async () => {
    console.log(`${urlBase}/high-scores`);
    let response = await fetch(`${urlBase}/high-scores`);

    if (!response.ok) {
      throw new Error('Error fetching high scores');
    }
    data = await response.json();
    // return data;
  }

  getItems();
  // console.log(data);
</script>

<div class="highScores">
  <center>
    Imagine beautiful landing page ✨
  </center>
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
</style>
