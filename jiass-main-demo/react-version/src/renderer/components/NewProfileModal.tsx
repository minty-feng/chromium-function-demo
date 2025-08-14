import React, { useState } from 'react';

interface Profile {
    id: string;
    name: string;
    description?: string;
    status: string;
    createdAt: string;
}

interface NewProfileModalProps {
    onClose: () => void;
    onSave: (profile: Profile) => void;
}

const NewProfileModal: React.FC<NewProfileModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'inactive'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim()) {
            onSave({
                ...formData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
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
                    <h3>新建配置文件</h3>
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
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="请输入配置名称"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>描述</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="请输入配置描述"
                            rows={3}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>状态</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="inactive">非活跃</option>
                            <option value="active">活跃</option>
                        </select>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            取消
                        </button>
                        <button type="submit" className="btn btn-primary">
                            创建
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProfileModal;
