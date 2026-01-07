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
  { label: 'Jenis Layanan' }
])

const showProfileMenu = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const currentPage = ref(1)
const totalPages = ref(2)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})
const loading = ref(false)

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

// Services data
const servicesPage1 = ref([
  {
    name: 'Cuci Kering Lipat',
    price: 'Rp 6.000/kg',
    description: 'Keterangan'
  },
  {
    name: 'Cuci Kering Lipat Instan',
    price: 'Rp 12.000/kg',
    description: 'Keterangan'
  },
  {
    name: 'Cuci Gosok Reguler',
    price: 'Rp 7.000/kg',
    description: 'Keterangan'
  },
  {
    name: 'Cuci Gosok Express',
    price: 'Rp 10.000/kg',
    description: 'Keterangan'
  },
  {
    name: 'Cuci Basah',
    price: 'Rp 5.000/kg',
    description: 'Keterangan'
  },
  {
    name: 'Setrika',
    price: 'Rp 6.000/kg',
    description: 'Keterangan'
  },
  {
    name: 'Bedcover',
    price: 'Rp 25.000/pcs',
    description: 'Keterangan'
  },
  {
    name: 'Selimut',
    price: 'Rp 15.000/pcs',
    description: 'Keterangan'
  }
])

const servicesPage2 = ref([
  {
    name: 'Seprai',
    price: 'Rp 15.000/pcs',
    description: 'Keterangan'
  },
  {
    name: 'Satuan Kemeja',
    price: 'Rp 30.000/oneset',
    description: 'Keterangan'
  },
  {
    name: 'Satuan Express',
    price: 'Rp 35.000/oneset',
    description: 'Keterangan'
  }
])

const currentServices = ref(servicesPage1.value)

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    currentServices.value = servicesPage2.value
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    currentServices.value = servicesPage1.value
  }
}
</script>

<template>
  <div class="customer-services">
    <!-- Sidebar -->
    <div class="sidebar">
      <router-link to="/customer/home" class="sidebar-icon">
        <i class="fas fa-home"></i>
      </router-link>
      
      <router-link to="/customer/services" class="sidebar-icon active">
        <i class="fas fa-concierge-bell"></i>
      </router-link>
      
      <router-link to="/customer/track" class="sidebar-icon">
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

    <div class="customer-services-page">
      <!-- Breadcrumbs -->
      <Breadcrumbs :items="breadcrumbItems" />
      
      <!-- Header with User Profile -->
      <div class="header">
        <h1 class="page-title">Jenis Layanan</h1>
        
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

      <!-- Services Grid -->
      <div class="services-container">
        <div class="services-grid">
          <div 
            v-for="(service, index) in currentServices" 
            :key="index"
            class="service-card"
          >
            <div class="service-icon">
              <i class="fas fa-tshirt"></i>
            </div>
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-price">{{ service.price }}</p>
            <p class="service-description">{{ service.description }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <span class="page-info">{{ currentPage }} of {{ totalPages }} Page</span>
          <div class="pagination-buttons">
            <button 
              @click="goToPreviousPage" 
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Previous
            </button>
            <button 
              @click="goToNextPage" 
              :disabled="currentPage === totalPages"
              class="pagination-btn pagination-btn-next"
            >
              Selanjutnya
            </button>
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
.customer-services {
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

.customer-services-page {
  flex: 1;
  margin-left: 80px;
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F5F5F5 100%);
  position: relative;
}

.customer-services-page::before {
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

/* Services Container */
.services-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.services-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.service-card {
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(22, 120, 243, 0.15);
  border-color: #1678F3;
}

.service-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #1678F3 0%, #6BB6FF 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 32px;
  color: white;
  box-shadow: 0 4px 12px rgba(22, 120, 243, 0.3);
}

.service-name {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.service-price {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1678F3;
  margin: 0 0 8px 0;
}

.service-description {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #E0E0E0;
}

.page-info {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
}

.pagination-buttons {
  display: flex;
  gap: 12px;
}

.pagination-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  background: white;
  color: #666;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #F5F5F5;
  border-color: #1678F3;
  color: #1678F3;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn-next {
  background: #1678F3;
  color: white;
  border-color: #1678F3;
}

.pagination-btn-next:hover:not(:disabled) {
  background: #0d5ec7;
  border-color: #0d5ec7;
}

/* Responsive */
@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .customer-services-page {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
