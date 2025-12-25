<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { urlOAuthLogin } from './Constants.js';

  const dispatch = createEventDispatcher();

  let isLoading = false;
  let popup = null;
  let popupCheckInterval = null;

  const handleMessage = (event) => {
    // Verify origin matches our API URL
    const apiOrigin = new URL(urlOAuthLogin).origin;
    if (event.origin !== apiOrigin) {
      return;
    }

    if (event.data.type === 'oauth_success') {
      localStorage.setItem('accessToken', event.data.access_token);
      if (event.data.refresh_token) {
        localStorage.setItem('refreshToken', event.data.refresh_token);
      }

      cleanup();
      dispatch('login', { success: true });
    }
  };

  const cleanup = () => {
    isLoading = false;
    if (popupCheckInterval) {
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;
    }
    if (popup && !popup.closed) {
      popup.close();
    }
    popup = null;
  };

  const login = () => {
    isLoading = true;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    popup = window.open(
      `${urlOAuthLogin}?popup=1`,
      'OAuth Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check if popup was closed without completing auth
    popupCheckInterval = setInterval(() => {
      if (popup && popup.closed) {
        cleanup();
      }
    }, 1000);
  };

  onMount(() => {
    window.addEventListener('message', handleMessage);
  });

  onDestroy(() => {
    window.removeEventListener('message', handleMessage);
    cleanup();
  });
</script>

<button on:click={login} disabled={isLoading} class="oauth-button">
  {#if isLoading}
    Loading...
  {:else}
    Login with OAuth
  {/if}
</button>

<style>
  .oauth-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 5px;
    margin: 10px;
  }

  .oauth-button:hover:not(:disabled) {
    background-color: #357abd;
  }

  .oauth-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
