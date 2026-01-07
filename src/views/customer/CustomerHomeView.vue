<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ChatWidget from '../../components/ChatWidget.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ProfileModal from '../../components/ProfileModal.vue'
import ChangePasswordModal from '../../components/ChangePasswordModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const breadcrumbItems = ref([
  { label: 'Home' }
])

const showProfileMenu = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const showChat = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})
const loading = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function openChat() {
  showChat.value = true
}

function closeChat() {
  showChat.value = false
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

<template>
  <div class="customer-home">
    <!-- Sidebar -->
    <div class="sidebar">
      <router-link to="/customer/home" class="sidebar-icon active">
        <i class="fas fa-home"></i>
      </router-link>
      
      <router-link to="/customer/services" class="sidebar-icon">
        <i class="fas fa-concierge-bell"></i>
      </router-link>
      
      <router-link to="/customer/track" class="sidebar-icon">
        <i class="fas fa-map-marker-alt"></i>
      </router-link>
      
      <router-link to="/customer/history" class="sidebar-icon">
        <i class="fas fa-history"></i>
      </router-link>
      
      <!-- Logout Button - Bottom -->
      <div class="logout-button" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Breadcrumbs -->
      <Breadcrumbs :items="breadcrumbItems" />
      
      <!-- Header with User Profile -->
      <div class="header">
        <h1 class="page-title">Welcome, {{ authStore.user?.name || 'Steven' }}</h1>
        
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

      <!-- Center Content -->
      <div class="center-content">
        <!-- Left Section - Logo -->
        <div class="left-section">
          <div class="logo-container">
            <img src="../../assets/images/logo_apik.png" alt="Apik Laundry" class="main-logo">
          </div>
          <p class="tagline">
            Cek Status, Riwayat, dan Info<br>Laundry Tanpa Ribet
          </p>
        </div>

        <!-- Right Section - Menu Buttons -->
        <div class="right-section">
          <div class="menu-buttons">
            <router-link to="/customer/services" class="menu-button">
              Jenis Layanan
            </router-link>
            <router-link to="/customer/track" class="menu-button">
              Lacak Pesanan
            </router-link>
            <router-link to="/customer/history" class="menu-button">
              Riwayat Pesanan
            </router-link>
          </div>
        </div>
      </div>

      <!-- Chat Button -->
      <div @click="openChat" class="chat-button">
        <img src="../../assets/images/comment.png" alt="Chat" class="chat-icon">
        <span class="chat-label">Tanya Apik</span>
      </div>
    </div>
    
    <!-- Chat Widget -->
    <ChatWidget v-if="showChat" @close="closeChat" />

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
.customer-home {
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

/* Main Content */
.main-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 80px;
  padding: 30px;
  background: linear-gradient(135deg, #E8F4FD 0%, #F5F5F5 100%);
}

.main-content::before {
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
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #1678F3;
  margin: 0;
}

.user-profile {
  position: absolute;
  top: 0;
  right: 0;
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

/* Center Content */
.center-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 40px 80px;
  gap: 60px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.logo-container {
  width: 300px;
  height: 300px;
  margin-bottom: 30px;
}

.main-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tagline {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  text-align: center;
  line-height: 1.6;
}

/* Menu Buttons */
.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
}

.menu-button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #6BB6FF 0%, #4A9FE8 100%);
  border: none;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(107, 182, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.menu-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.menu-button:active::before {
  width: 300px;
  height: 300px;
}

.menu-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(107, 182, 255, 0.4);
}

.menu-button:active {
  transform: translateY(-1px);
}

/* Chat Button */
.chat-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  pointer-events: auto;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.chat-button:hover {
  transform: scale(1.1) translateY(0);
  animation: none;
}

.chat-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(107, 182, 255, 0.3));
}

.chat-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .center-content {
    flex-direction: column;
    padding: 40px;
  }

  .left-section,
  .right-section {
    width: 100%;
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
  }
  
  .menu-icon i {
    font-size: 20px;
  }
  
  .user-profile {
    padding: 6px 10px;
  }

  .user-name {
    font-size: 14px;
  }

  .logo-container {
    width: 220px;
    height: 220px;
    margin-bottom: 20px;
  }
  
  .tagline {
    font-size: 16px;
    margin-bottom: 30px;
  }
  
  .menu-buttons {
    max-width: 100%;
    gap: 12px;
  }
  
  .menu-button {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .chat-button {
    bottom: 30px;
    right: 30px;
  }
  
  .chat-icon {
    width: 50px;
    height: 50px;
  }
  
  .chat-label {
    font-size: 12px;
  }
}
</style>
