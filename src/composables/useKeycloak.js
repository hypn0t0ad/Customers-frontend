import { ref } from 'vue';
import keycloak from "../components/KeycloakService";
export function useKeycloak() {
    const authenticated = ref(false);
    const token = ref(null);

    const init = (options) => {
        return  keycloak.init(options).then((auth) => {
            authenticated.value = auth;
            if(auth){
                token.value = keycloak.token;
            }
            return auth
        })
    };
    const login = () => {
        keycloak.login();
    };
    const logout = () => {
        keycloak.logout();
    }
    return {
        authenticated,
        token,
        init,
        login,
        logout
    };
}