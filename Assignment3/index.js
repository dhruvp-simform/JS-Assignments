import { routingListener } from "./src/main.js";
import { navigate } from "./src/router.js";

navigate('add');

document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', routingListener);
});