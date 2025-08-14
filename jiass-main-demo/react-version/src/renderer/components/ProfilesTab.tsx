import React from 'react';
import ProfileCard from './ProfileCard';

interface Profile {
    id: string;
    name: string;
    description?: string;
    status?: string;
    createdAt?: string;
}

interface ProfilesTabProps {
    profiles: Profile[];
    onNewProfile: () => void;
    onProfileClick: (profile: Profile) => void;
    onDeleteProfile: (profileId: string) => void;
}

const ProfilesTab: React.FC<ProfilesTabProps> = ({ 
    profiles, 
    onNewProfile, 
    onProfileClick, 
    onDeleteProfile 
}) => {
    return (
        <div className="profiles-tab">
            <div className="tab-header">
                <h2>配置文件管理</h2>
                <button className="btn btn-primary" onClick={onNewProfile}>
                    <i className="fas fa-plus"></i>
                    新建配置
                </button>
            </div>
            
            <div className="profiles-grid">
                {profiles.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-user-plus"></i>
                        <p>暂无配置文件</p>
                        <button className="btn btn-primary" onClick={onNewProfile}>
                            创建第一个配置
                        </button>
                    </div>
                ) : (
                    profiles.map(profile => (
                        <ProfileCard
                            key={profile.id}
                            profile={profile}
                            onClick={() => onProfileClick(profile)}
                            onDelete={() => onDeleteProfile(profile.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfilesTab;
