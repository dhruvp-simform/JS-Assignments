import { navigate } from "./router.js";

export function routingListener() {
    navigate(this.getAttribute('data-path'));
}