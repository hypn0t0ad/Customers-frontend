import Keycloak from "keycloak-js";

// Keycloak configuration
const keycloak = new Keycloak({
    url: "http://localhost:8080/",
    realm: "myrealm",
    clientId: "my-client",
});

const authService = {
    keycloak,

    // Initialize Keycloak
    async init() {
        try {
            const authenticated = await keycloak.init({
                onLoad: "login-required", // Redirects user to Keycloak if not authenticated
                checkLoginIframe: false,
            });

            if (authenticated) {
                console.log("User authenticated", keycloak.token);
            } else {
                console.warn("User not authenticated");
            }
        } catch (error) {
            console.error("Keycloak initialization failed", error);
        }
    },

    // Get the access token
    getToken() {
        return keycloak.token;
    },

    // Logout the user
    logout() {
        keycloak.logout();
    },

    // Refresh token if needed
    async refreshToken() {
        try {
            if (keycloak.isTokenExpired()) {
                await keycloak.updateToken(30);
            }
        } catch (error) {
            console.error("Failed to refresh token", error);
        }
    },
};

export default authService;
