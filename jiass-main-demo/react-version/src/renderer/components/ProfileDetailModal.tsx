import React, { useState, useEffect } from 'react';

interface Profile {
    id: string;
    name: string;
    description?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ProfileDetailModalProps {
    profile: Profile;
    onClose: () => void;
    onSave: (profile: Profile) => void;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ profile, onClose, onSave }) => {
    const [formData, setFormData] = useState<Profile>(profile);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim()) {
            onSave({
                ...formData,
                updatedAt: new Date().toISOString()
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>编辑配置文件</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>配置名称 *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="请输入配置名称"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>描述</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="请输入配置描述"
                            rows={3}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>状态</label>
                        <select
                            name="status"
                            value={formData.status || 'inactive'}
                            onChange={handleChange}
                        >
                            <option value="inactive">非活跃</option>
                            <option value="active">活跃</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>创建时间</label>
                        <input
                            type="text"
                            value={profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '未知'}
                            disabled
                        />
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            取消
                        </button>
                        <button type="submit" className="btn btn-primary">
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileDetailModal;
