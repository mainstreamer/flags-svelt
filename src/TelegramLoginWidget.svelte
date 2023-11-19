<script>
import { onMount } from 'svelte';
export let onTelegramAuth;
onMount(() => {
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute('data-telegram-login', 'flagstestbot');
    script.setAttribute('data-size', 'large'); // can be small, medium, large
    script.setAttribute('data-radius', '10');
    // script.setAttribute('data-auth-url', "https://capitals.tldr.icu/api/tg/login"); // your auth url
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;
    window.onTelegramAuth = onTelegramAuth;
    document.getElementById('telegram-login').appendChild(script);
});
</script>

<div id="telegram-login" class="telegram-login"></div>