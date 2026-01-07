<template>
  <div class="inventory-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Grid Icon - Center -->
      <router-link to="/owner/dashboard" class="sidebar-icon menu-icon">
        <i class="fas fa-th"></i>
      </router-link>

      <router-link to="/owner/reports" class="sidebar-icon">
        <i class="fas fa-file-invoice-dollar"></i>
      </router-link>

      <router-link to="/owner/inventory" class="sidebar-icon active">
        <i class="fas fa-boxes"></i>
      </router-link>

      <router-link to="/owner/prediction" class="sidebar-icon">
        <i class="fas fa-chart-line"></i>
      </router-link>
      
      <!-- Logout Button - Bottom -->
      <div class="logout-button" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-area">
      <!-- Breadcrumbs -->
      <Breadcrumbs :items="breadcrumbItems" />
      
      <!-- Header -->
      <div class="inventory-header">
        <h1 class="page-title">Inventaris</h1>
        
        <!-- User Profile (Top Right) -->
        <div class="user-profile" @click="toggleProfileMenu">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <p class="user-name">{{ authStore.user?.name || 'Owner' }}</p>
          </div>
          <i class="fas fa-chevron-down dropdown-icon"></i>
          
          <!-- Dropdown Menu -->
          <div v-if="showProfileMenu" class="profile-dropdown">
            <button @click="openProfileModal" class="dropdown-item">
              <i class="fas fa-user-edit"></i>
              <span>Edit Profil</span>
            </button>
            <button @click="openPasswordModal" class="dropdown-item">
              <i class="fas fa-key"></i>
              <span>Ubah Password</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="content-section">
        <!-- Table -->
        <div class="table-container">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Stok Sisa</th>
                <th>Unit</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in inventoryData" :key="index">
                <td>{{ item.namaBarang }}</td>
                <td>{{ item.stokSisa }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.tanggal }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />

    <!-- Loading Spinner -->
    <LoadingSpinner :show="loading" message="Memproses..." />

    <!-- Profile Modal -->
    <ProfileModal 
      :show="showProfileModal"
      :user="authStore.user"
      @close="showProfileModal = false"
      @save="handleProfileSave"
    />

    <!-- Change Password Modal -->
    <ChangePasswordModal 
      :show="showPasswordModal"
      @close="showPasswordModal = false"
      @save="handlePasswordSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const breadcrumbItems = ref([
  { label: 'Dashboard', path: '/owner/dashboard' },
  { label: 'Inventaris' }
])

const showProfileMenu = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const loading = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const inventoryData = ref([
  {
    namaBarang: 'Deterjen',
    stokSisa: 3,
    unit: 'Liter',
    tanggal: '07-04-2025'
  },
  {
    namaBarang: 'Plastik',
    stokSisa: 1,
    unit: 'Pack',
    tanggal: '01-10-2025'
  }
])

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function openProfileModal() {
  showProfileMenu.value = false
  showProfileModal.value = true
}

function openPasswordModal() {
  showProfileMenu.value = false
  showPasswordModal.value = true
}

function handleProfileSave(profileData) {
  loading.value = true
  setTimeout(() => {
    authStore.user = { ...authStore.user, ...profileData }
    showProfileModal.value = false
    loading.value = false
    toast.value = {
      show: true,
      message: 'Profil berhasil diperbarui!',
      type: 'success'
    }
  }, 800)
}

function handlePasswordSave(passwordData) {
  loading.value = true
  setTimeout(() => {
    showPasswordModal.value = false
    loading.value = false
    toast.value = {
      show: true,
      message: 'Password berhasil diubah!',
      type: 'success'
    }
  }, 800)
}

function goToDashboard() {
  router.push('/owner/dashboard')
}
</script>

<style scoped>
.inventory-container {
  display: flex;
  min-height: 100vh;
  background: #E8E8E8;
}

/* Sidebar */
.sidebar {
  width: 80px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  color: #1678F3;
  font-size: 24px;
  margin-bottom: 20px;
  text-decoration: none;
}

.sidebar-icon.active {
  background: rgba(22, 120, 243, 0.15);
}

.sidebar-icon:hover {
  background: rgba(22, 120, 243, 0.1);
}

.menu-icon {
  margin-top: 0;
}

.logout-button {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  color: #1678F3;
  font-size: 20px;
  margin-top: auto;
  position: absolute;
  bottom: 30px;
}

.logout-button:hover {
  background: rgba(22, 120, 243, 0.1);
}

/* Main Area */
.main-area {
  flex: 1;
  padding: 30px;
  margin-left: 80px;
  width: calc(100% - 80px);
  overflow-y: auto;
  background: linear-gradient(135deg, #E8F4FD 0%, #F5F5F5 100%);
  min-height: 100vh;
  position: relative;
}

.main-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(22, 120, 243, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

.main-area > * {
  position: relative;
  z-index: 1;
}

/* Header */
.inventory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
  overflow: visible;
  z-index: 100;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #1678F3;
}

.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: background 0.3s;
  z-index: 200;
}

.user-profile:hover {
  background: rgba(22, 120, 243, 0.05);
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1678F3 0%, #6BB6FF 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1678F3;
  margin: 0;
}

.dropdown-icon {
  font-size: 12px;
  color: #1678F3;
  margin-left: 5px;
  transition: transform 0.3s;
}

.user-profile:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* Profile Dropdown */
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 9999;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333333;
  text-decoration: none;
  background: white;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.dropdown-item:hover {
  background: rgba(22, 120, 243, 0.05);
  color: #1678F3;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Table */
.table-container {
  overflow-x: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

.inventory-table thead {
  background: #F5F5F5;
}

.inventory-table th {
  padding: 15px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  border-bottom: 2px solid #E0E0E0;
}

.inventory-table tbody tr {
  border-bottom: 1px solid #F0F0F0;
  transition: background 0.2s;
}

.inventory-table tbody tr:hover {
  background: #F9F9F9;
}

.inventory-table td {
  padding: 15px 20px;
  font-size: 14px;
  color: #555555;
}

/* Responsive */
@media (max-width: 768px) {
  .inventory-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;
  }

  .logout-button {
    position: static;
    margin-top: 0;
  }

  .main-area {
    padding: 20px;
  }

  .table-container {
    overflow-x: scroll;
  }

  .inventory-table {
    min-width: 500px;
  }
}
</style>
