import React from 'react'

export interface PoolIconProps {
  size?: number
  strokeWidth?: number
  style?: React.CSSProperties
  type?: 'default' | 'simple' | 'dots' | 'circles' | 'squares' | 'hexagons' | 'waves' | 'stack' | 'cluster' | 'cylinder' | 'tray' | 'grid' | 'mini'
  color?: string
}

const PoolIcon: React.FC<PoolIconProps> = ({ 
  size = 12, 
  strokeWidth = 1.5,
  style, 
  type = 'default',
  color = 'currentColor'
}) => {
  const iconStyles = {
    ...style,
    color: color
  }

  // 根据类型返回不同的图标
  switch (type) {
    case 'simple':
      return <PoolIconSimple size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'dots':
      return <PoolIconDots size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'circles':
      return <PoolIconCircles size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'squares':
      return <PoolIconSquares size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'hexagons':
      return <PoolIconHexagons size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'waves':
      return <PoolIconWaves size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'stack':
      return <PoolIconStack size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'cluster':
      return <PoolIconCluster size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'cylinder':
      return <PoolIconCylinder size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'tray':
      return <PoolIconTray size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'grid':
      return <PoolIconGrid size={size} strokeWidth={strokeWidth} style={iconStyles} />
    case 'mini':
      return <PoolIconMini size={size} strokeWidth={strokeWidth} style={iconStyles} />
    default:
      return <PoolIconSimple size={size} strokeWidth={strokeWidth} style={iconStyles} />
  }
}

// 1) Simple：极简资源池，一个容器 + 几个点
const PoolIconSimple: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 容器边界 */}
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth={sw} />
      
      {/* 资源点 */}
      <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
      <circle cx="16" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="14" r="1.5" fill="currentColor" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

// 2) Dots：点状资源池，强调资源颗粒
const PoolIconDots: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 容器边界 */}
      <ellipse cx="12" cy="12" rx="9" ry="6" stroke="currentColor" strokeWidth={sw} />
      
      {/* 资源点阵 */}
      <circle cx="8" cy="9" r="1.2" fill="currentColor" />
      <circle cx="12" cy="9" r="1.2" fill="currentColor" />
      <circle cx="16" cy="9" r="1.2" fill="currentColor" />
      <circle cx="7" cy="12" r="1.2" fill="currentColor" />
      <circle cx="11" cy="12" r="1.2" fill="currentColor" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
      <circle cx="13" cy="15" r="1.2" fill="currentColor" />
    </svg>
  )
}

// 3) Circles：圆形资源池，强调资源聚合
const PoolIconCircles: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 外层容器 */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={sw} />
      
      {/* 内层资源圈 */}
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth={sw} opacity="0.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={sw} opacity="0.4" />
      
      {/* 中心点 */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

// 4) Squares：方形资源池，强调资源块
const PoolIconSquares: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 容器边界 */}
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={sw} />
      
      {/* 资源块 */}
      <rect x="6" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="12" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="6" y="12" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="12" y="12" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="9" y="9" width="4" height="4" rx="0.5" fill="currentColor" />
    </svg>
  )
}

// 5) Hexagons：六边形资源池，强调蜂窝结构
const PoolIconHexagons: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 外层六边形容器 */}
      <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth={sw} />
      
      {/* 内层六边形 */}
      <path d="M12 6L17 9V15L12 18L7 15V9L12 6Z" stroke="currentColor" strokeWidth={sw} opacity="0.6" />
      
      {/* 中心六边形 */}
      <path d="M12 10L14 11.5V13.5L12 15L10 13.5V11.5L12 10Z" fill="currentColor" />
    </svg>
  )
}

// 6) Waves：波浪资源池，强调资源流动
const PoolIconWaves: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 容器边界 */}
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={sw} />
      
      {/* 波浪线 */}
      <path d="M6 8c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth={sw} />
      <path d="M6 12c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth={sw} opacity="0.7" />
      <path d="M6 16c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth={sw} opacity="0.5" />
      
      {/* 资源点 */}
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

// 7) Stack：堆叠资源池，强调资源层次
const PoolIconStack: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 底层 */}
      <rect x="2" y="16" width="20" height="6" rx="1" stroke="currentColor" strokeWidth={sw} />
      
      {/* 中层 */}
      <rect x="4" y="10" width="16" height="6" rx="1" stroke="currentColor" strokeWidth={sw} />
      
      {/* 顶层 */}
      <rect x="6" y="4" width="12" height="6" rx="1" stroke="currentColor" strokeWidth={sw} />
      
      {/* 资源指示点 */}
      <circle cx="8" cy="7" r="1" fill="currentColor" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
      <circle cx="6" cy="13" r="1" fill="currentColor" />
      <circle cx="10" cy="13" r="1" fill="currentColor" />
      <circle cx="14" cy="13" r="1" fill="currentColor" />
      <circle cx="8" cy="19" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
      <circle cx="16" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}

// 8) Cluster：集群资源池，强调资源分布
const PoolIconCluster: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 中心容器 */}
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={sw} />
      
      {/* 卫星资源点 */}
      <circle cx="6" cy="8" r="2" stroke="currentColor" strokeWidth={sw} />
      <circle cx="18" cy="8" r="2" stroke="currentColor" strokeWidth={sw} />
      <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth={sw} />
      <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth={sw} />
      
      {/* 连接线 */}
      <path d="M12 12L6 8" stroke="currentColor" strokeWidth={sw} opacity="0.4" />
      <path d="M12 12L18 8" stroke="currentColor" strokeWidth={sw} opacity="0.4" />
      <path d="M12 12L6 16" stroke="currentColor" strokeWidth={sw} opacity="0.4" />
      <path d="M12 12L18 16" stroke="currentColor" strokeWidth={sw} opacity="0.4" />
      
      {/* 中心点 */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

// 9) Cylinder：圆柱体资源池，经典数据库风格
const PoolIconCylinder: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 顶部椭圆 */}
      <ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth={sw} />
      
      {/* 侧壁 */}
      <path d="M4 7v10" stroke="currentColor" strokeWidth={sw} />
      <path d="M20 7v10" stroke="currentColor" strokeWidth={sw} />
      
      {/* 底部椭圆 */}
      <ellipse cx="12" cy="17" rx="8" ry="3" stroke="currentColor" strokeWidth={sw} />
      
      {/* 资源指示线 */}
      <path d="M6 10h12" stroke="currentColor" strokeWidth={sw} opacity="0.6" />
      <path d="M6 14h12" stroke="currentColor" strokeWidth={sw} opacity="0.6" />
    </svg>
  )
}

// 10) Tray：托盘风格，强调"承载池"概念
const PoolIconTray: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 托盘主体 */}
      <rect x="4" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth={sw} />
      
      {/* 托盘底部 */}
      <path d="M6 16L8 18H16L18 16" stroke="currentColor" strokeWidth={sw} />
      
      {/* 资源点 */}
      <circle cx="8" cy="12" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <circle cx="16" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

// 11) Grid：网格版，池面 + 资源单元
const PoolIconGrid: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => {
  const sw = Math.max(1, (24 / size) * strokeWidth)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 容器边界 */}
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={sw} />
      
      {/* 网格线 */}
      <path d="M12 4V20" stroke="currentColor" strokeWidth={sw} opacity="0.3" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth={sw} opacity="0.3" />
      
      {/* 资源单元 */}
      <rect x="6" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="14" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="6" y="14" width="4" height="4" rx="0.5" fill="currentColor" />
      <rect x="14" y="14" width="4" height="4" rx="0.5" fill="currentColor" />
    </svg>
  )
}

// 12) Mini：极简版，只有三笔，12px 下清晰不糊
const PoolIconMini: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> = ({
  size = 12,
  strokeWidth = 1.5,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* 顶部水面 */}
      <ellipse cx="12" cy="7" rx="8" ry="3" />
      {/* 侧壁 */}
      <path d="M4 7v9M20 7v9" />
      {/* 底部承载弧 */}
      <path d="M4 16c0 2 3.6 3 8 3s8-1 8-3" />
    </g>
  </svg>
)

export default PoolIcon
