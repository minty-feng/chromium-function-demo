<template>
  <div class="settings-tab">
    <div class="tab-header">
      <h2>系统设置</h2>
    </div>
    
    <div class="settings-content">
      <div class="setting-section">
        <h3>基本设置</h3>
        <div class="setting-item">
          <label>应用名称</label>
          <input 
            type="text" 
            v-model="localSettings.appName"
            placeholder="应用名称"
          />
        </div>
        <div class="setting-item">
          <label>语言</label>
          <select v-model="localSettings.language">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </div>
      
      <div class="setting-section">
        <h3>高级设置</h3>
        <div class="setting-item">
          <label>自动保存</label>
          <input 
            type="checkbox" 
            v-model="localSettings.autoSave"
          />
        </div>
        <div class="setting-item">
          <label>调试模式</label>
          <input 
            type="checkbox" 
            v-model="localSettings.debugMode"
          />
        </div>
      </div>
      
      <div class="setting-actions">
        <button class="btn btn-primary" @click="saveSettings">保存设置</button>
        <button class="btn btn-secondary" @click="resetSettings">重置默认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
});

// 响应式数据
const localSettings = ref({
  appName: props.settings.appName || 'AdsPower Clone',
  language: props.settings.language || 'zh-CN',
  autoSave: props.settings.autoSave !== false,
  debugMode: props.settings.debugMode || false
});

// 监听 props 变化
watch(() => props.settings, (newSettings) => {
  localSettings.value = {
    appName: newSettings.appName || 'AdsPower Clone',
    language: newSettings.language || 'zh-CN',
    autoSave: newSettings.autoSave !== false,
    debugMode: newSettings.debugMode || false
  };
}, { deep: true });

// 方法
const saveSettings = () => {
  // 这里可以触发保存事件
  console.log('保存设置:', localSettings.value);
};

const resetSettings = () => {
  localSettings.value = {
    appName: 'AdsPower Clone',
    language: 'zh-CN',
    autoSave: true,
    debugMode: false
  };
};
</script>

<style scoped>
.settings-tab {
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

.settings-content {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.setting-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.setting-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.setting-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  color: #333;
  font-weight: 500;
}

.setting-item input,
.setting-item select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 0.9rem;
}

.setting-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
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
