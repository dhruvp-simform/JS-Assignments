import { navigate } from "./router.js";

// Routing Listener
export function routingListener() {
    navigate(this.getAttribute('data-path'));
}