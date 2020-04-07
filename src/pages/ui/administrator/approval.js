import React from "react";
import {Card, Divider, Table, Tabs, Tag} from "antd";
import './admin.css'
import '../../home/index.less'

const columns = [
    {
        title: '申请编号',
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
        <a>同意申请</a>
        <Divider type="vertical" />
        <a>拒绝申请</a>
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

class Approval extends React.Component{
    render() {
        return(
            <div>
                <Card title={"申请审批列表"} style={{minHeight:"600px"}} headStyle={{textAlign:"center",fontWeight:"bolder",fontSize:"24px"}}>
                    <Table columns={columns} dataSource={data} tableLayout={"fixed"} />
                </Card>
            </div>
        )
    }
}

export default  Approval