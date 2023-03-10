import { initLocalStorage } from './src/database.js';
import { routingListener } from "./src/main.js";
import { navigate } from "./src/router.js";

initLocalStorage();
navigate();

document.querySelectorAll('nav li button').forEach(btn => {
    btn.addEventListener('click', routingListener);
});