<template>
  <div>
    <h2>Customers</h2>
    <ul>
      <li v-for="customer in customers" :key="customer.id">
        {{ customer.name }} - {{ customer.email }}
      </li>
    </ul>
    <button @click="fetchCustomers">Refresh</button>
  </div>
</template>

<script>
import api from '../services/apiClient.js';

export default {
  data() {
    return { customers: [] };
  },
  methods: {
    async fetchCustomers() {
      const response = await api.get('/customers');
      this.customers = response.data.content;
    },
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>
