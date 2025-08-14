<template>
  <div class="profile-card" @click="handleClick">
    <div class="profile-header">
      <div class="profile-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="profile-info">
        <h3>{{ profile.name || '未命名配置' }}</h3>
        <p>{{ profile.description || '暂无描述' }}</p>
      </div>
      <button 
        class="delete-btn"
        @click.stop="handleDelete"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="profile-details">
      <div class="detail-item">
        <span class="label">状态:</span>
        <span :class="['status', profile.status || 'inactive']">
          {{ profile.status === 'active' ? '活跃' : '非活跃' }}
        </span>
      </div>
      <div class="detail-item">
        <span class="label">创建时间:</span>
        <span>{{ formatDate(profile.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['click', 'delete']);

// 方法
const handleClick = () => {
  emit('click', props.profile);
};

const handleDelete = () => {
  emit('delete', props.profile.id);
};

const formatDate = (dateString) => {
  if (!dateString) return '未知';
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.profile-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.profile-info {
  flex: 1;
}

.profile-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.profile-info p {
  color: #6c757d;
  font-size: 0.9rem;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #f8d7da;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.detail-item .label {
  color: #6c757d;
  font-weight: 500;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}
</style>
