import React from 'react';
import {Card,Table} from 'antd';
export default class RemindTable extends React.Component{

    state ={
        dataSource2:[],
    }
    
    componentDidMount(){
        const data =[
            {
                uid:'1231',
                proName:'产品1',
                producater:'田伟男',
                date:'2019-12-18',
                batch:'1',
                number:'-100',
                pos:'南京',
                time:'2019-12-19',
                remark:'a'
            },
            
            

            

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
                title:'uid',
                dataIndex:'uid'
            },
            {
                title:'产品名称',
                dataIndex:'proName'
            },
            {
                title:'生产商',
                dataIndex:'producer'
            },
            {
                title:'发货日期',
                dataIndex:'date'
            },
            {
                title:'批次',
                dataIndex:'batch'
            },
            {
                title:'数量变化',
                dataIndex:'number'
            },
            {
                title:'发生地点',
                dataIndex:'pos'
            },
            {
                title:'时间',
                dataIndex:'time'
            },
            {
                title:'备注',
                dataIndex:'remark'
            }
        ]
        return(
            <div>
                <Card style={{margin:'10px 0'}}>
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
