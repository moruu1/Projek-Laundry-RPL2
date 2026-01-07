<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Grid Icon - Center -->
      <router-link to="/owner/dashboard" class="sidebar-icon menu-icon active">
        <i class="fas fa-th"></i>
      </router-link>

      <router-link to="/owner/reports" class="sidebar-icon">
        <i class="fas fa-file-invoice-dollar"></i>
      </router-link>

      <router-link to="/owner/inventory" class="sidebar-icon">
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
      <div class="dashboard-header">
        <h1 class="page-title">Welcome, Owner</h1>
        
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

      <!-- Main Content -->
      <div class="main-content">
        <!-- Info Cards -->
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="card-content">
              <p class="card-label">Total Pendapatan</p>
              <p class="card-value">Rp {{ stats.totalPendapatan.toLocaleString('id-ID') }}</p>
            </div>
          </div>

          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="card-content">
              <p class="card-label">Jumlah Order</p>
              <p class="card-value">{{ stats.jumlahOrder }}</p>
            </div>
          </div>

          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="card-content">
              <p class="card-label">Pelanggan Aktif</p>
              <p class="card-value">{{ stats.pelangganAktif }}</p>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="chart-section">
          <div class="chart-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-chart-bar chart-icon"></i>
              <h2 class="chart-title">Pendapatan per Minggu</h2>
            </div>
          </div>

          <div class="chart-container">
            <!-- Y-Axis Labels -->
            <div class="y-axis">
              <span class="y-label">12.5 Jt</span>
              <span class="y-label">10 Jt</span>
              <span class="y-label">7.5 Jt</span>
              <span class="y-label">5 Jt</span>
              <span class="y-label">2.5 Jt</span>
              <span class="y-label">0</span>
            </div>

            <!-- Chart Bars with Grid Lines -->
            <div class="chart-bars">
              <!-- Horizontal Grid Lines -->
              <div class="grid-lines">
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
              </div>

              <!-- Bars -->
              <div 
                v-for="(data, index) in pendapatanData" 
                :key="index"
                class="bar-wrapper"
              >
                <div 
                  class="bar" 
                  :style="{ height: (data.value / maxValue * 100) + '%' }"
                ></div>
                <span class="bar-label">{{ data.week }}</span>
              </div>

              <!-- Export Icon -->
              <i class="fas fa-download export-icon"></i>
            </div>
          </div>
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
  { label: 'Dashboard' }
])

// Data pendapatan per minggu (dalam juta rupiah)
const pendapatanData = ref([
  { week: 'Minggu 1', value: 8.5 },
  { week: 'Minggu 2', value: 6.2 },
  { week: 'Minggu 3', value: 10.8 },
  { week: 'Minggu 4', value: 7.3 }
])

// Statistik
const stats = ref({
  totalPendapatan: 32800000,
  jumlahOrder: 256,
  pelangganAktif: 89
})

// Max value untuk chart (dalam juta)
const maxValue = 12.5

// Profile menu
const showProfileMenu = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const loading = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = () => {
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
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #F5F5F5;
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
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
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

.logout-item {
  border-top: 1px solid #E0E0E0;
  color: #FF4444;
}

.logout-item:hover {
  background: rgba(255, 68, 68, 0.05);
  color: #FF4444;
}

.main-content {
  width: 100%;
}

/* Info Cards */
.info-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  flex: 1;
  background: linear-gradient(135deg, #1678F3 0%, #6BB6FF 100%);
  border-radius: 20px;
  padding: 25px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(22, 120, 243, 0.3);
}

.card-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
}

.card-content {
  flex: 1;
}

.card-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
}

.card-value {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.chart-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-icon {
  font-size: 24px;
  color: #1678F3;
}

.chart-title {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1678F3;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  height: 350px;
  position: relative;
  padding-left: 60px;
}

.y-axis {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.y-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #666666;
  padding-right: 10px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 40px;
  height: 100%;
  flex: 1;
  border-left: 2px solid #E0E0E0;
  border-bottom: 2px solid #E0E0E0;
  padding: 20px 20px 40px 20px;
  position: relative;
}

.grid-lines {
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.grid-line {
  width: 100%;
  height: 1px;
  background: #F0F0F0;
  border-top: 1px dashed #D0D0D0;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  z-index: 1;
}

.bar {
  width: 100%;
  max-width: 80px;
  background: #1678F3;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s;
  margin-top: auto;
}

.bar:hover {
  background: #0d5ec4;
}

.bar-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #333333;
  margin-top: 10px;
  position: absolute;
  bottom: -30px;
}

.export-icon {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #1678F3;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.export-icon:hover {
  color: #0d5ec4;
}

/* Responsive */
@media (max-width: 1024px) {
  .user-profile {
    position: static;
    margin-bottom: 20px;
    justify-content: center;
  }

  .info-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
    padding: 20px 0;
  }

  .sidebar-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .main-area {
    margin-left: 60px;
    padding: 20px;
  }

  .info-cards {
    flex-direction: column;
  }

  .main-content {
    padding: 0 20px 20px 20px;
  }

  .chart-bars {
    gap: 20px;
  }

  .bar {
    max-width: 50px;
  }
}
</style>
