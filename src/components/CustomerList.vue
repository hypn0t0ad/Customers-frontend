<template>
  <div>
    <h1>Customer List</h1>
    <div v-if="!isAuthenticated">
      <button class="btn btn-primary" @click="login">Login</button>
    </div>
    <div v-else>
      <button @click="logout" class="btn btn-danger mb-3">Logout</button>

      <button @click="openCreateModal" class="btn btn-primary mb-3">Add Customer</button>
      <table class="table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.name }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phoneNumber }}</td>
          <td>
            <button @click="openEditModal(customer)" class="btn btn-sm btn-warning me-2">Edit</button>
            <button @click="deleteCustomer(customer.id)" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: currentPage === 0}">
            <a class="page-link" href="#" aria-label="Previous" @click="previousPage">
              <span aria-hidden="true">«</span>
            </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{active: currentPage + 1 === page}">
            <a class="page-link" href="#" @click="changePage(page-1)">{{page}}</a>
          </li>
          <li class="page-item" :class="{disabled: currentPage === totalPages -1}">
            <a class="page-link" href="#" aria-label="Next" @click="nextPage">
              <span aria-hidden="true">»</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Create/Edit Modal -->
      <div class="modal fade" :class="{ show: isModalOpen }"  tabindex="-1" aria-labelledby="customerModalLabel" aria-hidden="true" style="display: " :style="{display: isModalOpen ? 'block':'none'}">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="customerModalLabel">{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</h5>
              <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveCustomer">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" class="form-control" id="name" v-model="form.name" required>
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <input type="text" class="form-control" id="address" v-model="form.address" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="form.email" required>
                </div>
                <div class="mb-3">
                  <label for="phoneNumber" class="form-label">Phone Number</label>
                  <input type="text" class="form-control" id="phoneNumber" v-model="form.phoneNumber" required>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                  <button type="submit" class="btn btn-primary">{{ editingCustomer ? 'Update' : 'Save' }}</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
      <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { useAuth } from '../auth';

export default {
  setup() {
    const { isAuthenticated, login, logout } = useAuth();
    return { isAuthenticated, login, logout };
  },
  data() {
    return {
      customers: [],
      currentPage: 0,
      totalPages: 0,
      pageSize: 10,
      isModalOpen: false,
      form: {
        name: '',
        address: '',
        email: '',
        phoneNumber: '',
      },
      editingCustomer: null,

    };
  },
  mounted() {
    this.fetchCustomers();
  },
  methods: {
    fetchCustomers() {
      api.get(`/customers?page=${this.currentPage}&size=${this.pageSize}`)
          .then(response => {
            this.customers = response.data.content;
            this.totalPages = response.data.totalPages;
          })
          .catch(error => {
            console.error("Error fetching customers:", error);
          });
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchCustomers();
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.fetchCustomers();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.fetchCustomers();
      }
    },
    openCreateModal() {
      this.form = { name: '', address: '', email: '', phoneNumber:'' };
      this.editingCustomer = null;
      this.isModalOpen = true;
    },
    openEditModal(customer) {
      this.editingCustomer = customer;
      this.form = { ...customer }; // copy to avoid changing the original object
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    saveCustomer() {
      if (this.editingCustomer) {
        this.updateCustomer();
      } else {
        this.createCustomer();
      }
    },
    createCustomer(){
      api.post('/customers', this.form)
          .then(() => {
            this.closeModal();
            this.fetchCustomers();
          })
          .catch(error => {
            console.error('Error creating customer:', error);
          });
    },
    updateCustomer() {
      api.put(`/customers/${this.editingCustomer.id}`, this.form)
          .then(() => {
            this.closeModal();
            this.fetchCustomers();
          })
          .catch(error => {
            console.error('Error updating customer:', error);
          });
    },
    deleteCustomer(id) {
      if (confirm('Are you sure you want to delete this customer?')) {
        api.delete(`/customers/${id}`)
            .then(() => {
              this.fetchCustomers();
            })
            .catch(error => {
              console.error('Error deleting customer:', error);
            });
      }
    },
  },
};
</script>