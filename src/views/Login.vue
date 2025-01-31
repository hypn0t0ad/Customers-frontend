<template>
  <div>
    <p>Please log in to view customers.</p>
    <button @click="login()">Login</button>
  </div>
</template>
<script>
import { useKeycloak } from '../composables/useKeycloak';
export default {
  setup(){
    const keycloak = useKeycloak();
    return {
      keycloak
    }
  },
  methods: {
    login(){
      this.keycloak.login()
    }
  }
}
</script>