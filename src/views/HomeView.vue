<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ChatWidget from '../components/ChatWidget.vue'

const router = useRouter()
const authStore = useAuthStore()
const showChat = ref(false)

onMounted(() => {
  // If user is already logged in, redirect to their dashboard
  if (authStore.isAuthenticated) {
    const roleRoutes = {
      customer: '/customer/home',
      admin: '/admin/dashboard',
      owner: '/owner/dashboard'
    }
    router.push(roleRoutes[authStore.role] || '/login')
  }
})

function openChat() {
  showChat.value = true
}

function closeChat() {
  showChat.value = false
}
</script>

<template>
  <div class="home-page">
    <!-- Logo badges top left -->
    <div class="logo-badges">
      <img src="../assets/images/logo_gundar_aptikom.png" alt="Logo Gundar & Aptikom">
    </div>
    
    <!-- Decorative boxes -->
    <div class="deco-box-top-right">
      <img src="../assets/images/decor_pojok_kanan_atas.png" alt="Dekorasi">
    </div>
    <div class="deco-box-bottom-left">
      <img src="../assets/images/decor_pojok_kiri_bawah.png" alt="Dekorasi">
    </div>
    
    <!-- Main Content Container -->
    <div class="main-content">
      <!-- Main logo -->
      <div class="logo-main">
        <img src="../assets/images/logo_apik.png" alt="Apik Laundry">
      </div>
      
      <!-- Tagline -->
      <p class="tagline">
        Cek Status, Riwayat, dan Info Laundry<br>Tanpa Ribet
      </p>
      
      <!-- Buttons -->
      <div class="button-group">
        <router-link to="/login" class="btn btn-login">Login</router-link>
        <router-link to="/register" class="btn btn-register">Register</router-link>
      </div>
    </div>
    
    <!-- Tanya Apik chat button -->
    <div @click="openChat" class="chat-button">
      <img src="../assets/images/comment.png" alt="Chat Icon" class="chat-icon-img">
      <span>Tanya Apik</span>
    </div>
    
    <!-- Chat Widget -->
    <ChatWidget v-if="showChat" @close="closeChat" />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  width: 100%;
  min-height: 100vh;
  background: #E8E8E8;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Logo badges top left */
.logo-badges {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
}

.logo-badges img {
  height: 60px;
  width: auto;
  object-fit: contain;
}

/* Decorative boxes in corners */
.deco-box-top-right {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
}

.deco-box-top-right img {
  width: auto;
  height: auto;
  max-width: 250px;
  display: block;
}

.deco-box-bottom-left {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
}

.deco-box-bottom-left img {
  width: auto;
  height: auto;
  max-width: 250px;
  display: block;
}

/* Main content */
.main-content {
  text-align: center;
  z-index: 10;
  padding: 20px;
}

.logo-main {
  width: 400px;
  height: 400px;
  margin: 0 auto 30px;
}

.logo-main img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tagline {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 40px;
  line-height: 1.5;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
}

.btn {
  width: 232px;
  height: 51px;
  background: #1678F3;
  border: 2px solid #959191;
  border-radius: 8px;
  box-shadow: 0px 5px 7px rgba(0, 0, 0, 0.25);
  font-family: 'K2D', sans-serif;
  font-size: 24px;
  color: #000000;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 20px;
}

.btn:hover {
  background: #0d5ec4;
  color: #ffffff;
  box-shadow: 0px 7px 10px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}

/* Chat button */
.chat-button {
  position: fixed;
  bottom: 80px;
  right: 80px;
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

.chat-icon-img {
  width: 74px;
  height: 74px;
  object-fit: contain;
  margin-bottom: 10px;
  pointer-events: none;
}

.chat-button span {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  pointer-events: none;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .logo-main {
    width: 350px;
    height: 350px;
  }
  
  .tagline {
    font-size: 18px;
  }
  
  .btn {
    width: 200px;
    font-size: 22px;
  }
  
  .button-group {
    gap: 25px;
  }
  
  .deco-box-top-right img,
  .deco-box-bottom-left img {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .logo-badges img {
    height: 48px;
  }
  
  .deco-box-top-right img,
  .deco-box-bottom-left img {
    max-width: 150px;
  }
  
  .logo-main {
    width: 280px;
    height: 280px;
    margin-bottom: 20px;
  }
  
  .tagline {
    font-size: 16px;
    margin-bottom: 30px;
    padding: 0 20px;
  }
  
  .button-group {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 180px;
    height: 45px;
    font-size: 20px;
  }
  
  .chat-button {
    bottom: 40px;
    right: 40px;
  }
  
  .btn {
    width: 180px;
    height: 45px;
    font-size: 20px;
  }
  
  .chat-button {
    bottom: 40px;
    right: 40px;
  }
  
  .chat-icon-img {
    width: 60px;
    height: 60px;
  }
  
  .chat-button span {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .logo-badges img {
    height: 40px;
  }
  
  .deco-box-top-right img,
  .deco-box-bottom-left img {
    max-width: 120px;
  }
  
  .logo-main {
    width: 240px;
    height: 240px;
  }
  
  .tagline {
    font-size: 14px;
  }
  
  .btn {
    width: 160px;
    height: 42px;
    font-size: 18px;
  }
  
  .chat-button {
    bottom: 30px;
    right: 30px;
  }
  
  .chat-icon-img {
    width: 50px;
    height: 50px;
  }
  
  .chat-button span {
    font-size: 14px;
  }
}
</style>
