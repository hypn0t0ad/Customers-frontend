import { ref, onMounted } from 'vue';
import { UserManager, WebStorageStateStore } from 'oidc-client';
import { useRouter } from 'vue-router';

const userManager = new UserManager({
    authority: 'http://localhost:8080/realms/my-app-realm',
    client_id: 'my-app-client',
    redirect_uri: 'http://localhost:5173',
    response_type: 'code',
    scope: 'openid profile email',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
});

const isAuthenticated = ref(false);
const user = ref(null);

export function useAuth() {
    const router = useRouter()
    const login = async () => {
        await userManager.signinRedirect();
    };

    const logout = async () => {
        await userManager.signoutRedirect();
        isAuthenticated.value = false;
        user.value = null;
        router.push('/')
    }

    const loadUser = async () => {
        try {
            const oidcUser = await userManager.getUser();
            if(oidcUser && !oidcUser.expired){
                user.value = oidcUser.profile;
                isAuthenticated.value = true;
                return true;
            }else{
                isAuthenticated.value = false;
                user.value = null
                return false;
            }

        }catch (error){
            console.error("Failed to load user", error)
        }
        return false;
    };

    onMounted( async () => {
        const isLoggedIn = await loadUser();
        if(!isLoggedIn){
            await userManager.signinRedirectCallback();
        }


    })


    return { isAuthenticated, user, login, logout };
}