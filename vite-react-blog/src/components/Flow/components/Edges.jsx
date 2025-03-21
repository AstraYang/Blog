// CustomEdge.js
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
} from '@xyflow/react';
import { Tag } from 'antd';
import PropTypes from "prop-types";

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                {data.showLabel && ( // 根据数据决定是否显示标签
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                        onClick={() => {
                            // You can define any action on label click
                        }}
                    >
                        <Tag color="volcano">{data.label}</Tag>
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
}
// 添加 PropTypes 验证
CustomEdge.propTypes = {
    id: PropTypes.string.isRequired, // 必填，字符串类型
    sourceX: PropTypes.number.isRequired, // 必填，数字类型
    sourceY: PropTypes.number.isRequired, // 必填，数字类型
    targetX: PropTypes.number.isRequired, // 必填，数字类型
    targetY: PropTypes.number.isRequired, // 必填，数字类型
    data: PropTypes.shape({ // 定义 data 的结构
        showLabel: PropTypes.bool, // 可选，布尔类型
        label: PropTypes.string, // 可选，字符串类型
    }).isRequired,
};
export {
    CustomEdge,
}
