import React, { useState } from 'react'
import PoolIcon from './PoolIcon'

// 简单的下拉菜单组件
const SimpleDropdown: React.FC<{
  options: Array<{ key: string; label: string; icon: React.ReactNode }>
  value: string
  onChange: (value: string) => void
  placeholder: string
}> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.key === value)

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '20%' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '120px'
        }}
      >
        {selectedOption ? (
          <>
            {selectedOption.icon}
            <span>{selectedOption.label}</span>
          </>
        ) : (
          <span>{placeholder}</span>
        )}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </button>
      
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            marginTop: '4px'
          }}
        >
          {options.map(option => (
            <div
              key={option.key}
              onClick={() => {
                onChange(option.key)
                setIsOpen(false)
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: option.key === value ? '#f0f0f0' : 'transparent',
                borderBottom: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = option.key === value ? '#f0f0f0' : 'transparent'
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 演示不同类型的 Pool Icon
const PoolIconDemo: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('mini')

  const iconTypes = [
    { key: 'simple', label: 'Simple - 极简版', icon: <PoolIcon type="simple" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'dots', label: 'Dots - 点状版', icon: <PoolIcon type="dots" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'circles', label: 'Circles - 圆形版', icon: <PoolIcon type="circles" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'squares', label: 'Squares - 方形版', icon: <PoolIcon type="squares" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'hexagons', label: 'Hexagons - 六边形版', icon: <PoolIcon type="hexagons" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'waves', label: 'Waves - 波浪版', icon: <PoolIcon type="waves" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'stack', label: 'Stack - 堆叠版', icon: <PoolIcon type="stack" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'cluster', label: 'Cluster - 集群版', icon: <PoolIcon type="cluster" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'cylinder', label: 'Cylinder - 圆柱体版', icon: <PoolIcon type="cylinder" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'tray', label: 'Tray - 托盘版', icon: <PoolIcon type="tray" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'grid', label: 'Grid - 网格版', icon: <PoolIcon type="grid" size={16} style={{ color: '#8c8c8c' }} /> },
    { key: 'mini', label: 'Mini - 极简三笔版', icon: <PoolIcon type="mini" size={16} style={{ color: '#8c8c8c' }} /> }
  ]

  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1']

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🎯 PoolIcon 组件演示</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
          简化、清晰的资源池图标组件集合，专为 12px 小尺寸优化设计
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 图标类型选择器 */}
        <div style={{
          background: 'white',
          padding: '20px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
            🎨 选择 Pool Icon 类型
          </h3>
          <SimpleDropdown
            options={iconTypes}
            value={selectedType}
            onChange={setSelectedType}
            placeholder="选择图标类型"
          />
        </div>

        {/* 不同尺寸展示 */}
        <div style={{
          background: 'white',
          padding: '20px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
            📏 不同尺寸展示
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
            {[12, 16, 24, 32].map((size) => (
              <div key={size} style={{
                textAlign: 'center',
                padding: '15px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: '#fafafa'
              }}>
                <div style={{ 
                  margin: '10px 0', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '40px' 
                }}>
                  <PoolIcon type={selectedType as any} size={size} />
                </div>
                <span style={{ fontWeight: 'bold' }}>{size}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* 不同颜色展示 */}
        <div style={{
          background: 'white',
          padding: '20px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
            🎨 不同颜色展示
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
            {colors.map((color) => (
              <div key={color} style={{
                textAlign: 'center',
                padding: '15px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: '#fafafa'
              }}>
                <div style={{ 
                  margin: '10px 0', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '40px' 
                }}>
                  <PoolIcon 
                    type={selectedType as any} 
                    size={24} 
                    color={color} 
                  />
                </div>
                <span style={{ color }}>{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 不同线宽展示 */}
        <div style={{
          background: 'white',
          padding: '20px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
            ✏️ 不同线宽展示
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
            {[0.5, 1, 1.5, 2, 2.5].map((strokeWidth) => (
              <div key={strokeWidth} style={{
                textAlign: 'center',
                padding: '15px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: '#fafafa'
              }}>
                <div style={{ 
                  margin: '10px 0', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '40px' 
                }}>
                  <PoolIcon 
                    type={selectedType as any} 
                    size={24} 
                    strokeWidth={strokeWidth}
                    color="#1890ff"
                  />
                </div>
                <span style={{ fontWeight: 'bold' }}>{strokeWidth}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div style={{
          background: 'white',
          padding: '20px',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '8px' }}>
            📚 使用说明
          </h3>
          <div style={{ background: '#f6f8fa', padding: '20px', borderRadius: '6px' }}>
            <p><strong>推荐使用：</strong> PoolIconSimple (极简版) - 12px 下清晰不糊、语义明确</p>
            <p><strong>图标类型：</strong> Simple、Dots、Circles、Squares、Hexagons、Waves、Stack、Cluster、Cylinder、Tray、Grid、Mini</p>
            <p><strong>线宽控制：</strong> 新增 strokeWidth 属性，可精确控制图标线条粗细</p>
            <p><strong>线宽优化：</strong> 使用 24/size 计算线宽，确保 12px 下为 1px，避免糊边</p>
            <p><strong>尺寸建议：</strong> 12px 最稳定，如需更挺拔可用 13px 或 14px</p>
            <p><strong>代码示例：</strong></p>
            <pre style={{ 
              background: '#f1f3f4', 
              padding: '16px', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px',
              margin: '16px 0 0 0'
            }}>
{`<PoolIcon
  type="simple"
  size={16}
  strokeWidth={1.5}
  style={{ marginRight: 8, color: '#8c8c8c' }}
/>`}
            </pre>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
              <strong>图标类型说明：</strong><br/>
              • <strong>Simple:</strong> 极简资源池，容器+资源点<br/>
              • <strong>Dots:</strong> 点状资源池，强调资源颗粒<br/>
              • <strong>Circles:</strong> 圆形资源池，强调资源聚合<br/>
              • <strong>Squares:</strong> 方形资源池，强调资源块<br/>
              • <strong>Hexagons:</strong> 六边形资源池，蜂窝结构<br/>
              • <strong>Waves:</strong> 波浪资源池，强调资源流动<br/>
              • <strong>Stack:</strong> 堆叠资源池，强调资源层次<br/>
              • <strong>Cluster:</strong> 集群资源池，强调资源分布<br/>
              • <strong>Cylinder:</strong> 圆柱体资源池，经典数据库风格<br/>
              • <strong>Tray:</strong> 托盘风格，强调承载池概念<br/>
              • <strong>Grid:</strong> 网格版，池面+资源单元<br/>
              • <strong>Mini:</strong> 极简三笔版，12px下清晰不糊
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolIconDemo
