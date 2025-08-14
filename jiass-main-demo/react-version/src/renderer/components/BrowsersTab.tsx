import React from 'react';

interface Browser {
    id: string;
    name: string;
    version?: string;
}

interface BrowsersTabProps {
    browsers: Browser[];
}

const BrowsersTab: React.FC<BrowsersTabProps> = ({ browsers }) => {
    return (
        <div className="browsers-tab">
            <div className="tab-header">
                <h2>浏览器管理</h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    添加浏览器
                </button>
            </div>
            
            <div className="browsers-list">
                {browsers.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-globe"></i>
                        <p>暂无浏览器配置</p>
                        <button className="btn btn-primary">添加第一个浏览器</button>
                    </div>
                ) : (
                    browsers.map(browser => (
                        <div key={browser.id} className="browser-item">
                            <div className="browser-icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <div className="browser-info">
                                <h3>{browser.name}</h3>
                                <p>{browser.version}</p>
                            </div>
                            <div className="browser-actions">
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

export default BrowsersTab;
