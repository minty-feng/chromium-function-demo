<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['sidebar-tab', { active: activeTab === tab.id }]"
        @click="handleTabChange(tab.id)"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['tab-change']);

// 响应式数据
const tabs = ref([
  { id: 'profiles', label: '配置文件', icon: 'fas fa-user' },
  { id: 'browsers', label: '浏览器', icon: 'fas fa-globe' },
  { id: 'groups', label: '分组', icon: 'fas fa-layer-group' },
  { id: 'settings', label: '设置', icon: 'fas fa-cog' }
]);

// 方法
const handleTabChange = (tabId) => {
  emit('tab-change', tabId);
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 1rem 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: #495057;
}

.sidebar-tab:hover {
  background: #f8f9fa;
  color: #007bff;
}

.sidebar-tab.active {
  background: #e3f2fd;
  color: #007bff;
  border-right: 3px solid #007bff;
}
</style>
