<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <i class="fas fa-shield-alt"></i>
        <span>AdsPower Clone - Vue</span>
      </div>
    </div>
    <div class="header-center">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="搜索配置文件..." 
          v-model="searchTerm"
          @input="handleSearchChange"
        />
      </div>
    </div>
    <div class="header-right">
      <button class="btn btn-primary" @click="handleNewProfile">
        <i class="fas fa-plus"></i>
        新建配置
      </button>
      <div class="user-menu">
        <i class="fas fa-user-circle"></i>
        <span>用户</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  }
});

// Emits
const emit = defineEmits(['search-change', 'new-profile']);

// 响应式数据
const searchTerm = ref(props.searchTerm);

// 方法
const handleSearchChange = () => {
  emit('search-change', searchTerm.value);
};

const handleNewProfile = () => {
  emit('new-profile');
};
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.header-center .search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
}

.search-box input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  width: 300px;
}

.search-box input::placeholder {
  color: rgba(255,255,255,0.7);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  transition: background 0.3s;
}

.user-menu:hover {
  background: rgba(255,255,255,0.2);
}
</style>
