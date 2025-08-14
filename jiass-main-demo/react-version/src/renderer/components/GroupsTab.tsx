import React from 'react';

interface Group {
    id: string;
    name: string;
    description?: string;
    profileCount?: number;
}

interface GroupsTabProps {
    groups: Group[];
}

const GroupsTab: React.FC<GroupsTabProps> = ({ groups }) => {
    return (
        <div className="groups-tab">
            <div className="tab-header">
                <h2>分组管理</h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    新建分组
                </button>
            </div>
            
            <div className="groups-list">
                {groups.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-layer-group"></i>
                        <p>暂无分组</p>
                        <button className="btn btn-primary">创建第一个分组</button>
                    </div>
                ) : (
                    groups.map(group => (
                        <div key={group.id} className="group-item">
                            <div className="group-icon">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <div className="group-info">
                                <h3>{group.name}</h3>
                                <p>{group.description || '暂无描述'}</p>
                                <span className="profile-count">{group.profileCount || 0} 个配置</span>
                            </div>
                            <div className="group-actions">
                                <button className="btn btn-secondary">编辑</button>
                                <button className="btn btn-danger">删除</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GroupsTab;
