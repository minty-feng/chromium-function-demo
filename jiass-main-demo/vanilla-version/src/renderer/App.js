// 导入 CSS 样式
import './styles/main.css';

// 纯 JavaScript 版本 - 不使用任何框架
class App {
  constructor() {
    this.activeTab = 'profiles';
    this.profiles = [];
    this.browsers = [];
    this.groups = [];
    this.settings = {
      theme: 'light',
      language: 'zh-CN',
      autoSave: true,
      notifications: true
    };
    this.showNewProfileModal = false;
    this.showProfileDetailModal = false;
    this.selectedProfile = null;
    this.searchTerm = '';
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.render();
    this.bindEvents();
  }

  async loadData() {
    try {
      const [profilesData, browsersData, groupsData, settingsData] = await Promise.all([
        window.ipcRenderer.invoke('get-profiles'),
        window.ipcRenderer.invoke('get-browsers'),
        window.ipcRenderer.invoke('get-groups'),
        window.ipcRenderer.invoke('get-settings')
      ]);
      
      this.profiles = profilesData || [];
      this.browsers = browsersData || [];
      this.groups = groupsData || [];
      if (settingsData) this.settings = settingsData;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async handleSaveProfile(profile) {
    try {
      const updatedProfiles = await window.ipcRenderer.invoke('save-profile', profile);
      this.profiles = updatedProfiles;
      this.showNewProfileModal = false;
      this.showProfileDetailModal = false;
      this.render();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  async handleDeleteProfile(profileId) {
    try {
      const updatedProfiles = await window.ipcRenderer.invoke('delete-profile', profileId);
      this.profiles = updatedProfiles;
      this.render();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  }

  handleProfileClick(profile) {
    this.selectedProfile = profile;
    this.showProfileDetailModal = true;
    this.render();
  }

  setActiveTab(tabId) {
    this.activeTab = tabId;
    this.render();
  }

  handleSearchChange(value) {
    this.searchTerm = value;
    this.render();
  }

  renderActiveTab() {
    switch (this.activeTab) {
      case 'profiles':
        return this.renderProfilesTab();
      case 'browsers':
        return this.renderBrowsersTab();
      case 'groups':
        return this.renderGroupsTab();
      case 'settings':
        return this.renderSettingsTab();
      default:
        return this.renderProfilesTab();
    }
  }

  renderProfilesTab() {
    const filteredProfiles = this.profiles.filter(profile => 
      profile.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (profile.description && profile.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );

    return `
      <div class="tab-content active">
        <div class="tab-header">
          <h2>配置文件管理</h2>
          <div class="tab-actions">
            <button class="btn btn-primary" onclick="app.showNewProfileModal = true; app.render();">
              <i class="fas fa-plus"></i> 新建配置
            </button>
          </div>
        </div>
        <div class="profiles-grid">
          ${filteredProfiles.length > 0 ? filteredProfiles.map(profile => `
            <div class="profile-card" onclick="app.handleProfileClick(${JSON.stringify(profile)})">
              <div class="profile-header">
                <div class="profile-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="profile-info">
                  <h3>${profile.name}</h3>
                  <p>${profile.description || '无描述'}</p>
                  <div class="profile-tags">
                    ${profile.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                  </div>
                </div>
                <button class="delete-btn" onclick="event.stopPropagation(); app.handleDeleteProfile('${profile.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <i class="fas fa-user-slash"></i>
              <p>暂无配置文件</p>
              <button class="btn btn-primary" onclick="app.showNewProfileModal = true; app.render();">
                创建第一个配置文件
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderBrowsersTab() {
    return `
      <div class="tab-content active">
        <div class="tab-header">
          <h2>浏览器管理</h2>
        </div>
        <div class="browsers-list">
          ${this.browsers.length > 0 ? this.browsers.map(browser => `
            <div class="browser-item">
              <div class="browser-info">
                <div class="browser-icon">
                  <i class="fas fa-globe"></i>
                </div>
                <div class="browser-details">
                  <h3>${browser.name} ${browser.version || ''}</h3>
                  <p>平台: ${browser.platform || '未知'}</p>
                  <p>状态: ${browser.status || '未知'}</p>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <i class="fas fa-globe"></i>
              <p>暂无浏览器信息</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderGroupsTab() {
    return `
      <div class="tab-content active">
        <div class="tab-header">
          <h2>分组管理</h2>
        </div>
        <div class="groups-list">
          ${this.groups.length > 0 ? this.groups.map(group => `
            <div class="group-item">
              <div class="group-info">
                <div class="group-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="group-details">
                  <h3>${group.name}</h3>
                  <p>${group.description || '无描述'}</p>
                  <span class="profile-count">配置文件数量: ${group.profiles ? group.profiles.length : 0}</span>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <i class="fas fa-layer-group"></i>
              <p>暂无分组</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderSettingsTab() {
    return `
      <div class="tab-content active">
        <div class="tab-header">
          <h2>设置</h2>
        </div>
        <div class="settings-content">
          <div class="setting-section">
            <h3>界面设置</h3>
            <div class="setting-item">
              <label>主题:</label>
              <select onchange="app.settings.theme = this.value; app.render();">
                <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>浅色</option>
                <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>深色</option>
              </select>
            </div>
            <div class="setting-item">
              <label>语言:</label>
              <select onchange="app.settings.language = this.value; app.render();">
                <option value="zh-CN" ${this.settings.language === 'zh-CN' ? 'selected' : ''}>中文</option>
                <option value="en-US" ${this.settings.language === 'en-US' ? 'selected' : ''}>English</option>
              </select>
            </div>
          </div>
          <div class="setting-section">
            <h3>功能设置</h3>
            <div class="setting-item">
              <label>
                <input type="checkbox" ${this.settings.autoSave ? 'checked' : ''} 
                       onchange="app.settings.autoSave = this.checked; app.render();">
                自动保存
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" ${this.settings.notifications ? 'checked' : ''} 
                       onchange="app.settings.notifications = this.checked; app.render();">
                通知
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="app">
        <header class="header">
          <div class="header-left">
            <div class="logo">
              <i class="fas fa-shield-alt"></i>
              <span>AdsPower Clone - 纯 JavaScript 版本</span>
            </div>
          </div>
          <div class="header-center">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="搜索配置文件..." 
                value="${this.searchTerm}"
                onchange="app.handleSearchChange(this.value)"
              />
            </div>
          </div>
          <div class="header-right">
            <button class="btn btn-primary" onclick="app.showNewProfileModal = true; app.render();">
              <i class="fas fa-plus"></i>
              新建配置
            </button>
            <div class="user-menu">
              <i class="fas fa-user-circle"></i>
              <span>用户</span>
            </div>
          </div>
        </header>
        
        <div class="main-content">
          <aside class="sidebar">
            <nav class="sidebar-nav">
              <button class="sidebar-tab ${this.activeTab === 'profiles' ? 'active' : ''}" 
                      onclick="app.setActiveTab('profiles')">
                <i class="fas fa-user"></i>
                <span>配置文件</span>
              </button>
              <button class="sidebar-tab ${this.activeTab === 'browsers' ? 'active' : ''}" 
                      onclick="app.setActiveTab('browsers')">
                <i class="fas fa-globe"></i>
                <span>浏览器</span>
              </button>
              <button class="sidebar-tab ${this.activeTab === 'groups' ? 'active' : ''}" 
                      onclick="app.setActiveTab('groups')">
                <i class="fas fa-layer-group"></i>
                <span>分组</span>
              </button>
              <button class="sidebar-tab ${this.activeTab === 'settings' ? 'active' : ''}" 
                      onclick="app.setActiveTab('settings')">
                <i class="fas fa-cog"></i>
                <span>设置</span>
              </button>
            </nav>
          </aside>
          
          <main class="content-area">
            ${this.renderActiveTab()}
          </main>
        </div>
        
        ${this.showNewProfileModal ? this.renderNewProfileModal() : ''}
        ${this.showProfileDetailModal && this.selectedProfile ? this.renderProfileDetailModal() : ''}
      </div>
    `;
  }

  renderNewProfileModal() {
    return `
      <div class="modal-overlay" onclick="app.showNewProfileModal = false; app.render();">
        <div class="modal-content" onclick="event.stopPropagation();">
          <div class="modal-header">
            <h3>新建配置文件</h3>
            <button class="close-btn" onclick="app.showNewProfileModal = false; app.render();">&times;</button>
          </div>
          <div class="modal-body">
            <form id="newProfileForm">
              <div class="form-group">
                <label>名称:</label>
                <input type="text" id="profileName" required>
              </div>
              <div class="form-group">
                <label>描述:</label>
                <textarea id="profileDescription"></textarea>
              </div>
              <div class="form-group">
                <label>标签:</label>
                <input type="text" id="profileTags" placeholder="用逗号分隔">
              </div>
            </form>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" onclick="app.showNewProfileModal = false; app.render();">取消</button>
            <button class="btn btn-primary" onclick="app.submitNewProfile();">保存</button>
          </div>
        </div>
      </div>
    `;
  }

  renderProfileDetailModal() {
    const profile = this.selectedProfile;
    return `
      <div class="modal-overlay" onclick="app.showProfileDetailModal = false; app.render();">
        <div class="modal-content" onclick="event.stopPropagation();">
          <div class="modal-header">
            <h3>编辑配置文件</h3>
            <button class="close-btn" onclick="app.showProfileDetailModal = false; app.render();">&times;</button>
          </div>
          <div class="modal-body">
            <form id="editProfileForm">
              <div class="form-group">
                <label>名称:</label>
                <input type="text" id="editProfileName" value="${profile.name}" required>
              </div>
              <div class="form-group">
                <label>描述:</label>
                <textarea id="editProfileDescription">${profile.description || ''}</textarea>
              </div>
              <div class="form-group">
                <label>标签:</label>
                <input type="text" id="editProfileTags" value="${profile.tags.join(', ')}" placeholder="用逗号分隔">
              </div>
              <div class="form-group">
                <label>状态:</label>
                <select id="editProfileStatus">
                  <option value="active" ${profile.status === 'active' ? 'selected' : ''}>活跃</option>
                  <option value="inactive" ${profile.status === 'inactive' ? 'selected' : ''}>非活跃</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" onclick="app.showProfileDetailModal = false; app.render();">取消</button>
            <button class="btn btn-primary" onclick="app.submitEditProfile();">保存</button>
          </div>
        </div>
      </div>
    `;
  }

  submitNewProfile() {
    const name = document.getElementById('profileName').value;
    const description = document.getElementById('profileDescription').value;
    const tags = document.getElementById('profileTags').value.split(',').map(t => t.trim()).filter(t => t);
    
    if (!name) return;
    
    const newProfile = {
      id: Date.now().toString(),
      name,
      description,
      tags,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    this.handleSaveProfile(newProfile);
  }

  submitEditProfile() {
    const name = document.getElementById('editProfileName').value;
    const description = document.getElementById('editProfileDescription').value;
    const tags = document.getElementById('editProfileTags').value.split(',').map(t => t.trim()).filter(t => t);
    const status = document.getElementById('editProfileStatus').value;
    
    if (!name) return;
    
    const updatedProfile = {
      ...this.selectedProfile,
      name,
      description,
      tags,
      status,
      updatedAt: new Date().toISOString()
    };
    
    this.handleSaveProfile(updatedProfile);
  }

  bindEvents() {
    // 事件绑定已经在 HTML 中通过 onclick 处理
  }
}

// 全局应用实例
let app;

// 当 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
});
