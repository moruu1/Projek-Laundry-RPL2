import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomerStore = defineStore('customers', () => {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCustomers() {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement Supabase fetch
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createCustomer(customerData) {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement Supabase insert
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer
  }
})
