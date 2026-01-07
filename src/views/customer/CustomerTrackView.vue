<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ProfileModal from '../../components/ProfileModal.vue'
import ChangePasswordModal from '../../components/ChangePasswordModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const breadcrumbItems = ref([
  { label: 'Home', path: '/customer/home' },
  { label: 'Lacak Pesanan' }
])

const showProfileMenu = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})
const loading = ref(false)
const searchQuery = ref('')

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const openProfileModal = () => {
  showProfileMenu.value = false
  showProfileModal.value = true
}

const openPasswordModal = () => {
  showProfileMenu.value = false
  showPasswordModal.value = true
}

const handleProfileSave = (profileData) => {
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

const handlePasswordSave = (passwordData) => {
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

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Track order data
const orderStatus = ref({
  orderNumber: '#2351634',
  stages: [
    {
      title: 'pesanan masuk',
      description: 'Pesanan : #2351634',
      icon: '🧺',
      completed: true
    },
    {
      title: 'Diproses',
      description: 'Pesanan : #2351634',
      icon: '😊',
      completed: true
    },
    {
      title: 'keluar untuk pengiriman',
      description: 'Pesanan : #2351634',
      icon: '🏍️',
      completed: true
    },
    {
      title: 'Telah diterima',
      description: 'Pesanan : #2351634',
      icon: '🤝',
      completed: true
    }
  ]
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    toast.value = {
      show: true,
      message: 'Masukkan nomor pesanan',
      type: 'error'
    }
    return
  }
  
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.value = {
      show: true,
      message: 'Pesanan ditemukan!',
      type: 'success'
    }
  }, 1000)
}
</script>

<template>
  <div class="customer-track">
    <!-- Sidebar -->
    <div class="sidebar">
      <router-link to="/customer/home" class="sidebar-icon">
        <i class="fas fa-home"></i>
      </router-link>
      
      <router-link to="/customer/services" class="sidebar-icon">
        <i class="fas fa-concierge-bell"></i>
      </router-link>
      
      <router-link to="/customer/track" class="sidebar-icon active">
        <i class="fas fa-map-marker-alt"></i>
      </router-link>
      
      <router-link to="/customer/orders" class="sidebar-icon">
        <i class="fas fa-history"></i>
      </router-link>
      
      <!-- Logout Button - Bottom -->
      <div class="logout-button" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
      </div>
    </div>

    <div class="customer-track-page">
      <!-- Breadcrumbs -->
      <Breadcrumbs :items="breadcrumbItems" />
      
      <!-- Header with User Profile -->
      <div class="header">
        <div class="user-profile" @click="toggleProfileMenu">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <p class="user-name">{{ authStore.user?.name || 'Steven' }}</p>
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
      <div class="track-content">
        <!-- Left Section - Title -->
        <div class="track-title-section">
          <h2 class="track-main-title">Lacak Pesanan</h2>
        </div>

        <!-- Right Section - Timeline -->
        <div class="track-timeline-section">
          <div class="timeline">
            <div 
              v-for="(stage, index) in orderStatus.stages" 
              :key="index"
              class="timeline-item"
            >
              <!-- Timeline Line -->
              <div class="timeline-line-container">
                <div class="timeline-dot" :class="{ completed: stage.completed }">
                  <i v-if="stage.completed" class="fas fa-check"></i>
                </div>
                <div 
                  v-if="index < orderStatus.stages.length - 1" 
                  class="timeline-line"
                  :class="{ completed: stage.completed }"
                ></div>
              </div>

              <!-- Timeline Content -->
              <div class="timeline-card">
                <div class="card-icon">{{ stage.icon }}</div>
                <div class="card-content">
                  <h3 class="card-title">{{ stage.title }}</h3>
                  <p class="card-description">{{ stage.description }}</p>
                </div>
              </div>
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

<style scoped>
.customer-track {
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

.customer-track-page {
  flex: 1;
  margin-left: 80px;
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F5F5F5 100%);
  position: relative;
}

.customer-track-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, #00000005 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

/* Header */
.header {
  position: relative;
  margin-bottom: 40px;
  display: flex;
  justify-content: flex-end;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: background 0.3s;
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
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  color: #333333;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: #F5F5F5;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Track Content */
.track-content {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  padding: 40px 60px;
}

.track-title-section {
  flex: 0 0 auto;
}

.track-main-title {
  font-family: 'Inter', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: #1678F3;
  margin: 0;
  line-height: 1.1;
}

.track-timeline-section {
  flex: 1;
  max-width: 600px;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.timeline-line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.timeline-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.timeline-dot.completed {
  background: #4CAF50;
}

.timeline-line {
  width: 3px;
  height: 80px;
  background: #E0E0E0;
  margin-top: 5px;
}

.timeline-line.completed {
  background: #4CAF50;
}

.timeline-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.timeline-card:hover {
  transform: translateX(8px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.card-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .track-content {
    flex-direction: column;
    padding: 20px;
    gap: 30px;
  }

  .track-main-title {
    font-size: 48px;
  }

  .track-timeline-section {
    max-width: 100%;
  }
}
</style>
