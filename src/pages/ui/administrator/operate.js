import React from "react";
import {Button, Card, Col, Divider, Form, Icon, Input, message, Row, Table, Tabs, Tag} from "antd";
import './admin.css'
import '../../home/index.less'

const Search = Input.Search

const columns = [
    {
        title: '工号',
        dataIndex: 'number',
        key: 'number',
    },{
        title: '申请人',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href={'#/storekeeper'}>{text}</a>,
    },
    {
        title: '操作类型',
        dataIndex: 'kind',
        key: 'kind',
    },
    {
        title: 'RFID',
        dataIndex: 'rfid',
        key: 'rfid',
        render: text => <a href={'#'}>{text}</a>,
    },
    {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
            <span>
        <a>编辑</a>
        <Divider type="vertical" />
        <a>删除</a>
      </span>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John',
        number: 'ZX1997',
        kind: '入库',
        rfid:'RFID1'
    },
    {
        key: '2',
        name: 'Jim',
        number: 'SQ1996',
        kind: '出库',
        rfid:'RFID2'
    },
    {
        key: '3',
        name: 'Joe',
        number: 'DW1998',
        kind: '出园',
        rfid:'RFID3'
    },{
        key: '4',
        name: 'John',
        number: 'ZX1997',
        kind: '入库',
        rfid:'RFID1'
    },
    {
        key: '5',
        name: 'Jim',
        number: 'SQ1996',
        kind: '出库',
        rfid:'RFID2'
    },
    {
        key: '6',
        name: 'Joe',
        number: 'DW1998',
        kind: '出园',
        rfid:'RFID3'
    },{
        key: '7',
        name: 'Jim',
        number: 'SQ1996',
        kind: '出库',
        rfid:'RFID2'
    },
    {
        key: '8',
        name: 'Joe',
        number: 'DW1998',
        kind: '出园',
        rfid:'RFID3'
    },{
        key: '9',
        name: 'Jim',
        number: 'SQ1996',
        kind: '出库',
        rfid:'RFID2'
    },
    {
        key: '10',
        name: 'Joe',
        number: 'DW1998',
        kind: '出园',
        rfid:'RFID3'
    },{
        key: '8',
        name: 'Joe',
        number: 'DW1998',
        kind: '出园',
        rfid:'RFID3'
    },{
        key: '9',
        name: 'Jim',
        number: 'SQ1996',
        kind: '出库',
        rfid:'RFID2'
    },
    {
        key: '10',
        name: 'Joe',
        number: 'DW1998',
        kind: '出园',
        rfid:'RFID3'
    },
];

class Operate extends React.Component{

    render() {
        return(
            <div>
                <Card title={"产品信息管理"} headStyle={{fontWeight:"bolder",fontSize:"24px"}} bodyStyle={{backgroundColor:"#fafafa"}}>
                    <Form layout={"inline"}>
                        <Form.Item label={"请输入产品的RFID"}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type={"primary"}>查询</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button>重置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button>新增</Button>
                        </Form.Item>
                    </Form>
                </Card>
                <br />
                <Table columns={columns} dataSource={data} tableLayout={"fixed"} style={{maxHeight:'100px'}}/>
            </div>
        )
    }
}


export default  Operate