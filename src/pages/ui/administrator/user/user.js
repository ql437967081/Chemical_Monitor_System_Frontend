import React from "react";
import {Button, Card, Divider, Icon, message, Popconfirm, Table} from "antd";
import {get, post, checkTokenExpiration} from "../../../../request";
import {backend_url} from "../../../../config/httpRequest1";
import {withRouter} from "react-router";
import UserModal from "./modal";

const baseUrl = backend_url + 'user/';

const USER_TYPE = [ null, '操作员', '管理员', '监控员' ];

class User extends React.Component{
    state = {
        userList: [],
        additionModalVisible: false,
        editionModalVisible: false,
        editingUser: null,
        confirmLoading: false
    };

    componentDidMount() {
        this.refreshUserList();
    }

    refreshUserList = () => {
        /*
        axios({
            method: 'get',
            url: baseUrl
        }).then(function (res) {
            const userList = [];
            for (let userVO of res.data.data) {
                const { userId, name, password, type } = userVO;
                userList.push({ userId, name, password, type: USER_TYPE[type], key: userId });
            }
            this.setState({ userList })
        }.bind(this)).catch(function (err) {
            console.log(err)
        });

         */
        //*
        get(baseUrl).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            const userList = [];
            for (let userVO of res.data) {
                const { userId, name, password, type, enable } = userVO;
                if (enable === 1)
                    userList.push({ userId, name, password, type: USER_TYPE[type], key: userId });
            }
            this.setState({ userList })
        }.bind(this)).catch(function (err) {
            console.log(err);
        });

         //*/
    };

    showAdditionModal = () => {
        this.setState({ additionModalVisible: true });
    };

    add = user => {
        this.setState({ confirmLoading: true });
        console.log(user);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'register',
            data: user
        }).then(function (res) {
            console.log(res.data);
            message.success('用户增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshUserList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        //*
        post(baseUrl + 'register', user).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('用户增加成功');
            this.setState({ confirmLoading: false, additionModalVisible: false });
            this.refreshUserList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });

         //*/
    };

    showEditionModal = user => {
        console.log(user);
        this.setState({ editionModalVisible: true, editingUser: user });
    };

    edit = user => {
        this.setState({ confirmLoading: true });
        const { editingUser } = this.state;
        user['userId'] = editingUser['userId'];
        console.log(user);
        /*
        axios({
            method: 'post',
            url: baseUrl + 'update_user',
            data: user
        }).then(function (res) {
            console.log(res.data);
            message.success('用户修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingUser: null });
            this.refreshUserList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
            this.setState({ confirmLoading: false });
        }.bind(this));

         */
        //*
        post(baseUrl + 'update_user', user).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('用户修改成功');
            this.setState({ confirmLoading: false, editionModalVisible: false, editingUser: null });
            this.refreshUserList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });

         //*/
    };

    delete = userId => {
        /*
        axios({
            method: 'post',
            url: baseUrl + 'delete_user/' + userId,
        }).then(function (res) {
            console.log(res.data);
            message.success('用户删除成功');
            this.refreshUserList();
        }.bind(this)).catch(function (err) {
            console.log(err);
            message.error('服务器繁忙，请稍后重试');
        });

         */
        //*
        post(baseUrl + 'delete_user/' + userId, undefined).then(function (res) {
            if (checkTokenExpiration(res, this.props.history))
                return;
            console.log(res.data);
            message.success('用户删除成功');
            this.refreshUserList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });

         //*/
    };

    render() {
        const { userList,
            additionModalVisible,
            editionModalVisible,
            editingUser,
            confirmLoading
        } = this.state;

        const columns = [
            {
                title: '用户编号',
                dataIndex: 'userId',
                key: 'userId'
            },
            {
                title: '用户名',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '密码',
                dataIndex: 'password',
                key: 'password'
            },
            {
                title: '用户类型',
                dataIndex: 'type',
                key: 'type'
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
                        </span>
                    );
                }
            }
        ];

        return (
            <div>
                <Card title={'用户信息管理'}>
                    <span>
                        <Button onClick={this.showAdditionModal}><Icon type="plus" />新增</Button>
                    </span>
                    <br/><br/>
                    <Table columns={columns} dataSource={userList} />
                </Card>
                { additionModalVisible ? (
                    <UserModal
                        title={'新增用户'}
                        edit={false}
                        handleCancel={() => this.setState({ additionModalVisible: false })}
                        handleOk={this.add}
                        confirmLoading={confirmLoading}
                    />
                ) : null }
                { editionModalVisible ? (
                    <UserModal
                        title={'编辑用户'}
                        edit={true}
                        {...editingUser}
                        handleCancel={() => this.setState({ editionModalVisible: false })}
                        handleOk={this.edit}
                        confirmLoading={confirmLoading}
                    />
                ) : null }
            </div>
        );
    }
}

export default withRouter(User);
