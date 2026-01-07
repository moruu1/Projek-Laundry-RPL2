<template>
  <div class="customers-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Menu Icons -->
      <router-link to="/admin/dashboard" class="sidebar-icon">
        <i class="fas fa-th"></i>
      </router-link>
      
      <router-link to="/admin/customers" class="sidebar-icon active">
        <i class="fas fa-user"></i>
      </router-link>
      
      <router-link to="/admin/orders" class="sidebar-icon">
        <i class="fas fa-shopping-cart"></i>
      </router-link>

      <router-link to="/admin/financial-report" class="sidebar-icon">
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
      <div class="customers-header">
        <h1 class="page-title">Pelanggan</h1>
        
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
        <!-- Search and Action Buttons Row -->
        <div class="top-actions">
          <!-- Search Bar -->
          <div class="search-container">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari pelanggan..."
              class="search-input"
            />
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              class="btn-edit ripple-container" 
              @click="handleEdit"
              @mousedown="addRipple"
              data-tooltip="Edit data pelanggan terpilih"
            >
              <i class="fas fa-edit"></i>
              Edit Data
            </button>
            <button 
              class="btn-delete ripple-container" 
              @click="handleDelete"
              @mousedown="addRipple"
              data-tooltip="Hapus data pelanggan terpilih"
            >
              <i class="fas fa-trash"></i>
              Hapus Data
            </button>
            <button 
              class="btn-add ripple-container" 
              @click="handleAdd"
              @mousedown="addRipple"
              data-tooltip="Tambah pelanggan baru"
            >
              <i class="fas fa-plus"></i>
              Tambah Data
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <!-- Loading Skeleton -->
          <div v-if="dataLoading">
            <table class="customers-table">
              <thead>
                <tr>
                  <th class="col-select"></th>
                  <th class="col-nama">Nama</th>
                  <th class="col-hp">No Hp</th>
                  <th class="col-alamat">Alamat</th>
                </tr>
              </thead>
            </table>
            <LoadingSkeleton :rows="5" :columns="skeletonColumns" />
          </div>

          <!-- Empty State -->
          <EmptyState 
            v-else-if="filteredCustomers.length === 0 && !searchQuery"
            icon="fas fa-users"
            title="Belum Ada Pelanggan"
            message="Mulai tambahkan pelanggan pertama Anda untuk mengelola data customer"
            actionText="Tambah Pelanggan"
            actionIcon="fas fa-plus"
            @action="handleAdd"
          />

          <!-- Search Empty State -->
          <EmptyState 
            v-else-if="filteredCustomers.length === 0 && searchQuery"
            icon="fas fa-search"
            title="Tidak Ada Hasil"
            :message="`Tidak ditemukan pelanggan dengan kata kunci '${searchQuery}'`"
          />

          <!-- Table with data -->
          <table v-else class="customers-table">
            <thead>
              <tr>
                <th class="col-select"></th>
                <th class="col-nama">Nama</th>
                <th class="col-hp">No Hp</th>
                <th class="col-alamat">Alamat</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="customer in filteredCustomers" 
                :key="customer.id"
                :class="{ 'selected': selectedCustomer === customer.id }"
                @click="selectCustomer(customer.id)"
              >
                <td class="col-select">
                  <div class="select-circle" :class="{ 'active': selectedCustomer === customer.id }">
                    <i v-if="selectedCustomer === customer.id" class="fas fa-check"></i>
                  </div>
                </td>
                <td class="col-nama">{{ customer.name }}</td>
                <td class="col-hp">{{ customer.phone }}</td>
                <td class="col-alamat">{{ customer.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal modal-add" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Edit Data Pelanggan</h2>
          <button class="close-button" @click="closeEditModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body modal-body-add">
          <div class="form-section">
            <div class="section-title">Edit Informasi Pelanggan</div>
            <div class="form-group">
              <label>Username</label>
              <input v-model="editForm.username" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label>Nama</label>
              <input v-model="editForm.name" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label>Tanggal Lahir</label>
              <input v-model="editForm.birthDate" type="date" />
            </div>
            <div class="form-group">
              <label>No. HP</label>
              <input v-model="editForm.phone" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input v-model="editForm.password" type="password" placeholder="" />
            </div>
            <button class="btn-submit" @click="saveEdit">Simpan</button>
          </div>
          <div class="image-section">
            <img src="@/assets/images/admindecor.png" alt="Customer Illustration" class="illustration-img">
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Hapus Data Pelanggan</h2>
          <button class="close-button" @click="closeDeleteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda yakin ingin menghapus data pelanggan ini?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDeleteModal">Batal</button>
          <button class="btn-confirm" @click="confirmDelete">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal modal-add" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Tambah Pelanggan</h2>
          <button class="close-button" @click="closeAddModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body modal-body-add">
          <div class="form-section">
            <div class="section-title">Daftarkan Pelanggan Baru</div>
            <div class="form-group">
              <label>Username</label>
              <input v-model="addForm.username" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label>Nama</label>
              <input v-model="addForm.name" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label>Tanggal Lahir</label>
              <input v-model="addForm.birthDate" type="date" />
            </div>
            <div class="form-group">
              <label>No. HP</label>
              <input v-model="addForm.phone" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input v-model="addForm.password" type="password" placeholder="" />
            </div>
            <button class="btn-submit" @click="saveAdd">Terima</button>
          </div>
          <div class="image-section">
            <img src="@/assets/images/admindecor.png" alt="Customer Illustration" class="illustration-img">
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
    <LoadingSpinner :show="loading" message="Memuat data..." />

    <!-- Confirm Dialog -->
    <ConfirmDialog 
      :show="showDeleteConfirm"
      title="Hapus Pelanggan"
      message="Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan."
      confirmText="Hapus"
      cancelText="Batal"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
      @close="showDeleteConfirm = false"
    />

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Breadcrumbs from '../../components/Breadcrumbs.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'
import { useRipple } from '@/composables/useRipple'
import { useAnimations } from '@/composables/useAnimations'

const router = useRouter()
const authStore = useAuthStore()
const addRipple = useRipple()
const { triggerSuccess, triggerError } = useAnimations()

const breadcrumbItems = ref([
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Pelanggan' }
])

// State
const showProfileMenu = ref(false)
const searchQuery = ref('')
const selectedCustomer = ref(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const loading = ref(false)
const dataLoading = ref(false)
const showDeleteConfirm = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Skeleton columns configuration
const skeletonColumns = [
  { width: '5%' },
  { width: '25%' },
  { width: '20%' },
  { width: '50%' }
]

// Sample data
const customers = ref([
  { id: 1, name: 'Andi Prasetyo', phone: '081234567890', address: 'Jl. Sudirman No. 123, Jakarta' },
  { id: 2, name: 'Budi Santoso', phone: '082345678901', address: 'Jl. Thamrin No. 45, Jakarta' },
  { id: 3, name: 'Citra Dewi', phone: '083456789012', address: 'Jl. Gatot Subroto No. 78, Jakarta' },
  { id: 4, name: 'Dedi Kurniawan', phone: '084567890123', address: 'Jl. Rasuna Said No. 90, Jakarta' },
  { id: 5, name: 'Eka Putri', phone: '085678901234', address: 'Jl. HR Rasuna Said No. 12, Jakarta' },
])

// Forms
const editForm = ref({
  username: '',
  name: '',
  phone: '',
  birthDate: '',
  password: ''
})

const addForm = ref({
  username: '',
  name: '',
  phone: '',
  birthDate: '',
  password: ''
})

// Computed
const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  
  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(customer => 
    customer.name.toLowerCase().includes(query) ||
    customer.phone.includes(query) ||
    customer.address.toLowerCase().includes(query)
  )
})

// Methods
function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function selectCustomer(id) {
  selectedCustomer.value = selectedCustomer.value === id ? null : id
}

function handleEdit() {
  if (!selectedCustomer.value) {
    toast.value = {
      show: true,
      message: 'Pilih pelanggan terlebih dahulu!',
      type: 'warning'
    }
    return
  }
  
  const customer = customers.value.find(c => c.id === selectedCustomer.value)
  if (customer) {
    editForm.value = { ...customer }
    showEditModal.value = true
  }
}

function handleDelete() {
  if (!selectedCustomer.value) {
    toast.value = {
      show: true,
      message: 'Pilih pelanggan terlebih dahulu!',
      type: 'warning'
    }
    return
  }
  showDeleteConfirm.value = true
}

function confirmDelete() {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    const index = customers.value.findIndex(c => c.id === selectedCustomer.value)
    if (index !== -1) {
      customers.value.splice(index, 1)
      selectedCustomer.value = null
      toast.value = {
        show: true,
        message: 'Pelanggan berhasil dihapus!',
        type: 'success'
      }
    }
    loading.value = false
  }, 1000)
}

function handleAdd() {
  addForm.value = {
    username: '',
    name: '',
    phone: '',
    birthDate: '',
    password: ''
  }
  showAddModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
}

function closeDeleteModal() {
  showDeleteModal.value = false
}

function closeAddModal() {
  showAddModal.value = false
}

function saveEdit() {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    const customer = customers.value.find(c => c.id === selectedCustomer.value)
    if (customer) {
      Object.assign(customer, editForm.value)
      showEditModal.value = false
      toast.value = {
        show: true,
        message: 'Data pelanggan berhasil diperbarui!',
        type: 'success'
      }
    }
    loading.value = false
  }, 800)
}

function saveAdd() {
  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    const newCustomer = {
      id: customers.value.length + 1,
      name: addForm.value.name,
      phone: addForm.value.phone,
      address: 'Alamat Baru'
    }
    customers.value.push(newCustomer)
    showAddModal.value = false
    toast.value = {
      show: true,
      message: 'Pelanggan baru berhasil ditambahkan!',
      type: 'success'
    }
    loading.value = false
  }, 800)
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
    // Update user profile (in real app, call API)
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
    // Update password (in real app, call API)
    showPasswordModal.value = false
    loading.value = false
    toast.value = {
      show: true,
      message: 'Password berhasil diubah!',
      type: 'success'
    }
  }, 800)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Page Container */
.customers-container {
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
  margin-left: 80px;
  padding: 40px;
  display: flex;
  flex-direction: column;
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
.customers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 100%;
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

/* Content Section */
.content-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.5s ease-out;
  transition: box-shadow 0.3s ease;
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

/* Top Actions Row */
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

/* Search Container */
.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>') no-repeat 15px center;
  background-size: 18px;
}

.search-input:focus {
  outline: none;
  border-color: #1678F3;
  box-shadow: 0 0 0 4px rgba(22, 120, 243, 0.1);
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: #999;
  font-style: italic;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-buttons button::before {
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

.action-buttons button:hover::before {
  width: 300px;
  height: 300px;
}

.btn-edit {
  background: linear-gradient(135deg, #FFA726 0%, #FB8C00 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 167, 38, 0.2);
}

.btn-edit:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 167, 38, 0.4);
}

.btn-edit:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(255, 167, 38, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #EF5350 0%, #E53935 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 83, 80, 0.2);
}

.btn-delete:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(239, 83, 80, 0.4);
}

.btn-delete:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(239, 83, 80, 0.3);
}

.btn-add {
  background: linear-gradient(135deg, #1678F3 0%, #1565C0 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(22, 120, 243, 0.2);
  animation: pulse-add 2s infinite;
}

.btn-add:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 16px rgba(22, 120, 243, 0.4);
  animation: none;
}

.btn-add:active {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 3px 10px rgba(22, 120, 243, 0.3);
}

@keyframes pulse-add {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(22, 120, 243, 0.2);
  }
  50% {
    box-shadow: 0 2px 12px rgba(22, 120, 243, 0.4);
  }
}

/* Table Container */
.table-container {
  border-radius: 16px;
  border: 1px solid #E0E0E0;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 8px 30px rgba(22, 120, 243, 0.12);
}

/* Table */
.customers-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  table-layout: fixed;
}

.customers-table thead {
  background: #F5F5F5;
}

.customers-table th {
  padding: 15px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  border-bottom: 2px solid #E0E0E0;
}

.customers-table td {
  padding: 15px 12px;
  font-size: 13px;
  color: #333333;
  border-bottom: 1px solid #F0F0F0;
}

.customers-table tbody tr {
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInRow 0.5s ease-out;
}

.customers-table tbody tr:hover {
  background: #F8F9FA;
  transform: translateX(4px);
  box-shadow: -4px 0 0 #1678F3;
}

.customers-table tbody tr.selected {
  background: linear-gradient(90deg, #E3F2FD 0%, #F8FBFF 100%);
  border-left: 4px solid #1678F3;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.col-select {
  width: 80px;
  text-align: center;
}

.col-nama {
  width: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-hp {
  width: 20%;
}

.col-alamat {
  width: auto;
  max-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Selection Checkbox */
.select-circle {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #E0E0E0;
  position: relative;
}

.select-circle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #1678F3;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.select-circle i {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 16px;
  opacity: 0;
  transform: scale(0) rotate(-180deg);
  transition: all 0.3s ease;
}

.select-circle.active {
  background: #1678F3;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(22, 120, 243, 0.4);
}

.select-circle.active::before {
  transform: scale(1);
}

.select-circle.active i {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.select-circle i {
  color: white;
  font-size: 18px;
}

.select-circle:not(.active) i {
  display: none;
}

.col-nama {
  width: 25%;
}

.col-hp {
  width: 20%;
}

.col-alamat {
  width: auto;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal */
.modal {
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s;
}

.modal.modal-add {
  max-width: 1000px !important;
  width: 85% !important;
  padding: 35px 50px !important;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #F0F0F0;
}

.modal-title {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-button:hover {
  background: #F5F5F5;
  color: #333333;
}

/* Modal Body */
.modal-body {
  margin-bottom: 25px;
}

.modal-body-add {
  display: flex;
  gap: 50px;
  margin-bottom: 0;
  align-items: stretch;
}

.form-section {
  flex: 0 0 45%;
  background: #F5F5F5;
  padding: 25px 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1678F3;
  margin-bottom: 15px;
}

.image-section {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.illustration-img {
  width: 100%;
  max-width: 450px;
  height: auto;
  object-fit: contain;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #1678F3;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 5px;
}

.btn-submit:hover {
  background: #1565C0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 120, 243, 0.3);
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1678F3;
  box-shadow: 0 0 0 3px rgba(22, 120, 243, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 15px;
  border-top: 2px solid #F0F0F0;
}

.modal-footer button {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #F5F5F5;
  color: #666666;
}

.btn-cancel:hover {
  background: #E0E0E0;
  color: #333333;
}

.btn-save {
  background: #1678F3;
  color: white;
}

.btn-save:hover {
  background: #1565C0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 120, 243, 0.3);
}

.btn-confirm {
  background: #EF5350;
  color: white;
}

.btn-confirm:hover {
  background: #E53935;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.3);
}

/* Delete Modal Text */
.modal-body p {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #333333;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .main-area {
    margin-left: 60px;
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .modal {
    width: 95%;
    padding: 20px;
  }

  .customers-table {
    font-size: 12px;
  }

  .customers-table th,
  .customers-table td {
    padding: 10px 8px;
  }
}
</style>
