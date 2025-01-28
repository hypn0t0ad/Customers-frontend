<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/customers">Customers</router-link> |
        <button v-if="isAuthenticated" @click="logout">Logout</button>
        <router-link v-else to="/login">Login</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import authService from "./services/authService"; // Service to handle authentication

export default {
  data() {
    return {
      isAuthenticated: false,
    };
  },
  async created() {
    this.isAuthenticated = await authService.isAuthenticated();
  },
  methods: {
    async logout() {
      await authService.logout();
      this.isAuthenticated = false;
      this.$router.push("/");
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

button {
  cursor: pointer;
  background-color: red;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
}
</style>
