import { initLocalStorage } from './src/database.js';
import { routingListener } from "./src/main.js";
import { navigate } from "./src/router.js";

// Initialize LocalStorage for this Application - If it doesn't exist
initLocalStorage();
// Initial Route for Client Side Routing
navigate();

// Navigation Buttons Listeners
document.querySelectorAll('nav li button').forEach(btn => {
    btn.addEventListener('click', routingListener);
});