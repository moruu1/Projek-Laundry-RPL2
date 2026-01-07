<template>
  <div class="prediction-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Grid Icon - Center -->
      <router-link to="/owner/dashboard" class="sidebar-icon menu-icon">
        <i class="fas fa-th"></i>
      </router-link>

      <router-link to="/owner/reports" class="sidebar-icon">
        <i class="fas fa-file-invoice-dollar"></i>
      </router-link>

      <router-link to="/owner/inventory" class="sidebar-icon">
        <i class="fas fa-boxes"></i>
      </router-link>

      <router-link to="/owner/prediction" class="sidebar-icon active">
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
      <div class="prediction-header">
        <h1 class="page-title">Prediksi</h1>
        
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
      <div class="content-wrapper">
        <!-- Left Section - Pendapatan -->
        <div class="revenue-section">
          <h2 class="section-title">Pendapatan</h2>
          
          <!-- Chart -->
          <div class="chart-container">
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-line actual"></span>
                <span class="legend-text">Pendapatan Aktual</span>
              </div>
              <div class="legend-item">
                <span class="legend-line prediction"></span>
                <span class="legend-text">Prediksi Pendapatan</span>
              </div>
            </div>

            <!-- Y-Axis Labels -->
            <div class="y-axis">
              <span class="y-label">Rp 25 juta</span>
              <span class="y-label">Rp 20 juta</span>
              <span class="y-label">Rp 15 juta</span>
              <span class="y-label">Rp 10 juta</span>
              <span class="y-label">Rp 5 juta</span>
              <span class="y-label">Rp 0</span>
            </div>

            <!-- Chart Area -->
            <div class="chart-area">
              <!-- Grid Lines -->
              <div class="grid-lines">
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
                <div class="grid-line"></div>
              </div>

              <!-- Line Chart (SVG) -->
              <svg class="line-chart" viewBox="0 0 400 200" preserveAspectRatio="none">
                <!-- Actual Revenue Line -->
                <polyline
                  class="actual-line"
                  points="0,120 40,100 80,90 120,110 160,95 200,105 240,85 280,100 320,95 360,110"
                  fill="none"
                  stroke="#1678F3"
                  stroke-width="2"
                />
                <!-- Prediction Line -->
                <polyline
                  class="prediction-line"
                  points="240,85 280,95 320,90 360,80 400,70"
                  fill="none"
                  stroke="#FF9800"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                />
              </svg>

              <!-- X-Axis Labels -->
              <div class="x-axis">
                <span v-for="day in 30" :key="day" class="x-label">{{ day }}</span>
              </div>
            </div>
          </div>

          <div class="x-axis-title">Tanggal</div>

          <!-- Prediction Summary -->
          <div class="prediction-summary">
            <p>Berdasarkan tren 3 bulan terakhir, total pendapatan untuk 7 hari ke depan diprediksi mencapai Rp 4.500.000.</p>
          </div>
        </div>

        <!-- Right Section - Stok Inventaris -->
        <div class="inventory-section">
          <h2 class="section-title">Stok Inventaris</h2>

          <!-- Inventory Cards -->
          <div class="inventory-cards">
            <!-- Pewangi Melati -->
            <div class="inventory-card">
              <h3 class="item-name">Pewangi Melati</h3>
              <p class="stock-info">Sisa Stok: <strong>20%</strong></p>
              <p class="prediction-warning">Diprediksi Habis dalam: <strong>3 Hari!</strong></p>
              <p class="action-text">Segera lakukan pemesanan ulang untuk Pewangi Melati.</p>
            </div>

            <!-- Deterjen Bubuk -->
            <div class="inventory-card safe">
              <h3 class="item-name">Deterjen Bubuk</h3>
              <p class="stock-info">Sisa Stok: <strong>80%</strong></p>
              <p class="prediction-safe">Diprediksi Habis dalam: <strong>14 Hari</strong></p>
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
  { label: 'Dashboard', path: '/owner/dashboard' },
  { label: 'Prediksi' }
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
.prediction-container {
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
.prediction-header {
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

/* Content Wrapper */
.content-wrapper {
  display: flex;
  gap: 30px;
}

/* Section Title */
.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1678F3;
  margin-bottom: 20px;
}

/* Revenue Section */
.revenue-section {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.chart-container {
  position: relative;
  margin-top: 20px;
}

.chart-legend {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-line {
  width: 30px;
  height: 3px;
  display: inline-block;
}

.legend-line.actual {
  background: #1678F3;
}

.legend-line.prediction {
  background: #FF9800;
  background-image: linear-gradient(to right, #FF9800 50%, transparent 50%);
  background-size: 10px 3px;
}

.legend-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #666666;
}

.y-axis {
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.y-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #666666;
  padding-right: 10px;
}

.chart-area {
  position: relative;
  margin-left: 100px;
  margin-right: 20px;
  height: 250px;
  padding-top: 60px;
  padding-bottom: 40px;
}

.grid-lines {
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  width: 100%;
  height: 1px;
  background: #F0F0F0;
  border-top: 1px dashed #D0D0D0;
}

.line-chart {
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 40px;
  width: 100%;
  height: calc(100% - 100px);
}

.x-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

.x-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #666666;
  text-align: center;
  flex: 1;
}

.x-axis-title {
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #666666;
  margin-top: 10px;
  margin-bottom: 20px;
}

.prediction-summary {
  background: #F5F5F5;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
}

.prediction-summary p {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #555555;
  line-height: 1.6;
  margin: 0;
}

/* Inventory Section */
.inventory-section {
  width: 350px;
}

.inventory-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inventory-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #FF4444;
}

.inventory-card.safe {
  border-left-color: #4CAF50;
}

.item-name {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px 0;
}

.stock-info {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666666;
  margin: 8px 0;
}

.stock-info strong {
  color: #333333;
  font-weight: 600;
}

.prediction-warning {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #FF4444;
  margin: 8px 0;
  font-weight: 500;
}

.prediction-warning strong {
  font-weight: 700;
}

.prediction-safe {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #4CAF50;
  margin: 8px 0;
  font-weight: 500;
}

.prediction-safe strong {
  font-weight: 700;
}

.action-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #666666;
  margin: 12px 0 0 0;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .inventory-section {
    width: 100%;
  }

  .inventory-cards {
    flex-direction: row;
  }

  .inventory-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .prediction-container {
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

  .chart-area {
    margin-left: 80px;
  }

  .y-label {
    font-size: 9px;
  }

  .inventory-cards {
    flex-direction: column;
  }
}
</style>
