import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null) // 'customer', 'admin', 'owner'
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isCustomer = computed(() => role.value === 'customer')
  const isAdmin = computed(() => role.value === 'admin')
  const isOwner = computed(() => role.value === 'owner')
  const isStaff = computed(() => role.value === 'admin' || role.value === 'owner')

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement Supabase login
      // const { data, error: loginError } = await supabase.auth.signInWithPassword({
      //   email,
      //   password
      // })
      // if (loginError) throw loginError

      // Get user role from users table
      // const { data: userData, error: userError } = await supabase
      //   .from('users')
      //   .select('*')
      //   .eq('id', data.user.id)
      //   .single()
      // if (userError) throw userError

      // For now, mock login
      user.value = { email, id: '123' }
      role.value = email.includes('admin') ? 'admin' : email.includes('owner') ? 'owner' : 'customer'
      
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('role', role.value)
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement Supabase registration
      // const { data, error: signUpError } = await supabase.auth.signUp({
      //   email: userData.email,
      //   password: userData.password
      // })
      // if (signUpError) throw signUpError

      // Insert user data with role
      // const { error: insertError } = await supabase
      //   .from('users')
      //   .insert([{
      //     id: data.user.id,
      //     email: userData.email,
      //     name: userData.name,
      //     phone: userData.phone,
      //     role: userData.role,
      //     address: userData.address
      //   }])
      // if (insertError) throw insertError

      // For now, mock register
      user.value = { 
        email: userData.email, 
        name: userData.name,
        id: Date.now().toString() 
      }
      role.value = userData.role
      
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('role', role.value)
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      // TODO: Implement Supabase logout
      // await supabase.auth.signOut()
      
      user.value = null
      role.value = null
      
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  function checkAuth() {
    try {
      const savedUser = localStorage.getItem('user')
      const savedRole = localStorage.getItem('role')
      
      if (savedUser && savedRole) {
        user.value = JSON.parse(savedUser)
        role.value = savedRole
      }
    } catch (err) {
      console.error('Error checking auth:', err)
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    }
  }

  // Check auth on store initialization
  checkAuth()

  return {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    isCustomer,
    isAdmin,
    isOwner,
    isStaff,
    login,
    register,
    logout,
    checkAuth
  }
})
