<template>
  <div class="browsers-tab">
    <div class="tab-header">
      <h2>浏览器管理</h2>
      <button class="btn btn-primary">
        <i class="fas fa-plus"></i>
        添加浏览器
      </button>
    </div>
    
    <div class="browsers-list">
      <div v-if="browsers.length === 0" class="empty-state">
        <i class="fas fa-globe"></i>
        <p>暂无浏览器配置</p>
        <button class="btn btn-primary">添加第一个浏览器</button>
      </div>
      
      <div v-else v-for="browser in browsers" :key="browser.id" class="browser-item">
        <div class="browser-icon">
          <i class="fas fa-globe"></i>
        </div>
        <div class="browser-info">
          <h3>{{ browser.name }}</h3>
          <p>{{ browser.version }}</p>
        </div>
        <div class="browser-actions">
          <button class="btn btn-secondary">编辑</button>
          <button class="btn btn-danger">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  browsers: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.browsers-tab {
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

.browsers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
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

.browser-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.browser-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.browser-info {
  flex: 1;
}

.browser-info h3 {
  margin-bottom: 0.25rem;
  color: #333;
}

.browser-info p {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.browser-actions {
  display: flex;
  gap: 0.5rem;
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

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}
</style>
