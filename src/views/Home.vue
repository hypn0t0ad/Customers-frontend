<template>
  <div v-if="!keycloak.authenticated">
    <p>Please log in to view customers.</p>
    <button @click="login()">Login</button>
  </div>
  <div v-else>
    <h1>Customers</h1>
    <div v-if="loading">Loading customers...</div>
    <div v-else>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.id }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phonenumber }}</td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button
            :disabled="currentPage === 0"
            @click="changePage(currentPage - 1)"
        >
          Previous
        </button>
        <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button
            :disabled="currentPage === totalPages - 1"
            @click="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
    <button @click="logout()">Logout</button>
  </div>
</template>

<script>
import axios from 'axios';
import { useKeycloak } from "../composables/useKeycloak";

export default {
  data() {
    return {
      customers: [],
      loading: false,
      currentPage: 0,
      totalPages: 0,
      keycloak: useKeycloak(),
    };
  },
  mounted() {
    this.keycloak
        .init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
              window.location.origin + "/silent-check-sso.html",
        })
        .then((authenticated) => {
          if (authenticated) {
            this.fetchCustomers();
          }
        });
  },
  methods: {
    login() {
      this.keycloak.login();
    },
    logout() {
      this.keycloak.logout();
    },
    fetchCustomers() {
      console.log("Trying to fetch customers!");
      console.log("The current page: " + this.currentPage);
      this.loading = true;
      axios
          .get(`http://localhost:8080/api/customers?page=${this.currentPage}&size=10`, {
            headers: {
              Authorization: `Bearer ${this.keycloak.token}`,
            },
          })
          .then((response) => {
            console.log("The response: " + response);
            this.customers = response.data.content;
            this.totalPages = response.data.totalPages;
          })
          .catch((error) => {
            console.error("Error fetching customers:", error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchCustomers();
    }
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: white;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination span{
  margin: 0 1rem
}
</style>