// Production
let baseUrl = 'https://api.flags.izeebot.top';

// Development - uncomment for local dev
// let baseUrl = 'http://localhost:8000';

let localBase = `${baseUrl}/capitals`;
export let urlBase = localBase;
export let urlTgAuth = `${baseUrl}/api/tg/login`;
export let urlOAuthLogin = `${baseUrl}/login`;
