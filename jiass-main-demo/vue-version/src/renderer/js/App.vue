<template>
  <div class="app">
    <Header />
    <div class="main-content">
      <Sidebar :active-tab="activeTab" @tab-change="setActiveTab" />
      <div class="content-area">
        <component :is="currentTabComponent" 
                  :profiles="profiles"
                  :browsers="browsers"
                  :groups="groups"
                  :settings="settings"
                  @new-profile="showNewProfileModal = true"
                  @profile-click="handleProfileClick"
                  @delete-profile="handleDeleteProfile" />
      </div>
    </div>
    
    <!-- 新建配置文件模态框 -->
    <NewProfileModal 
      v-if="showNewProfileModal"
      @close="showNewProfileModal = false"
      @save="handleSaveProfile" />
    
    <!-- 配置文件详情模态框 -->
    <ProfileDetailModal 
      v-if="showProfileDetailModal && selectedProfile"
      :profile="selectedProfile"
      @close="showProfileDetailModal = false"
      @save="handleSaveProfile" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import ProfilesTab from '../components/ProfilesTab.vue';
import BrowsersTab from '../components/BrowsersTab.vue';
import GroupsTab from '../components/GroupsTab.vue';
import SettingsTab from '../components/SettingsTab.vue';
import NewProfileModal from '../components/NewProfileModal.vue';
import ProfileDetailModal from '../components/ProfileDetailModal.vue';

// 声明全局变量
const { ipcRenderer } = window.require('electron');

// 响应式数据
const activeTab = ref('profiles');
const profiles = ref([]);
const browsers = ref([]);
const groups = ref([]);
const settings = ref({});
const showNewProfileModal = ref(false);
const showProfileDetailModal = ref(false);
const selectedProfile = ref(null);

// 计算属性
const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'profiles':
      return ProfilesTab;
    case 'browsers':
      return BrowsersTab;
    case 'groups':
      return GroupsTab;
    case 'settings':
      return SettingsTab;
    default:
      return ProfilesTab;
  }
});

// 方法
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const loadData = async () => {
  try {
    const [profilesData, browsersData, groupsData, settingsData] = await Promise.all([
      ipcRenderer.invoke('get-profiles'),
      ipcRenderer.invoke('get-browsers'),
      ipcRenderer.invoke('get-groups'),
      ipcRenderer.invoke('get-settings')
    ]);
    
    profiles.value = profilesData;
    browsers.value = browsersData;
    groups.value = groupsData;
    settings.value = settingsData;
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

const handleSaveProfile = async (profile) => {
  try {
    const updatedProfiles = await ipcRenderer.invoke('save-profile', profile);
    profiles.value = updatedProfiles;
    showNewProfileModal.value = false;
    showProfileDetailModal.value = false;
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

const handleDeleteProfile = async (profileId) => {
  try {
    const updatedProfiles = await ipcRenderer.invoke('delete-profile', profileId);
    profiles.value = updatedProfiles;
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
};

const handleProfileClick = (profile) => {
  selectedProfile.value = profile;
  showProfileDetailModal.value = true;
};

// 生命周期
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
