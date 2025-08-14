import React from 'react';

interface HeaderProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    onNewProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm = '', onSearchChange, onNewProfile }) => {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <i className="fas fa-shield-alt"></i>
                    <span>AdsPower Clone - React</span>
                </div>
            </div>
            <div className="header-center">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="搜索配置文件..." 
                        value={searchTerm}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
            </div>
            <div className="header-right">
                <button className="btn btn-primary" onClick={onNewProfile}>
                    <i className="fas fa-plus"></i>
                    新建配置
                </button>
                <div className="user-menu">
                    <i className="fas fa-user-circle"></i>
                    <span>用户</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
