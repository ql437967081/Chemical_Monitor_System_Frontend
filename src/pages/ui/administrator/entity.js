import React from "react";
import {Button, Card, Col, Divider, Form, Icon, Input, message, Modal, Popconfirm, Row, Select, Table, Tabs, Tag} from "antd";
import './admin.css'
import '../../home/index.less'
import {withRouter} from "react-router";
import axios from "axios"
import {backend_url} from '../../../config/httpRequest'

const { Option } = Select;

const Search = Input.Search;

const data = [
    {
        name: '企业A',
        number: 'ZX1997',
        kind: '企业',
        description:'这是企业A  const data'
    },
    {
        name: '企业B',
        number: 'SQ1996',
        kind: '企业',
        description:'这是企业B'
    },
    {
        name: '设施a',
        number: 'DW1998',
        kind: '设施',
        description:'这是设施a'
    },{
        name: '设施b',
        number: 'ZX1997',
        kind: '设施',
        description:'这是设施b'
    }
];

const baseUrl = backend_url + 'entity/'

class Entity extends React.Component{
    state = {
        additionVisible: false,
        additionConfirmLoading: false,
        tableData: data
    };

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '实体id',
                dataIndex: 'number',
                key: 'number',
            },{
                title: '实体名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '实体类型',
                dataIndex: 'kind',
                key: 'kind',
            },
            {
                title: '实体描述',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
        <a>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record.number)}>
              <a>删除</a>
        </Popconfirm>
      </span>
                ),
            },
        ];
    }

    showAdditionModel = () => {
        this.setState({
            additionVisible: true,
        });
    };

    handleAdditionOk = () => {
        let newEntity = this.props.form.getFieldsValue();
        let checkRes = true;
        this.props.form.validateFields((err,values)=> {
            if (err) {
                checkRes = false;
                message.error('您输入的实体信息有误，请重新输入')
            }
        });
        if (!checkRes)
            return;
        this.setState({
            additionConfirmLoading: true
        });
        axios({
            method: 'post',
            url: baseUrl,
            data: newEntity
        }).then(function (res) {
            if (res.data === true) {
                message.success('添加成功')
            }
            else {
                message.error('添加失败，请稍后重试')
            }
            this.acquireTableData();
            this.setState({
                additionVisible: false,
                additionConfirmLoading: false
            })
        }.bind(this)).catch(function (err) {
            console.log(err)
        })
    };

    handleAdditionCancel = () => {
        this.setState({
            additionVisible: false,
        });
    };

    handleDelete (number) {
        axios({
            method: 'delete',
            url: baseUrl + number
        }).then(function (res) {
            if (res.data === true) {
                message.info('删除成功')
            }
            else {
                message.error('删除失败，请稍后重试')
            }
            this.acquireTableData()
        }.bind(this)).catch(function (err) {
            console.log(err)
        })
    }

    componentDidMount() {
        this.acquireTableData()
    }

    acquireTableData() {
        axios({
            method: 'get',
            url: baseUrl
        }).then(function (res) {
            this.setState({
                tableData: res.data
            })
        }.bind(this)).catch(function (err) {
            console.log(err)
        })
    }

    searchTableData (value, event) {
        message.info('查找' + value)
        axios({
            method: 'get',
            url: baseUrl + 'search/' + value
        }).then(function (res) {
            this.setState({
                tableData: res.data
            })
        }.bind(this)).catch(function (err) {
            console.log(err)
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };

        return(
            <div>
                <Card title={"实体信息管理"} headStyle={{fontWeight:"bolder",fontSize:"24px"}} bodyStyle={{backgroundColor:"#fafafa"}}>
                    <Form layout={"inline"}>
                        <Form.Item label={"请输入实体的id或名称"}>
                            <Search placeholder='支持模糊查找' onSearch={this.searchTableData.bind(this)}/>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.showAdditionModel}><Icon type="plus" />新增</Button>
                        </Form.Item>
                    </Form>
                </Card>
                <br />
                <Table columns={this.columns} dataSource={this.state.tableData} tableLayout={"fixed"} style={{maxHeight:'100px'}}/>
                <Modal
                    title="新增实体"
                    visible={this.state.additionVisible}
                    onOk={this.handleAdditionOk}
                    onCancel={this.handleAdditionCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="实体id">
                            {getFieldDecorator('number', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入实体id!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="实体名称">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入实体名称!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="实体种类">
                            {getFieldDecorator('kind', {
                                initialValue: '企业',
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(
                                <Select style={{ width: 70 }}>
                                    <Option value="企业">企业</Option>
                                    <Option value="设施">设施</Option>
                                </Select>
                            )
                            }
                        </Form.Item>
                        <Form.Item label="实体描述">
                            {getFieldDecorator('description', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入实体描述!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default withRouter(Form.create()(Entity));
