import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    ReactFlowProvider,
    ReactFlow,
    addEdge,
    Panel,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, Button, Space, Modal, Form, Input, Select, Checkbox, Divider, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';

// 导入自定义节点和边
import { TextUpdaterNode, LogoNode, BaseNode, ImgNode } from './components/Nodes';
import { CustomEdge } from './components/Edges';
import { fetchMindMapById, updateMindMap } from '../../api/MindMap.js'; // 导入 API 函数

// 注册自定义节点类型
const nodeTypes = {
    textUpdater: TextUpdaterNode,
    logo: LogoNode,
    base: BaseNode,
    image: ImgNode,
};

// 注册自定义边类型
const edgeTypes = {
    custom: CustomEdge,
};

// 初始节点和边
const initialNodes = [];
const initialEdges = [];

const FlowEditor = () => {
    const { id } = useParams(); // 从路由获取 ID
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [nodeModalVisible, setNodeModalVisible] = useState(false);
    const [edgeModalVisible, setEdgeModalVisible] = useState(false);
    const [nodeForm] = Form.useForm();
    const [edgeForm] = Form.useForm();
    const [title, setTitle] = useState(''); // 标题
    const [description, setDescription] = useState(''); // 描述
    const nodeIdCounter = useRef(1);

    // 获取数据库信息并填充到表单
    useEffect(() => {
        const fetchData = async () => {
            try {
                const mindMapData = await fetchMindMapById(id);
                console.log('MindMap Data:', mindMapData)
                if (mindMapData.data) {
                    const { title, summary, data } = mindMapData.data;
                    setTitle(title || '');
                    setDescription(summary || '');

                    const parsedData = JSON.parse(data);
                    setNodes(parsedData.nodes || []);
                    setEdges(parsedData.edges || []);
                }
            } catch (error) {
                message.error('加载知识地图失败，请检查 ID', error);
            }
        };

        fetchData();
    }, [id]);

    const saveFlow = async () => {
        const mindMapData = {
            title: title,
            summary: description,
            data: JSON.stringify({ nodes, edges }),
        };

        try {
            await updateMindMap(mindMapData, id); // 更新数据库
            message.success('知识地图已保存');
        } catch (error) {
            message.error('保存知识地图失败，请重试',error);
        }
    };

    const leadingOut = () => {
        const flow = { nodes, edges };
        const json = JSON.stringify(flow);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flow.json';
        link.click();
        message.success('知识地图已导出');
    };


    const loadFlow = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const flow = JSON.parse(e.target.result);
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                message.success('知识地图已加载');
            } catch (error) {
                message.error('加载知识地图失败，请检查文件格式', error);
            }
        };
        reader.readAsText(file);
    };

    const onConnect = useCallback((params) => {
        const newEdge = {
            ...params,
            type: 'custom',
            data: { label: '连接' }
        };
        setEdges((eds) => addEdge(newEdge, eds));
    }, [setEdges]);

    const addNode = (values) => {
        const newId = `${nodeIdCounter.current}`;
        nodeIdCounter.current += 1;

        const newNode = {
            id: newId,
            type: values.nodeType,
            position: { x: 100, y: 100 },
            data: {
                id: `node${newId}`,
                text: values.text,
                iconType: values.iconType === 'none' ? undefined : values.iconType,
                link: values.link,
                src: values.src,
                value: values.text,
                noHandle: values.noHandle,
            },
        };

        setNodes((nds) => [...nds, newNode]);
        setNodeModalVisible(false);
        nodeForm.resetFields();
        message.success('节点已添加');
    };

    const updateNode = (values) => {
        if (!selectedNode) return;

        setNodes((nds) => nds.map((node) => {
            if (node.id === selectedNode.id) {
                return {
                    ...node,
                    type: values.nodeType,
                    data: {
                        ...node.data,
                        text: values.text,
                        iconType: values.iconType === 'none' ? undefined : values.iconType,
                        link: values.link,
                        src: values.src,
                        value: values.text,
                        noHandle: values.noHandle,
                    },
                };
            }
            return node;
        }));

        setNodeModalVisible(false);
        setSelectedNode(null);
        message.success('节点已更新');
    };

    const deleteNode = () => {
        if (!selectedNode) return;

        setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
        setEdges((eds) => eds.filter(
            (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
        ));

        setSelectedNode(null);
        message.success('节点已删除');
    };

    const updateEdge = (values) => {
        if (!selectedEdge) return;

        setEdges((eds) => eds.map((edge) => {
            if (edge.id === selectedEdge.id) {
                return {
                    ...edge,
                    data: {
                        ...edge.data,
                        label: values.label,
                        showLabel: values.showLabel,
                    },
                };
            }
            return edge;
        }));

        setEdgeModalVisible(false);
        setSelectedEdge(null);
        message.success('连接线已更新');
    };

    const deleteEdge = () => {
        if (!selectedEdge) return;

        setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
        setSelectedEdge(null);
        message.success('连接线已删除');
    };

    // 左键单击事件（选中边）
    const onEdgeClick = (event, edge) => {
        setSelectedEdge(edge);
        setSelectedNode(null);
    };

    // 右键单击事件（打开边编辑模态框）
    const onEdgeContextMenu = (event, edge) => {
        event.preventDefault(); // 阻止默认右键菜单
        setSelectedEdge(edge);

        edgeForm.setFieldsValue({
            label: edge.data?.label || '',
            showLabel: edge.data?.showLabel || false,
        });

        setEdgeModalVisible(true);
    };

    const onNodeContextMenu = (event, node) => {
        event.preventDefault(); // 阻止默认右键菜单
        setSelectedNode(node);

        nodeForm.setFieldsValue({
            nodeType: node.type,
            text: node.data.text || node.data.value || '',
            iconType: node.data.iconType || 'l1',
            buttonType: node.data.type || 'default',
            link: node.data.link || '',
            src: node.data.src || '',
            noHandle: node.data.noHandle || false,
        });

        setNodeModalVisible(true);
    };

    const onNodeClick = (event, node) => {
        if (node.data.link) {
            window.open(node.data.link, '_blank');
        }
    };

    const onPaneClick = () => {
        setSelectedNode(null);
        setSelectedEdge(null);
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onNodeClick={onNodeClick}
                    onNodeContextMenu={onNodeContextMenu}
                    onEdgeClick={onEdgeClick}
                    onEdgeContextMenu={onEdgeContextMenu}
                    onPaneClick={onPaneClick}
                    fitView
                >
                    <Background />
                    <Controls />

                    <Panel position="top-right">
                        <Card title="知识地图工具" style={{ width: 300 }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    placeholder="标题"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <Input.TextArea
                                    placeholder="描述"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                />
                                <Button type="primary" onClick={saveFlow}>
                                    提交
                                </Button>
                                <Divider />
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            nodeForm.resetFields();
                                            setSelectedNode(null);
                                            setNodeModalVisible(true);
                                        }}
                                    >
                                        添加节点
                                    </Button>
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        disabled={!selectedNode && !selectedEdge}
                                        onClick={() => {
                                            if (selectedNode) deleteNode();
                                            if (selectedEdge) deleteEdge();
                                        }}
                                    >
                                        删除选中
                                    </Button>
                                </Space>
                                <Divider />
                                <Space>
                                    <Button icon={<SaveOutlined />} onClick={leadingOut}>
                                        导出数据
                                    </Button>
                                    <Button icon={<UploadOutlined />} onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.json';
                                        input.onchange = loadFlow;
                                        input.click();
                                    }}>
                                        加载数据
                                    </Button>
                                </Space>
                            </Space>
                        </Card>
                    </Panel>
                </ReactFlow>
            </ReactFlowProvider>

            {/* 节点编辑模态框 */}
            <Modal
                title={selectedNode ? "编辑节点" : "添加节点"}
                open={nodeModalVisible}
                onCancel={() => setNodeModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setNodeModalVisible(false)}>
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => nodeForm.submit()}
                    >
                        确定
                    </Button>,
                ]}
            >
                <Form
                    form={nodeForm}
                    layout="vertical"
                    onFinish={selectedNode ? updateNode : addNode}
                    initialValues={{
                        nodeType: 'base',
                        iconType: 'l1',
                        buttonType: 'default',
                        noHandle: false,
                    }}
                >
                    <Form.Item
                        name="nodeType"
                        label="节点类型"
                        rules={[{ required: true, message: '请选择节点类型' }]}
                    >
                        <Select>
                            <Select.Option value="base">基础节点</Select.Option>
                            <Select.Option value="textUpdater">文本节点</Select.Option>
                            <Select.Option value="logo">Logo节点</Select.Option>
                            <Select.Option value="image">图像节点</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="text"
                        label="文本内容"
                        rules={[{ required: true, message: '请输入文本内容' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.nodeType !== currentValues.nodeType
                        }
                    >
                        {({ getFieldValue }) => {
                            const nodeType = getFieldValue('nodeType');

                            return (
                                <>
                                    {nodeType === 'base' && (
                                        <>
                                            <Form.Item name="iconType" label="图标类型">
                                                <Select>
                                                    <Select.Option value="none">无</Select.Option>
                                                    <Select.Option value="l1">分组图标</Select.Option>
                                                    <Select.Option value="l2">服务器图标</Select.Option>
                                                    <Select.Option value="l3">全局图标</Select.Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item name="buttonType" label="按钮类型">
                                                <Select>
                                                    <Select.Option value="default">默认</Select.Option>
                                                    <Select.Option value="primary">主要</Select.Option>
                                                    <Select.Option value="dashed">虚线</Select.Option>
                                                    <Select.Option value="danger">危险</Select.Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item name="link" label="链接地址">
                                                <Input placeholder="选填，例如：https://example.com" />
                                            </Form.Item>

                                            <Form.Item name="noHandle" valuePropName="checked">
                                                <Checkbox>隐藏连接点</Checkbox>
                                            </Form.Item>
                                        </>
                                    )}

                                    {(nodeType === 'logo' || nodeType === 'image') && (
                                        <Form.Item
                                            name="src"
                                            label="图片地址"
                                            rules={[{ required: true, message: '请输入图片地址' }]}
                                        >
                                            <Input placeholder="例如：https://example.com/logo.png" />
                                        </Form.Item>
                                    )}
                                </>
                            );
                        }}
                    </Form.Item>
                </Form>
            </Modal>

            {/* 边编辑模态框 */}
            <Modal
                title="编辑连接线"
                open={edgeModalVisible}
                onCancel={() => setEdgeModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setEdgeModalVisible(false)}>
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => edgeForm.submit()}
                    >
                        确定
                    </Button>,
                ]}
            >
                <Form
                    form={edgeForm}
                    layout="vertical"
                    onFinish={updateEdge}
                >
                    <Form.Item
                        name="showLabel"
                        valuePropName="checked"
                    >
                        <Checkbox>显示标签</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="label"
                        label="标签文本"
                        rules={[{ required: true, message: '请输入标签文本' }]}
                    >
                        <Input placeholder="连接线标签文本，例如：持续升级" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FlowEditor;
