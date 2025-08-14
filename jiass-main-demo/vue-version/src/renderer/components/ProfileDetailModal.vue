<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>编辑配置文件</h3>
        <button class="close-btn" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>配置名称 *</label>
          <input
            type="text"
            v-model="formData.name"
            placeholder="请输入配置名称"
            required
          />
        </div>
        
        <div class="form-group">
          <label>描述</label>
          <textarea
            v-model="formData.description"
            placeholder="请输入配置描述"
            rows="3"
          />
        </div>
        
        <div class="form-group">
          <label>状态</label>
          <select v-model="formData.status">
            <option value="inactive">非活跃</option>
            <option value="active">活跃</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>创建时间</label>
          <input
            type="text"
            :value="formatDate(profile.createdAt)"
            disabled
          />
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">
            取消
          </button>
          <button type="submit" class="btn btn-primary">
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// 响应式数据
const formData = ref({
  name: props.profile.name || '',
  description: props.profile.description || '',
  status: props.profile.status || 'inactive'
});

// 监听 props 变化
watch(() => props.profile, (newProfile) => {
  formData.value = {
    name: newProfile.name || '',
    description: newProfile.description || '',
    status: newProfile.status || 'inactive'
  };
}, { deep: true });

// 方法
const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (formData.value.name.trim()) {
    emit('save', {
      ...props.profile,
      ...formData.value,
      updatedAt: new Date().toISOString()
    });
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '未知';
  return new Date(dateString).toLocaleString();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}
</style>
