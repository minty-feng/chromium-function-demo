import React from 'react';

interface Profile {
    id: string;
    name: string;
    description?: string;
    status?: string;
    createdAt?: string;
}

interface ProfileCardProps {
    profile: Profile;
    onClick: () => void;
    onDelete: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick, onDelete }) => {
    return (
        <div className="profile-card" onClick={onClick}>
            <div className="profile-header">
                <div className="profile-avatar">
                    <i className="fas fa-user"></i>
                </div>
                <div className="profile-info">
                    <h3>{profile.name || '未命名配置'}</h3>
                    <p>{profile.description || '暂无描述'}</p>
                </div>
                <button 
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
            <div className="profile-details">
                <div className="detail-item">
                    <span className="label">状态:</span>
                    <span className={`status ${profile.status || 'inactive'}`}>
                        {profile.status === 'active' ? '活跃' : '非活跃'}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="label">创建时间:</span>
                    <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '未知'}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
