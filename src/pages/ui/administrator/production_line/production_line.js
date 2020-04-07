import React from "react";
import {Button, Card, Divider, Icon, Input, message, Popconfirm, Table} from "antd";
import {checkTokenExpiration, get, post} from "../../../../request";
import {backend_url} from "../../../../config/httpRequest1";
import {withRouter} from "react-router";
import ProductionLineModal from "./modal";
import {Link} from "react-router-dom";

const { Search } = Input;

const baseUrl = backend_url + 'production_line/';

class ProductionLine extends React.Component{

    constructor(props) {
        super(props);
        const searchText = props.location.state ? props.location.state.searchText : undefined;
        this.state = {
            productionLineList: [],
            additionModalVisible: false,
            editionModalVisible: false,
            editingProductionLine: null,
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
            this.refreshProductionLineList();
    }

    refreshProductionLineList = () => {
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl
        }).then(function (res) {
            const productionLineList = [];
            for (let productionLineVO of res.data.data) {
                const { enterpriseId, productionLineId } = productionLineVO;
                productionLineList.push({ enterpriseId, productionLineId, key: productionLineId });
            }
            this.setState({ productionLineList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const productionLineList = [];
            for (let productionLineVO of res.data) {
                const { enterpriseId, productionLineId, enable } = productionLineVO;
                if (enable === 1)
                    productionLineList.push({ enterpriseId, productionLineId, key: productionLineId });
            }
            this.setState({ productionLineList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    showAdditionModal = () => {
        this.setState({ additionModalVisible: true });
    };

    add = productionLine => {
        this.setState({ confirmLoading: true });
        console.log(productionLine);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'add_production_line',
            data: productionLine
        }).then(function (res) {
            console.log(res.data);
            message.success('生产线增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshProductionLineList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        post(baseUrl + 'add_production_line', productionLine).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('生产线增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshProductionLineList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    showEditionModal = productionLine => {
        console.log(productionLine);
        this.setState({ editionModalVisible: true, editingProductionLine: productionLine });
    };

    edit = productionLine => {
        this.setState({ confirmLoading: true });
        const { editingProductionLine } = this.state;
        productionLine['productionLineId'] = editingProductionLine['productionLineId'];
        console.log(productionLine);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'update_production_line',
            data: productionLine
        }).then(function (res) {
            console.log(res.data);
            message.success('生产线修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingProductionLine: null });
            this.refreshProductionLineList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        post(baseUrl + 'update_production_line', productionLine).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('生产线修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingProductionLine: null });
            this.refreshProductionLineList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    delete = productionLineId => {
        /*
        axios({
            method: 'post',
            url: baseUrl + 'delete_production_line/' + productionLineId,
        }).then(function (res) {
            console.log(res.data);
            message.success('生产线删除成功');
            this.refreshProductionLineList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
        });

         */
        post(baseUrl + 'delete_production_line/' + productionLineId, undefined).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('生产线删除成功');
            this.refreshProductionLineList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    search = s => {
        if (s.length === 0) {
            this.refreshProductionLineList();
            return;
        }
        if (!/^\d+$/.test(s)) {
            message.error('请输入正确的企业代号');
            return;
        }
        this.setState({ searchLoading: true });
        /*
        axios({
            method: 'get',
            url: baseUrl + 'search_production_line/' + s
        }).then(function (res) {
            const productionLineList = [];
            for (let productionLineVO of res.data.data) {
                const { enterpriseId, productionLineId } = productionLineVO;
                productionLineList.push({ enterpriseId, productionLineId, key: productionLineId });
            }
            this.setState({ productionLineList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        get(baseUrl + 'search_production_line/' + s).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const productionLineList = [];
            for (let productionLineVO of res.data) {
                const { enterpriseId, productionLineId, enable } = productionLineVO;
                if (enable)
                    productionLineList.push({ enterpriseId, productionLineId, key: productionLineId });
            }
            this.setState({ productionLineList, searchLoading: false })
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    };

    render() {
        const { productionLineList,
            additionModalVisible,
            editionModalVisible,
            editingProductionLine,
            confirmLoading,
            searchLoading,
            searchText
        } = this.state;

        const columns = [
            {
                title: '生产线id',
                dataIndex: 'productionLineId',
                key: 'productionLineId'
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
                <Card title={'生产线信息管理'}>
                    <span>
                        <Search
                            placeholder="输入企业代号查看其所有生产线"
                            onSearch={value => this.search(value)}
                            defaultValue={searchText}
                            style={{ width: 300 }}
                            loading={searchLoading}
                            enterButton
                        />
                        <Button onClick={this.showAdditionModal}><Icon type="plus" />新增</Button>
                    </span>
                    <br/><br/>
                    <Table columns={columns} dataSource={productionLineList} />
                </Card>
                { additionModalVisible ? (
                    <ProductionLineModal
                        title={'新增生产线'}
                        edit={false}
                        handleCancel={() => this.setState({ additionModalVisible: false })}
                        handleOk={this.add}
                        confirmLoading={confirmLoading}
                        getHistory={() => this.props.history}
                    />
                ) : null }
                { editionModalVisible ? (
                    <ProductionLineModal
                        title={'编辑生产线'}
                        edit={true}
                        {...editingProductionLine}
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

export default withRouter(ProductionLine);
