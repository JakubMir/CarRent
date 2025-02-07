import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Config from "@/config";
import { useRouter } from 'vue-router';
import {useNotificationService} from "@/composables/useNotificationService";



// State for auth
const state = reactive<{
  accessToken: string | null;
  user: any | null;
  userRole: string | null;
  authenticated: boolean;
  loading: boolean;
}>({
  accessToken: null,
  user: null,
  userRole: null,
  authenticated: false,
  loading: false,
});


const error = ref<string | null>(null);

export function useAuthService() {
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      state.loading = true;
      const response = await axios.post(`${Config.backendUrl}/login`, {
        email,
        password,
      });

      state.accessToken = response.data.token;
      state.userRole = response.data.userRole;
      state.user = jwtDecode(state.accessToken!!);
      state.authenticated = true;

      localStorage.setItem('accessToken', state.accessToken!!);
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('userRole', state.userRole!!);

      await useNotificationService().registerSocket()

      router.push({ name: 'Home' });
    } catch (err) {
      console.error(err);
      throw new Error('Chyba při přihlášení, zkontrolujte údaje')
    }finally {
      state.loading = false;
    }
  };

  // Register new user
  const register = async (email: string, password: string) => {
    try {
      state.loading = true;
      await axios.post(`${Config.backendUrl}/register`, {
        email,
        password,
      });

      await login(email, password);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          throw new Error('Email je již použit');
        } else {
          throw new Error('Chyba při registraci');
        }
      } else {
        throw new Error('Neočekávaná chyba');
      }
    } finally {
      state.loading = false;
    }
  };


  // Verify user's login
  const checkAuthStatus = () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        state.accessToken = token;
        state.user = jwtDecode(state.accessToken!!);

        // Verify if token is valid
        const expiration = state.user?.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (expiration && expiration > currentTime) {
          state.authenticated = true;
          state.userRole = localStorage.getItem('userRole');
        } else {
          logout()
        }
      } catch (error) {
        state.authenticated = false;
        state.userRole = null
        console.error('Chyba při dekódování tokenu:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
      }
    } else {
      state.authenticated = false;
    }
  };

  // Sign out user
  const logout = () => {
    useNotificationService().disconnectSocket().then(()=>{
      state.accessToken = null;
      state.user = null;
      state.userRole = null
      state.authenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      router.push({ name: 'Home' });
    })
  };

  // Authorized request on backend with access token
  const authorizedRequest = async (endpoint: string, options = {}) => {
    if (!state.accessToken) {
      error.value = 'Not authenticated';
      throw new Error(error.value);
    }

    try {
      const response = await axios({
        url: `${endpoint}`,
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
        ...options,
      });
      return response.data;
    } catch (err) {
      error.value = 'Chyba při autorizovaném požadavku';
      throw err;
    }
  };

  // Get user's email
  const getEmail = () => {
    return state.user?.['email'];
  };

  onMounted(() => {
    checkAuthStatus();
  });

  return {
    state,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    authorizedRequest,
    getEmail,
  };
}
