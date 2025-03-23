// CustomEdge.js
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
} from '@xyflow/react';
import { Tag } from 'antd';
import PropTypes from "prop-types";
import './CustomEdge.css'; // 引入样式文件

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    // 根据data中的属性设置样式
    const lineType = data.lineType || 'solid'; // 默认为实线
    const lineColor = data.lineColor || '#555'; // 默认颜色
    const isFlowing = data.flowing || false; // 是否流动效果

    // 构建className
    const edgeClassName = `custom-edge ${lineType} ${isFlowing ? 'flowing' : ''}`;

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                className={edgeClassName}
                style={{ stroke: lineColor }} // 直接设置颜色
            />
            <EdgeLabelRenderer>
                {data.showLabel && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <Tag color={data.tagColor || "volcano"}>{data.label}</Tag>
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
}

// 添加 PropTypes 验证
CustomEdge.propTypes = {
    id: PropTypes.string.isRequired,
    sourceX: PropTypes.number.isRequired,
    sourceY: PropTypes.number.isRequired,
    targetX: PropTypes.number.isRequired,
    targetY: PropTypes.number.isRequired,
    data: PropTypes.shape({
        showLabel: PropTypes.bool,
        label: PropTypes.string,
        lineType: PropTypes.string, // 线条类型：solid, dashed
        lineColor: PropTypes.string, // 线条颜色
        flowing: PropTypes.bool, // 是否流动
        tagColor: PropTypes.string, // 标签颜色
    }).isRequired,
};

export {
    CustomEdge,
}
