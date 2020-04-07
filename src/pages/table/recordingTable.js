import React from 'react';
import {Card,Table} from 'antd';
export default class ManageTable extends React.Component{

    state ={
        dataSource2:[],
    }
    
    componentDidMount(){
        const data =[
            {
                id:'0',
                uid:'1231',
                proName:'产品1',
                proNum:'4',
                date:'2019-12-18',
                pos:'南京',
                batch:'1',
                traNum:'A123'
            },
            {
                id:'0',
                uid:'1231',
                proName:'产品1',
                proNum:'4',
                date:'2019-12-18',
                pos:'南京',
                batch:'1',
                traNum:'A123'
            },
            {
                id:'0',
                uid:'1231',
                proName:'产品1',
                proNum:'4',
                date:'2019-12-18',
                pos:'南京',
                batch:'1',
                traNum:'A123'
            }

            

        ]
        this.setState({
            dataSource2:data
        })
        // this.request();
    }
    //动态获取数据
    // request=()=>{
    //     let baseUrl='//地址'
    //     axios.get(baseUrl+'/table/list').then((res)=>{
    //         if(res.status=='200' &&res.data.code==0){
    //             this.setState({
    //                 dataSource2:res.data.result
    //             })
    //         }
    //     })
    // }
    render(){
        const columns = [
            {
                title:'序号',
                dataIndex:'id'
            },
            {
                title:'uid',
                dataIndex:'uid'
            },
            {
                title:'产品名称',
                dataIndex:'proName'
            },
            {
                title:'数量',
                dataIndex:'proNum'
            },
            {
                title:'发货日期',
                dataIndex:'date'
            },
            {
                title:'目的地',
                dataIndex:'pos'
            },
            {
                title:'批次',
                dataIndex:'batch'
            },
            {
                title:'快递单号',
                dataIndex:'traNum'
            }
        ]
        return(
            <div>
                <Card title="发货记录表" style={{margin:'10px 0'}}>
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource2}
                        pagination={this.state.pagination}
                    />
                </Card>
            </div>
        );
    }
}
