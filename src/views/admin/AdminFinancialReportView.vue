<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const breadcrumbItems = ref([
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Laporan Keuangan' }
])

const showProfileMenu = ref(false)
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const transactions = ref([
  {
    id: 1,
    description: 'Detergen',
    type: 'Pengeluaran',
    amount: 'Rp. 230.000',
    date: '07-04-2025',
    paymentMethod: 'Tunai'
  },
  {
    id: 2,
    description: 'Pelanggan',
    type: 'Pemasukan',
    amount: 'Rp. 219.000',
    date: '08-04-2025',
    paymentMethod: 'Tunai'
  },
  {
    id: 3,
    description: 'Pelanggan',
    type: 'Pemasukan',
    amount: 'Rp. 60.000',
    date: '08-04-2025',
    paymentMethod: 'Transfer'
  }
])

const filteredTransactions = computed(() => {
  if (!startDate.value || !endDate.value) {
    return transactions.value
  }
  
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  return transactions.value.filter(transaction => {
    const transDate = new Date(convertToISODate(transaction.date))
    return transDate >= start && transDate <= end
  })
})

function convertToISODate(dateStr) {
  const parts = dateStr.split('-')
  if (parts.length === 3 && parts[0].length === 2) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return dateStr
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function filterByDate() {
  console.log('Filter applied:', startDate.value, 'to', endDate.value)
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
</script>

<template>
  <div class="financial-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Menu Icons -->
      <router-link to="/admin/dashboard" class="sidebar-icon menu-icon">
        <i class="fas fa-th"></i>
      </router-link>
      
      <router-link to="/admin/customers" class="sidebar-icon">
        <i class="fas fa-user"></i>
      </router-link>
      
      <router-link to="/admin/orders" class="sidebar-icon">
        <i class="fas fa-shopping-cart"></i>
      </router-link>

      <router-link to="/admin/financial-report" class="sidebar-icon active">
        <i class="fas fa-file-invoice-dollar"></i>
      </router-link>

      <router-link to="/admin/inventory" class="sidebar-icon">
        <i class="fas fa-boxes"></i>
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
      <div class="financial-header">
        <h1 class="page-title">Laporan Keuangan</h1>
        
        <!-- User Profile (Top Right) -->
        <div class="user-profile" @click="toggleProfileMenu">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <p class="user-name">{{ authStore.user?.name || 'Admin Apik' }}</p>
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

      <!-- Content Section -->
      <div class="content-section">
        <!-- Date Range Filter -->
        <div class="date-filter">
          <div class="date-input-group">
            <i class="fas fa-calendar"></i>
            <label>Tanggal Awal</label>
            <input v-model="startDate" type="date" />
          </div>
          
          <div class="date-input-group">
            <i class="fas fa-calendar"></i>
            <label>Tanggal Akhir</label>
            <input v-model="endDate" type="date" />
          </div>
          
          <button class="btn-cek" @click="filterByDate">Cek</button>
        </div>

        <!-- Table -->
        <div class="table-container">
          <!-- Empty State -->
          <EmptyState 
            v-if="filteredTransactions.length === 0"
            icon="fas fa-file-invoice-dollar"
            title="Tidak Ada Transaksi"
            message="Tidak ada transaksi untuk periode yang dipilih"
          />

          <table v-else class="financial-table">
            <thead>
              <tr>
                <th class="col-keterangan">Keterangan</th>
                <th class="col-tipe">Tipe</th>
                <th class="col-jumlah">Jumlah</th>
                <th class="col-tanggal">Tanggal</th>
                <th class="col-transaksi">Transaksi</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="transaction in filteredTransactions" 
                :key="transaction.id"
              >
                <td class="col-keterangan">{{ transaction.description }}</td>
                <td class="col-tipe">{{ transaction.type }}</td>
                <td class="col-jumlah">{{ transaction.amount }}</td>
                <td class="col-tanggal">{{ transaction.date }}</td>
                <td class="col-transaksi">{{ transaction.paymentMethod }}</td>
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

<style scoped>
/* Financial Report Container */
.financial-container {
  display: flex;
  min-height: 100vh;
  background: #E8E8E8;
  font-family: 'Inter', sans-serif;
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
  z-index: 100;
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

.sidebar-icon i {
  color: #1678F3;
  font-size: 24px;
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

/* Main Area */
.main-area {
  flex: 1;
  padding: 30px;
  margin-left: 80px;
  width: calc(100% - 80px);
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
.financial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin: 0;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  padding: 8px 15px;
  border-radius: 8px;
  transition: background 0.3s;
  z-index: 200;
}

.user-profile:hover {
  background: rgba(0, 0, 0, 0.05);
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
  color: #666;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  min-width: 180px;
  z-index: 9999;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  animation: slideUp 0.5s ease-out;
}

.content-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Date Filter */
.date-filter {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F5F5F5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
}

.date-input-group:focus-within {
  border-color: #1678F3;
  background: white;
  box-shadow: 0 0 0 3px rgba(22, 120, 243, 0.1);
  transform: translateY(-2px);
}

.date-input-group i {
  color: #666;
  font-size: 16px;
}

.date-input-group label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.date-input-group input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  width: 120px;
}

.btn-cek {
  background: linear-gradient(135deg, #1678F3 0%, #1565C0 100%);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(22, 120, 243, 0.2);
}

.btn-cek::before {
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

.btn-cek:active::before {
  width: 300px;
  height: 300px;
}

.btn-cek:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(22, 120, 243, 0.4);
}

.btn-cek:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(22, 120, 243, 0.3);
}

/* Table */
.table-container {
  overflow: hidden;
  margin-bottom: 30px;
  border-radius: 12px;
  border: 1px solid #E0E0E0;
}

.financial-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  table-layout: fixed;
}

.financial-table thead {
  background: #F5F5F5;
}

.financial-table th {
  padding: 15px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #E0E0E0;
}

.financial-table tbody tr {
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInRow 0.5s ease-out;
}

.financial-table tbody tr:hover {
  background: #f9f9f9;
  transform: translateX(2px);
  box-shadow: -2px 0 0 #1678F3;
  transition: all 0.2s ease;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.financial-table td {
  padding: 15px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-keterangan {
  width: 200px;
}

.col-tipe {
  width: 150px;
}

.col-jumlah {
  width: 150px;
}

.col-tanggal {
  width: 150px;
}

.col-transaksi {
  width: 150px;
}

/* Action Footer */
.action-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-inventaris {
  background: #1678F3;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-inventaris:hover {
  background: #0d5bbf;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 120, 243, 0.3);
}

.btn-inventaris i {
  font-size: 16px;
}
</style>
