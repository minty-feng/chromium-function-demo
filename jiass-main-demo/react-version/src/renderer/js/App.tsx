import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProfilesTab from '../components/ProfilesTab';
import BrowsersTab from '../components/BrowsersTab';
import GroupsTab from '../components/GroupsTab';
import SettingsTab from '../components/SettingsTab';
import NewProfileModal from '../components/NewProfileModal';
import ProfileDetailModal from '../components/ProfileDetailModal';

// 类型定义
interface Profile {
    id: string;
    name: string;
    description?: string;
    status?: string;
    createdAt?: string;
}

interface Browser {
    id: string;
    name: string;
    version?: string;
}

interface Group {
    id: string;
    name: string;
    description?: string;
    profileCount?: number;
}

interface Settings {
    appName?: string;
    language?: string;
    autoSave?: boolean;
    debugMode?: boolean;
}

// 声明全局变量
declare global {
    interface Window {
        require: (module: string) => any;
    }
}

const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('profiles');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [browsers, setBrowsers] = useState<Browser[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [settings, setSettings] = useState<Settings>({});
    const [showNewProfileModal, setShowNewProfileModal] = useState<boolean>(false);
    const [showProfileDetailModal, setShowProfileDetailModal] = useState<boolean>(false);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profilesData, browsersData, groupsData, settingsData] = await Promise.all([
                ipcRenderer.invoke('get-profiles'),
                ipcRenderer.invoke('get-browsers'),
                ipcRenderer.invoke('get-groups'),
                ipcRenderer.invoke('get-settings')
            ]);
            
            setProfiles(profilesData);
            setBrowsers(browsersData);
            setGroups(groupsData);
            setSettings(settingsData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleSaveProfile = async (profile: Profile) => {
        try {
            const updatedProfiles = await ipcRenderer.invoke('save-profile', profile);
            setProfiles(updatedProfiles);
            setShowNewProfileModal(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleDeleteProfile = async (profileId: string) => {
        try {
            const updatedProfiles = await ipcRenderer.invoke('delete-profile', profileId);
            setProfiles(updatedProfiles);
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    const handleProfileClick = (profile: Profile) => {
        setSelectedProfile(profile);
        setShowProfileDetailModal(true);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'profiles':
                return (
                    <ProfilesTab
                        profiles={profiles}
                        onNewProfile={() => setShowNewProfileModal(true)}
                        onProfileClick={handleProfileClick}
                        onDeleteProfile={handleDeleteProfile}
                    />
                );
            case 'browsers':
                return <BrowsersTab browsers={browsers} />;
            case 'groups':
                return <GroupsTab groups={groups} />;
            case 'settings':
                return <SettingsTab settings={settings} />;
            default:
                return (
                    <ProfilesTab 
                        profiles={profiles} 
                        onNewProfile={() => setShowNewProfileModal(true)}
                        onProfileClick={handleProfileClick}
                        onDeleteProfile={handleDeleteProfile}
                    />
                );
        }
    };

    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="content-area">
                    {renderActiveTab()}
                </div>
            </div>
            
            {showNewProfileModal && (
                <NewProfileModal
                    onClose={() => setShowNewProfileModal(false)}
                    onSave={handleSaveProfile}
                />
            )}
            
            {showProfileDetailModal && selectedProfile && (
                <ProfileDetailModal
                    profile={selectedProfile}
                    onClose={() => setShowProfileDetailModal(false)}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
};

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
