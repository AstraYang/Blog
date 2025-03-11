// NodeShapes.jsx
import React from 'react';
import { Handle } from 'react-flow-renderer';

// 圆形节点组件
export const CircleNode = ({ data }) => {
    return (
        <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: data.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            position: 'relative',
            cursor: 'move'
        }}>
            {data.label}
            <Handle type="source" position="right" />
            <Handle type="target" position="left" />
        </div>
    );
};

// 矩形节点可以使用默认节点
// 所以这里不需要再定义矩形节点
