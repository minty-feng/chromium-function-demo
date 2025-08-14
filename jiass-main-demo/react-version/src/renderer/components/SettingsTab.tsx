import React from 'react';

interface Settings {
    appName?: string;
    language?: string;
    autoSave?: boolean;
    debugMode?: boolean;
}

interface SettingsTabProps {
    settings: Settings;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings }) => {
    return (
        <div className="settings-tab">
            <div className="tab-header">
                <h2>系统设置</h2>
            </div>
            
            <div className="settings-content">
                <div className="setting-section">
                    <h3>基本设置</h3>
                    <div className="setting-item">
                        <label>应用名称</label>
                        <input 
                            type="text" 
                            defaultValue={settings.appName || 'AdsPower Clone'}
                            placeholder="应用名称"
                        />
                    </div>
                    <div className="setting-item">
                        <label>语言</label>
                        <select defaultValue={settings.language || 'zh-CN'}>
                            <option value="zh-CN">中文</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>
                </div>
                
                <div className="setting-section">
                    <h3>高级设置</h3>
                    <div className="setting-item">
                        <label>自动保存</label>
                        <input 
                            type="checkbox" 
                            defaultChecked={settings.autoSave !== false}
                        />
                    </div>
                    <div className="setting-item">
                        <label>调试模式</label>
                        <input 
                            type="checkbox" 
                            defaultChecked={settings.debugMode || false}
                        />
                    </div>
                </div>
                
                <div className="setting-actions">
                    <button className="btn btn-primary">保存设置</button>
                    <button className="btn btn-secondary">重置默认</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
