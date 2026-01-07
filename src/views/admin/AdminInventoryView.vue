<template>
  <div class="inventory-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Menu Icons -->
      <router-link to="/admin/dashboard" class="sidebar-icon">
        <i class="fas fa-th"></i>
      </router-link>
      
      <router-link to="/admin/customers" class="sidebar-icon">
        <i class="fas fa-user"></i>
      </router-link>
      
      <router-link to="/admin/orders" class="sidebar-icon">
        <i class="fas fa-shopping-cart"></i>
      </router-link>

      <router-link to="/admin/financial-report" class="sidebar-icon">
        <i class="fas fa-file-invoice-dollar"></i>
      </router-link>

      <router-link to="/admin/inventory" class="sidebar-icon active">
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
      <div class="inventory-header">
        <h1 class="page-title">Inventaris</h1>
        
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
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-edit" @click="handleEdit">
            <i class="fas fa-edit"></i>
            Edit Inventaris
          </button>
          <button class="btn-delete" @click="handleDelete">
            <i class="fas fa-trash"></i>
            Hapus Inventaris
          </button>
          <button class="btn-add" @click="handleAdd">
            <i class="fas fa-plus"></i>
            Tambah Inventaris
          </button>
        </div>

        <!-- Table -->
        <div class="table-container">
          <!-- Empty State -->
          <EmptyState 
            v-if="items.length === 0"
            icon="fas fa-boxes"
            title="Belum Ada Inventaris"
            message="Inventaris akan muncul di sini setelah ditambahkan"
            actionText="Tambah Inventaris"
            actionIcon="fas fa-plus"
            @action="handleAdd"
          />

          <table v-else class="inventory-table">
            <thead>
              <tr>
                <th class="col-select"></th>
                <th class="col-nama">Nama Barang</th>
                <th class="col-stok">Stok Sisa</th>
                <th class="col-unit">Unit</th>
                <th class="col-tanggal">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="item in items" 
                :key="item.id"
                :class="{ 'selected': selectedItem === item.id }"
                @click="selectItem(item.id)"
              >
                <td class="col-select">
                  <div class="select-circle" :class="{ 'active': selectedItem === item.id }">
                    <i v-if="selectedItem === item.id" class="fas fa-check"></i>
                  </div>
                </td>
                <td class="col-nama">{{ item.name }}</td>
                <td class="col-stok">{{ item.stock }}</td>
                <td class="col-unit">{{ item.unit }}</td>
                <td class="col-tanggal">{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Inventaris</h2>
          <button class="close-btn" @click="showEditModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-left">
            <div class="form-group">
              <label>Nama Barang</label>
              <input v-model="editForm.name" type="text" placeholder="Masukkan nama barang" />
            </div>
            
            <div class="form-group">
              <label>Stok Sisa</label>
              <input v-model="editForm.stock" type="number" placeholder="Masukkan jumlah stok" />
            </div>
            
            <div class="form-group">
              <label>Unit</label>
              <input v-model="editForm.unit" type="text" placeholder="Masukkan unit (Liter/Pack/dll)" />
            </div>
            
            <div class="form-group">
              <label>Tanggal</label>
              <input v-model="editForm.date" type="date" />
            </div>
            
            <button type="button" @click="saveEdit" class="submit-btn">Simpan Perubahan</button>
          </div>
          
          <div class="modal-right">
            <div class="decor-placeholder">
              <i class="fas fa-box-open"></i>
              <p>Inventaris</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Tambah Inventaris</h2>
          <button class="close-btn" @click="showAddModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-left">
            <div class="form-group">
              <label>Nama Barang</label>
              <input v-model="addForm.name" type="text" placeholder="Masukkan nama barang" />
            </div>
            
            <div class="form-group">
              <label>Stok Sisa</label>
              <input v-model="addForm.stock" type="number" placeholder="Masukkan jumlah stok" />
            </div>
            
            <div class="form-group">
              <label>Unit</label>
              <input v-model="addForm.unit" type="text" placeholder="Masukkan unit (Liter/Pack/dll)" />
            </div>
            
            <div class="form-group">
              <label>Tanggal</label>
              <input v-model="addForm.date" type="date" />
            </div>
            
            <button type="button" @click="saveAdd" class="submit-btn">Tambah Inventaris</button>
          </div>
          
          <div class="modal-right">
            <div class="decor-placeholder">
              <i class="fas fa-box-open"></i>
              <p>Inventaris</p>
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

    <!-- Confirm Dialog -->
    <ConfirmDialog 
      :show="showDeleteConfirm"
      title="Hapus Inventaris"
      message="Apakah Anda yakin ingin menghapus inventaris ini?"
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
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const breadcrumbItems = ref([
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Inventaris' }
])

const showProfileMenu = ref(false)
const selectedItem = ref(null)
const showEditModal = ref(false)
const showAddModal = ref(false)
const loading = ref(false)
const showDeleteConfirm = ref(false)
const showProfileModal = ref(false)
const showPasswordModal = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const items = ref([
  {
    id: 1,
    name: 'Deterjen',
    stock: 3,
    unit: 'Liter',
    date: '07-06-2025'
  },
  {
    id: 2,
    name: 'Plastik',
    stock: 1,
    unit: 'Pack',
    date: '01-10-2025'
  }
])

const editForm = ref({
  name: '',
  stock: '',
  unit: '',
  date: ''
})

const addForm = ref({
  name: '',
  stock: '',
  unit: '',
  date: ''
})

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function selectItem(id) {
  selectedItem.value = selectedItem.value === id ? null : id
}

function handleEdit() {
  if (!selectedItem.value) {
    toast.value = {
      show: true,
      message: 'Pilih inventaris terlebih dahulu',
      type: 'warning'
    }
    return
  }
  
  const item = items.value.find(i => i.id === selectedItem.value)
  if (item) {
    editForm.value = {
      name: item.name,
      stock: item.stock,
      unit: item.unit,
      date: convertDateToInput(item.date)
    }
    showEditModal.value = true
  }
}

function handleDelete() {
  if (!selectedItem.value) {
    toast.value = {
      show: true,
      message: 'Pilih inventaris terlebih dahulu',
      type: 'warning'
    }
    return
  }
  showDeleteConfirm.value = true
}

function handleAdd() {
  addForm.value = {
    name: '',
    stock: '',
    unit: '',
    date: ''
  }
  showAddModal.value = true
}

function saveEdit() {
  const item = items.value.find(i => i.id === selectedItem.value)
  if (item) {
    item.name = editForm.value.name
    item.stock = editForm.value.stock
    item.unit = editForm.value.unit
    item.date = formatDate(editForm.value.date)
  }
  showEditModal.value = false
  selectedItem.value = null
  toast.value = {
    show: true,
    message: 'Inventaris berhasil diperbarui!',
    type: 'success'
  }
}

function saveAdd() {
  loading.value = true
  setTimeout(() => {
    const newItem = {
      id: items.value.length + 1,
      name: addForm.value.name,
      stock: addForm.value.stock,
      unit: addForm.value.unit,
      date: formatDate(addForm.value.date)
    }
    items.value.push(newItem)
    showAddModal.value = false
    toast.value = {
      show: true,
      message: 'Inventaris berhasil ditambahkan!',
      type: 'success'
    }
    loading.value = false
  }, 800)
}

function confirmDelete() {
  loading.value = true
  setTimeout(() => {
    items.value = items.value.filter(i => i.id !== selectedItem.value)
    showDeleteConfirm.value = false
    selectedItem.value = null
    toast.value = {
      show: true,
      message: 'Inventaris berhasil dihapus!',
      type: 'success'
    }
    loading.value = false
  }, 800)
}

function convertDateToInput(dateStr) {
  // Convert DD-MM-YYYY to YYYY-MM-DD
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return dateStr
}

function formatDate(dateStr) {
  // Convert YYYY-MM-DD to DD-MM-YYYY
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
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

<style scoped>
/* Page Container */
.inventory-container {
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
.inventory-header {
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: flex-end;
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

.action-buttons button:active::before {
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
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid #E0E0E0;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 8px 30px rgba(22, 120, 243, 0.12);
}

/* Table */
.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  table-layout: fixed;
}

.inventory-table thead {
  background: #F5F5F5;
}

.inventory-table th {
  padding: 15px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  border-bottom: 2px solid #E0E0E0;
}

.inventory-table td {
  padding: 15px 12px;
  font-size: 13px;
  color: #333333;
  border-bottom: 1px solid #F0F0F0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inventory-table tbody tr {
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  animation: fadeInRow 0.5s ease-out;
}

.inventory-table tbody tr:hover {
  background: #f9f9f9;
  transform: translateX(2px);
  box-shadow: -2px 0 0 #1678F3;
  transition: all 0.2s ease;
}

.inventory-table tbody tr.selected {
  background: linear-gradient(90deg, #E3F2FD 0%, #F8FBFF 100%);
  border-left-color: #1678F3;
  box-shadow: 0 2px 12px rgba(22, 120, 243, 0.1);
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

.col-select {
  width: 80px;
  text-align: center;
}

/* Selection Checkbox */
.select-circle {
  width: 40px;
  height: 40px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.select-circle:hover {
  border-color: #1678F3;
  transform: scale(1.05);
}

.select-circle.active {
  background: #1678F3;
  border-color: #1678F3;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(22, 120, 243, 0.3);
}

.select-circle i {
  color: white;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.select-circle.active i {
  transform: rotate(360deg);
}

.select-circle:not(.active) i {
  display: none;
}

.col-nama {
  width: 30%;
}

.col-jumlah {
  width: 20%;
}

.col-satuan {
  width: 20%;
}

.col-keterangan {
  width: 30%;
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

  .inventory-table {
    font-size: 12px;
  }

  .inventory-table th,
  .inventory-table td {
    padding: 10px 8px;
  }

  .modal-content {
    width: 95%;
    max-width: 500px;
  }

  .modal-body {
    flex-direction: column;
  }

  .modal-right {
    display: none;
  }
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
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #E0E0E0;
}

.modal-header h2 {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1678F3;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #F5F5F5;
  color: #333;
}

.modal-body {
  display: flex;
  gap: 30px;
  padding: 30px;
}

.modal-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-right {
  flex: 0 0 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decor-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16px;
  color: #1678F3;
}

.decor-placeholder i {
  font-size: 60px;
  margin-bottom: 12px;
}

.decor-placeholder p {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1678F3;
  box-shadow: 0 0 0 3px rgba(22, 120, 243, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #1678F3 0%, #1565C0 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(22, 120, 243, 0.2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 120, 243, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

</style>
