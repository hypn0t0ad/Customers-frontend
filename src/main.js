import { createApp } from "vue";
import App from "./App.vue";
import authService from "./services/authService"; // Import authService

authService
    .init()
    .then(() => {
        createApp(App).mount("#app");
    })
    .catch((error) => {
        console.error("Authentication failed", error);
    });