<template>
  <div class="orders-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Menu Icons -->
      <router-link to="/admin/dashboard" class="sidebar-icon">
        <i class="fas fa-th"></i>
      </router-link>
      
      <router-link to="/admin/customers" class="sidebar-icon">
        <i class="fas fa-user"></i>
      </router-link>
      
      <router-link to="/admin/orders" class="sidebar-icon active">
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
      <div class="orders-header">
        <h1 class="page-title">Pesanan</h1>
        
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
            Edit Pesanan
          </button>
          <button class="btn-add" @click="handleAdd">
            <i class="fas fa-plus"></i>
            Tambah Pesanan
          </button>
        </div>

        <!-- Table -->
        <div class="table-container">
          <!-- Empty State -->
          <EmptyState 
            v-if="orders.length === 0"
            icon="fas fa-shopping-cart"
            title="Belum Ada Pesanan"
            message="Pesanan akan muncul di sini setelah ditambahkan"
            actionText="Tambah Pesanan"
            actionIcon="fas fa-plus"
            @action="handleAdd"
          />

          <table v-else class="orders-table">
            <thead>
              <tr>
                <th class="col-select"></th>
                <th class="col-nota">No Nota</th>
                <th class="col-nama">Nama</th>
                <th class="col-layanan">Layanan</th>
                <th class="col-berat">Berat(kg)</th>
                <th class="col-status-pesanan">Status Pesanan</th>
                <th class="col-status-bayar">Status Pembayaran</th>
                <th class="col-tanggal-masuk">Tanggal Masuk</th>
                <th class="col-tanggal-selesai">Tanggal Selesai</th>
                <th class="col-metode">Metode Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                :class="{ 'selected': selectedOrder === order.id }"
                @click="selectOrder(order.id)"
              >
                <td class="col-select">
                  <div class="select-circle" :class="{ 'active': selectedOrder === order.id }">
                    <i v-if="selectedOrder === order.id" class="fas fa-check"></i>
                  </div>
                </td>
                <td class="col-nota">{{ order.noNota }}</td>
                <td class="col-nama">{{ order.name }}</td>
                <td class="col-layanan">{{ order.service }}</td>
                <td class="col-berat">{{ order.weight }}</td>
                <td class="col-status-pesanan">
                  <span class="status-badge" :class="getStatusClass(order.statusOrder)">
                    {{ order.statusOrder }}
                  </span>
                </td>
                <td class="col-status-bayar">
                  <span class="status-badge" :class="getPaymentStatusClass(order.statusPayment)">
                    {{ order.statusPayment }}
                  </span>
                </td>
                <td class="col-tanggal-masuk">{{ order.dateIn }}</td>
                <td class="col-tanggal-selesai">{{ order.dateOut }}</td>
                <td class="col-metode">{{ order.paymentMethod }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content edit-modal" @click.stop>
        <h2 class="edit-modal-title">Edit Pesanan</h2>
        
        <div class="edit-modal-layout">
          <!-- Left Side - Form -->
          <div class="edit-form-section">
            
            <form @submit.prevent="saveEdit">
              <div class="edit-form-group">
                <label>Nama</label>
                <input v-model="editForm.name" type="text" placeholder="Nama" required />
              </div>
              
              <div class="edit-form-group">
                <label>Berat (/kg)</label>
                <input v-model="editForm.weight" type="number" placeholder="Berat" required />
              </div>
              
              <div class="edit-form-group">
                <label>Status Pembayaran</label>
                <select v-model="editForm.statusPayment" required>
                  <option value="">Pilih Status</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Bayar">Belum Bayar</option>
                </select>
              </div>
              
              <div class="edit-form-group">
                <label>Status Pesanan</label>
                <select v-model="editForm.statusOrder" @change="updateDateOut" required>
                  <option value="">Pilih Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Proses">Proses</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </form>
          </div>
          
          <!-- Right Side - Form -->
          <div class="edit-form-section-right">
            <div class="edit-form-group">
              <label>Tanggal Masuk</label>
              <input v-model="editForm.dateIn" type="date" disabled />
            </div>
            
            <div class="edit-form-group">
              <label>Tanggal Selesai</label>
              <input v-model="editForm.dateOut" type="date" disabled />
            </div>
            
            <div class="edit-form-group">
              <label>Metode Pembayaran</label>
              <select v-model="editForm.paymentMethod" required>
                <option value="">Pilih Metode</option>
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
            
            <button type="button" @click="saveEdit" class="edit-submit-btn">Simpan</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content add-modal" @click.stop>
        <h2 class="add-modal-title">Tambah Pesanan</h2>
        
        <div class="add-modal-layout">
          <!-- Left Side - Form -->
          <div class="add-form-section">
            
            <form @submit.prevent="saveAdd">
              <div class="add-form-group">
                <label>Nama</label>
                <input v-model="addForm.name" type="text" placeholder="Nama" required />
              </div>
              
              <div class="add-form-group">
                <label>Berat (/kg)</label>
                <input v-model="addForm.weight" type="number" placeholder="Berat" required />
              </div>
              
              <div class="add-form-group">
                <label>Status Pembayaran</label>
                <select v-model="addForm.statusPayment" required>
                  <option value="">Pilih Status</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Bayar">Belum Bayar</option>
                </select>
              </div>
              
              <div class="add-form-group">
                <label>Status Pesanan</label>
                <select v-model="addForm.statusOrder" @change="updateAddDateOut" required>
                  <option value="">Pilih Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Proses">Proses</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </form>
          </div>
          
          <!-- Right Side - Form -->
          <div class="add-form-section-right">
            <div class="add-form-group">
              <label>Tanggal Masuk</label>
              <input v-model="addForm.dateIn" type="date" required />
            </div>
            
            <div class="add-form-group">
              <label>Tanggal Selesai</label>
              <input v-model="addForm.dateOut" type="date" disabled />
            </div>
            
            <div class="add-form-group">
              <label>Metode Pembayaran</label>
              <select v-model="addForm.paymentMethod" required>
                <option value="">Pilih Metode</option>
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
            
            <button type="button" @click="saveAdd" class="add-submit-btn">Masukkan keranjang</button>
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
      title="Hapus Pesanan"
      message="Apakah Anda yakin ingin menghapus pesanan ini?"
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
  { label: 'Pesanan' }
])

const showProfileMenu = ref(false)
const selectedOrder = ref(null)
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

const orders = ref([
  { 
    id: 1, 
    noNota: 'JWX62547', 
    name: 'Zidan', 
    service: 'Setrika', 
    weight: 3,
    statusOrder: 'Selesai',
    statusPayment: 'Lunas',
    dateIn: '12-11-2025',
    dateOut: '14-11-2025',
    paymentMethod: 'Tunai'
  },
  { 
    id: 2, 
    noNota: 'JWX1354', 
    name: 'Maya', 
    service: 'Cuci Basah', 
    weight: 2,
    statusOrder: 'Proses',
    statusPayment: 'Belum Bayar',
    dateIn: '14-11-2025',
    dateOut: '-',
    paymentMethod: 'Transfer'
  }
])

const editForm = ref({
  name: '',
  weight: 0,
  statusOrder: '',
  statusPayment: '',
  dateIn: '',
  dateOut: '',
  paymentMethod: ''
})

const addForm = ref({
  name: '',
  weight: 0,
  statusOrder: '',
  statusPayment: '',
  dateIn: '',
  dateOut: '',
  paymentMethod: ''
})

const filteredOrders = computed(() => {
  return orders.value
})

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function selectOrder(id) {
  selectedOrder.value = selectedOrder.value === id ? null : id
}

function getStatusClass(status) {
  if (status === 'Selesai') return 'status-selesai'
  if (status === 'Proses') return 'status-proses'
  return 'status-pending'
}

function getPaymentStatusClass(status) {
  if (status === 'Lunas') return 'status-lunas'
  if (status === 'Belum Lunas') return 'status-belum'
  return 'status-belum'
}

function handleEdit() {
  if (!selectedOrder.value) {
    toast.value = {
      show: true,
      message: 'Pilih pesanan terlebih dahulu!',
      type: 'warning'
    }
    return
  }
  
  const order = orders.value.find(o => o.id === selectedOrder.value)
  
  // Convert date format from DD-MM-YYYY to YYYY-MM-DD for input[type="date"]
  const convertDateToInput = (dateStr) => {
    if (!dateStr || dateStr === '-') return ''
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}` // Convert DD-MM-YYYY to YYYY-MM-DD
    }
    return ''
  }
  
  editForm.value = {
    ...order,
    dateIn: convertDateToInput(order.dateIn),
    dateOut: convertDateToInput(order.dateOut)
  }
  showEditModal.value = true
}

function handleAdd() {
  // Get today's date using local date
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayFormatted = `${year}-${month}-${day}`
  
  addForm.value = {
    name: '',
    weight: 0,
    statusOrder: '',
    statusPayment: '',
    dateIn: todayFormatted,
    dateOut: '',
    paymentMethod: ''
  }
  showAddModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
}

function closeAddModal() {
  showAddModal.value = false
}

function saveEdit() {
  const index = orders.value.findIndex(o => o.id === selectedOrder.value)
  if (index !== -1) {
    // Convert date format from YYYY-MM-DD to DD-MM-YYYY
    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }
    
    const dateIn = editForm.value.dateIn ? formatDate(editForm.value.dateIn) : orders.value[index].dateIn
    const dateOut = editForm.value.dateOut ? formatDate(editForm.value.dateOut) : '-'
    
    orders.value[index] = { 
      ...orders.value[index],
      name: editForm.value.name,
      weight: editForm.value.weight,
      statusOrder: editForm.value.statusOrder,
      statusPayment: editForm.value.statusPayment,
      dateIn: dateIn,
      dateOut: dateOut,
      paymentMethod: editForm.value.paymentMethod
    }
    
    toast.value = {
      show: true,
      message: 'Pesanan berhasil diperbarui!',
      type: 'success'
    }
  }
  closeEditModal()
}

function saveAdd() {
  loading.value = true
  
  setTimeout(() => {
    const newId = Math.max(...orders.value.map(o => o.id)) + 1
    
    // Generate random nota number
    const noNota = 'JWX' + Math.floor(Math.random() * 10000).toString().padStart(5, '0')
  
  // Convert date format from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }
  
  const dateIn = addForm.value.dateIn ? formatDate(addForm.value.dateIn) : '-'
  const dateOut = addForm.value.dateOut ? formatDate(addForm.value.dateOut) : '-'
  
  orders.value.push({ 
    id: newId,
    noNota: noNota,
    name: addForm.value.name,
    service: 'Setrika', // Default service
    weight: addForm.value.weight,
    statusOrder: addForm.value.statusOrder,
    statusPayment: addForm.value.statusPayment,
    dateIn: dateIn,
    dateOut: dateOut,
    paymentMethod: addForm.value.paymentMethod
  })
  
    toast.value = {
      show: true,
      message: 'Pesanan baru berhasil ditambahkan!',
      type: 'success'
    }
    loading.value = false
    closeAddModal()
  }, 800)
}

function confirmDelete() {
  loading.value = true
  
  setTimeout(() => {
    const index = orders.value.findIndex(o => o.id === selectedOrder.value)
    if (index !== -1) {
      orders.value.splice(index, 1)
      selectedOrder.value = null
      toast.value = {
        show: true,
        message: 'Pesanan berhasil dihapus!',
        type: 'success'
      }
    }
    loading.value = false
  }, 800)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function updateDateOut() {
  if (editForm.value.statusOrder === 'Selesai') {
    // Set to today's date if status is Selesai (using local date)
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    editForm.value.dateOut = `${year}-${month}-${day}`
  } else {
    // Clear date if status is not Selesai
    editForm.value.dateOut = ''
  }
}

function updateAddDateOut() {
  if (addForm.value.statusOrder === 'Selesai') {
    // Set to today's date if status is Selesai (using local date)
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    addForm.value.dateOut = `${year}-${month}-${day}`
  } else {
    // Clear date if status is not Selesai
    addForm.value.dateOut = ''
  }
}
</script>

<style scoped>
/* Page Container */
.orders-container {
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
.orders-header {
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
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  table-layout: fixed;
}

.orders-table thead {
  background: #F5F5F5;
}

.orders-table th {
  padding: 15px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  border-bottom: 2px solid #E0E0E0;
  white-space: nowrap;
}

.orders-table td {
  padding: 15px 12px;
  font-size: 13px;
  color: #333333;
  border-bottom: 1px solid #F0F0F0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.orders-table tbody tr {
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  animation: fadeInRow 0.5s ease-out;
}

.orders-table tbody tr:hover {
  background: #f9f9f9;
  transform: translateX(2px);
  box-shadow: -2px 0 0 #1678F3;
  transition: all 0.2s ease;
}

.orders-table tbody tr.selected {
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

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.status-proses {
  background: #FFF3E0;
  color: #F57C00;
}

.status-selesai {
  background: #E8F5E9;
  color: #388E3C;
}

.status-lunas {
  background: #E8F5E9;
  color: #388E3C;
}

.status-belum {
  background: #FFEBEE;
  color: #D32F2F;
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
  padding: 30px;
  width: 90%;
  max-width: 800px;
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

/* Edit Modal */
.edit-modal-title,
.add-modal-title {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1678F3;
  margin: 0 0 25px 0;
  text-align: center;
}

.edit-modal-layout,
.add-modal-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.edit-form-section,
.edit-form-section-right,
.add-form-section,
.add-form-section-right {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edit-form-group,
.add-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-form-group label,
.add-form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.edit-form-group input,
.edit-form-group select,
.add-form-group input,
.add-form-group select {
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  background: white;
}

.edit-form-group input:focus,
.edit-form-group select:focus,
.add-form-group input:focus,
.add-form-group select:focus {
  outline: none;
  border-color: #1678F3;
  box-shadow: 0 0 0 3px rgba(22, 120, 243, 0.1);
}

.edit-form-group input:disabled,
.add-form-group input:disabled {
  background: #F5F5F5;
  cursor: not-allowed;
}

.edit-submit-btn,
.add-submit-btn {
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

.edit-submit-btn:hover,
.add-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 120, 243, 0.4);
}

.edit-submit-btn:active,
.add-submit-btn:active {
  transform: translateY(0);
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

  .orders-table {
    font-size: 12px;
  }

  .orders-table th,
  .orders-table td {
    padding: 10px 8px;
  }

  .edit-modal-layout,
  .add-modal-layout {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    padding: 20px;
  }
}
</style>
