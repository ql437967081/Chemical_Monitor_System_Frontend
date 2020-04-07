import React from "react";
import {Button, Card, Divider, Icon, Input, message, Popconfirm, Table} from "antd";
import {checkTokenExpiration, get, post} from "../../../../request";
import {backend_url} from "../../../../config/httpRequest1";
import {withRouter} from "react-router";
import StoreModal from "./modal";
import {Link} from "react-router-dom";

const { Search } = Input;

const baseUrl = backend_url + 'store/';

class Store extends React.Component{

    constructor(props) {
        super(props);
        const eid = props.location.state ? props.location.state.eid : undefined;
        this.state = {
            storeList: [],
            additionModalVisible: false,
            editionModalVisible: false,
            editingStore: null,
            confirmLoading: false,
            searchLoading: false
        };
        if (eid) {
            this.state['eid'] = eid;
        }
    }

    componentDidMount() {
        const { eid } = this.state;
        if (eid)
            this.searchByEnterprise(eid);
        else
            this.refreshStoreList();
    }

    refreshStoreList = () => {
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl
        }).then(function (res) {
            const storeList = [];
            for (let storeVO of res.data) {
                const { storeId, name, enterpriseId } = storeVO;
                storeList.push({ storeId, name, enterpriseId, key: storeId });
            }
            this.setState({ storeList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const storeList = [];
            for (let storeVO of res.data) {
                const { storeId, name, enterpriseId, enable } = storeVO;
                if (enable === 1)
                    storeList.push({ storeId, name, enterpriseId, key: storeId });
            }
            this.setState({ storeList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    };

    showAdditionModal = () => {
        this.setState({ additionModalVisible: true });
    };

    add = store => {
        this.setState({ confirmLoading: true });
        console.log(store);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'add_store',
            data: store
        }).then(function (res) {
            console.log(res.data);
            message.success('仓库增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshStoreList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        post(baseUrl + 'add_store', store).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('仓库增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshStoreList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    showEditionModal = store => {
        console.log(store);
        this.setState({ editionModalVisible: true, editingStore: store });
    };

    edit = store => {
        this.setState({ confirmLoading: true });
        const { editingStore } = this.state;
        store['storeId'] = editingStore['storeId'];
        console.log(store);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'update_store',
            data: store
        }).then(function (res) {
            console.log(res.data);
            message.success('仓库修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingStore: null });
            this.refreshStoreList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        post(baseUrl + 'update_store', store).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('仓库修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingStore: null });
            this.refreshStoreList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    delete = storeId => {
        /*
        axios({
            method: 'post',
            url: baseUrl + 'delete_store/' + storeId,
        }).then(function (res) {
            console.log(res.data);
            message.success('仓库删除成功');
            this.refreshStoreList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
        });

         */
        post(baseUrl + 'delete_store/' + storeId, undefined).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('仓库删除成功');
            this.refreshStoreList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    search = s => {
        if (s.length === 0) {
            this.refreshStoreList();
            return;
        }
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl + 'search_store/' + s
        }).then(function (res) {
            const storeList = [];
            for (let storeVO of res.data.data) {
                const { storeId, name, enterpriseId } = storeVO;
                storeList.push({ storeId, name, enterpriseId, key: storeId });
            }
            this.setState({ storeList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl + 'search_store/' + s).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const storeList = [];
            for (let storeVO of res.data) {
                const { storeId, name, enterpriseId, enable } = storeVO;
                if (enable === 1)
                    storeList.push({ storeId, name, enterpriseId, key: storeId });
            }
            this.setState({ storeList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    };

    searchByEnterprise = eid => {
        if (eid.length === 0) {
            this.refreshStoreList();
            return;
        }
        if (!/^\d+$/.test(eid)) {
            message.error('请输入正确的企业代号');
            return;
        }
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl + 'search_store_by_enterprise/' + eid
        }).then(function (res) {
            const storeList = [];
            for (let storeVO of res.data.data) {
                const { storeId, name, enterpriseId } = storeVO;
                storeList.push({ storeId, name, enterpriseId, key: storeId });
            }
            this.setState({ storeList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl + 'search_store_by_enterprise/' + eid).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const storeList = [];
            for (let storeVO of res.data) {
                const { storeId, name, enterpriseId, enable } = storeVO;
                if (enable === 1)
                    storeList.push({ storeId, name, enterpriseId, key: storeId });
            }
            this.setState({ storeList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });
    };

    render() {
        const { storeList,
            additionModalVisible,
            editionModalVisible,
            editingStore,
            confirmLoading,
            searchLoading,
            eid
        } = this.state;

        const columns = [
            {
                title: '仓库id',
                dataIndex: 'storeId',
                key: 'storeId'
            },
            {
                title: '仓库名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '所属企业代号',
                key: 'enterpriseId',
                render: text =>
                    <Link to={{ pathname: '/admin/enterprise', state: { searchText: text.enterpriseId } }} replace>
                        {text.enterpriseId}
                    </Link>
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) =>
                    <span>
                        <a onClick={() => this.showEditionModal(record)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确认删除?" onConfirm={() => this.delete(record.key)}>
                            <a>删除</a>
                        </Popconfirm>
                    </span>
            }
        ];

        return (
            <div>
                <Card title={'仓库信息管理'}>
                    <span>
                        <Search
                            placeholder="输入内容搜索仓库"
                            onSearch={value => this.search(value)}
                            style={{ width: 400 }}
                            loading={searchLoading}
                            enterButton
                        />
                        <Search
                            placeholder="输入企业代号查看其所有仓库"
                            onSearch={value => this.searchByEnterprise(value)}
                            defaultValue={eid}
                            style={{ width: 300 }}
                            loading={searchLoading}
                            enterButton
                        />
                        <Button onClick={this.showAdditionModal}><Icon type="plus" />新增</Button>
                    </span>
                    <br/><br/>
                    <Table columns={columns} dataSource={storeList} />
                </Card>
                { additionModalVisible ? (
                    <StoreModal
                        title={'新增仓库'}
                        edit={false}
                        handleCancel={() => this.setState({ additionModalVisible: false })}
                        handleOk={this.add}
                        confirmLoading={confirmLoading}
                        getHistory={() => this.props.history}
                    />
                ) : null }
                { editionModalVisible ? (
                    <StoreModal
                        title={'编辑仓库'}
                        edit={true}
                        {...editingStore}
                        handleCancel={() => this.setState({ editionModalVisible: false })}
                        handleOk={this.edit}
                        confirmLoading={confirmLoading}
                        getHistory={() => this.props.history}
                    />
                ) : null }
            </div>
        );
    }
}

export default withRouter(Store);
