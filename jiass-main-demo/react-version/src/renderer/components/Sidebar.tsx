import React from 'react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'profiles', label: '配置文件', icon: 'fas fa-user' },
        { id: 'browsers', label: '浏览器', icon: 'fas fa-globe' },
        { id: 'groups', label: '分组', icon: 'fas fa-layer-group' },
        { id: 'settings', label: '设置', icon: 'fas fa-cog' }
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
