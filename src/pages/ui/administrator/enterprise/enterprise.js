import React from "react";
import {Button, Card, Divider, Icon, Input, message, Popconfirm, Table} from "antd";
import {checkTokenExpiration, get, post} from "../../../../request";
import {backend_url} from "../../../../config/httpRequest1";
import {withRouter} from "react-router";
import EnterpriseModal from "./modal";
import {Link} from "react-router-dom";
const { Search } = Input;

const baseUrl = backend_url + 'enterprise/';

class Enterprise extends React.Component{

    constructor(props) {
        super(props);
        const searchText = props.location.state ? props.location.state.searchText : undefined;
        this.state = {
            enterpriseList: [],
            additionModalVisible: false,
            editionModalVisible: false,
            editingEnterprise: null,
            confirmLoading: false,
            searchLoading: false
        };
        if (searchText) {
            this.state['searchText'] = searchText;
        }
    }

    componentDidMount() {
        const { searchText } = this.state;
        if (searchText)
            this.search(searchText);
        else
            this.refreshEnterpriseList();
    }

    refreshEnterpriseList = () => {
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl
        }).then(function (res) {
            const enterpriseList = [];
            for (let enterpriseVO of res.data.data) {
                const { enterpriseId, name } = enterpriseVO;
                enterpriseList.push({ enterpriseId, name, key: enterpriseId });
            }
            this.setState({ enterpriseList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const enterpriseList = [];
            for (let enterpriseVO of res.data) {
                const { enterpriseId, name, enable } = enterpriseVO;
                if (enable === 1)
                    enterpriseList.push({ enterpriseId, name, key: enterpriseId });
            }
            this.setState({ enterpriseList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    showAdditionModal = () => {
        this.setState({ additionModalVisible: true });
    };

    add = enterprise => {
        this.setState({ confirmLoading: true });
        console.log(enterprise);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'add_enterprise',
            data: enterprise
        }).then(function (res) {
            console.log(res.data);
            message.success('企业增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshEnterpriseList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        post(baseUrl + 'add_enterprise', enterprise).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('企业增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshEnterpriseList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    showEditionModal = enterprise => {
        console.log(enterprise);
        this.setState({ editionModalVisible: true, editingEnterprise: enterprise });
    };

    edit = enterprise => {
        this.setState({ confirmLoading: true });
        const { editingEnterprise } = this.state;
        enterprise['enterpriseId'] = editingEnterprise['enterpriseId'];
        console.log(enterprise);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'update_enterprise',
            data: enterprise
        }).then(function (res) {
            console.log(res.data);
            message.success('企业修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingEnterprise: null });
            this.refreshEnterpriseList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        post(baseUrl + 'update_enterprise', enterprise).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('企业修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingEnterprise: null });
            this.refreshEnterpriseList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    delete = enterpriseId => {
        /*
        axios({
            method: 'post',
            url: baseUrl + 'delete_enterprise/' + enterpriseId,
        }).then(function (res) {
            console.log(res.data);
            message.success('企业删除成功');
            this.refreshEnterpriseList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
        });

         */
        post(baseUrl + 'delete_enterprise/' + enterpriseId, undefined).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('企业删除成功');
            this.refreshEnterpriseList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    search = s => {
        if (s.length === 0) {
            this.refreshEnterpriseList();
            return;
        }
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl + 'search_enterprise/' + s
        }).then(function (res) {
            const enterpriseList = [];
            for (let enterpriseVO of res.data.data) {
                const { enterpriseId, name } = enterpriseVO;
                enterpriseList.push({ enterpriseId, name, key: enterpriseId });
            }
            this.setState({ enterpriseList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl + 'search_enterprise/' + s).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const enterpriseList = [];
            for (let enterpriseVO of res.data) {
                const { enterpriseId, name, enable } = enterpriseVO;
                if (enable === 1)
                    enterpriseList.push({ enterpriseId, name, key: enterpriseId });
            }
            this.setState({ enterpriseList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    render() {
        const { enterpriseList,
            additionModalVisible,
            editionModalVisible,
            editingEnterprise,
            confirmLoading,
            searchLoading,
            searchText
        } = this.state;

        const columns = [
            {
                title: '企业代号',
                dataIndex: 'enterpriseId',
                key: 'enterpriseId'
            },
            {
                title: '企业名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={() => this.showEditionModal(record)}>编辑</a>
                            <Divider type="vertical" />
                            <Popconfirm title="确认删除?" onConfirm={() => this.delete(record.key)}>
                                <a>删除</a>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Link to={{ pathname: '/admin/production_line', state: { searchText: record.key } }} replace>
                                查看生产线
                            </Link>
                            <Divider type="vertical" />
                            <Link to={{ pathname: '/admin/store', state: { eid: record.key } }} replace>
                                查看仓库
                            </Link>
                        </span>
                    );
                }
            }
        ];

        return (
            <div>
                <Card title={'企业信息管理'}>
                    <span>
                        <Search
                            placeholder="输入内容搜索企业"
                            onSearch={value => this.search(value)}
                            defaultValue={searchText}
                            style={{ width: 400 }}
                            loading={searchLoading}
                            enterButton
                        />
                        <Button onClick={this.showAdditionModal}><Icon type="plus" />新增</Button>
                    </span>
                    <br/><br/>
                    <Table columns={columns} dataSource={enterpriseList} />
                </Card>
                { additionModalVisible ? (
                    <EnterpriseModal
                        title={'新增企业'}
                        edit={false}
                        handleCancel={() => this.setState({ additionModalVisible: false })}
                        handleOk={this.add}
                        confirmLoading={confirmLoading}
                    />
                    ) : null }
                { editionModalVisible ? (
                    <EnterpriseModal
                        title={'编辑企业'}
                        edit={true}
                        {...editingEnterprise}
                        handleCancel={() => this.setState({ editionModalVisible: false })}
                        handleOk={this.edit}
                        confirmLoading={confirmLoading}
                    />
                ) : null }
            </div>
        );
    }
}

export default withRouter(Enterprise);
