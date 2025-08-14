<template>
  <div class="profiles-tab">
    <div class="tab-header">
      <h2>配置文件管理</h2>
      <button class="btn btn-primary" @click="handleNewProfile">
        <i class="fas fa-plus"></i>
        新建配置
      </button>
    </div>
    
    <div class="profiles-grid">
      <div v-if="profiles.length === 0" class="empty-state">
        <i class="fas fa-user-plus"></i>
        <p>暂无配置文件</p>
        <button class="btn btn-primary" @click="handleNewProfile">
          创建第一个配置
        </button>
      </div>
      
      <ProfileCard
        v-else
        v-for="profile in profiles"
        :key="profile.id"
        :profile="profile"
        @click="handleProfileClick(profile)"
        @delete="handleDeleteProfile(profile.id)"
      />
    </div>
  </div>
</template>

<script setup>
import ProfileCard from './ProfileCard.vue';

// Props
const props = defineProps({
  profiles: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['new-profile', 'profile-click', 'delete-profile']);

// 方法
const handleNewProfile = () => {
  emit('new-profile');
};

const handleProfileClick = (profile) => {
  emit('profile-click', profile);
};

const handleDeleteProfile = (profileId) => {
  emit('delete-profile', profileId);
};
</script>

<style scoped>
.profiles-tab {
  padding: 1rem;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tab-header h2 {
  color: #333;
  font-size: 1.8rem;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  grid-column: 1 / -1;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dee2e6;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
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
</style>
