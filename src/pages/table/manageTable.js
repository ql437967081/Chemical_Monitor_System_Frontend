import React from 'react';
import {Card,Table} from 'antd';
import axios from 'axios'
import {Utils} from './../../utils/utils'
export default class ManageTable extends React.Component{

    state ={
        dataSource2:[]
    }
    
    componentDidMount(){
        const data =[
            {
                id:'0',
                proName:'产品1',
                element:'K'
            },
            {
                id:'1',
                proName:'产品2',
                element:'Ca'
            },
            {
                id:'1',
                proName:'产品2',
                element:'Ca'
            },
            {
                id:'1',
                proName:'产品2',
                element:'Ca'
            },
            {
                id:'1',
                proName:'产品2',
                element:'Ca'
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
    //     axios.get(地址).then((res)=>{
    //         if(res.status=='200' &&res.data.code==0这部分是判断是否请求成功){
    //             this.setState({
    //                 dataSource2:res.data.result获取结果值
    //             })
    //         }
    //     })
    // }
    render(){
        const columns = [
            {
                title:'id',
                dataIndex:'id'
            },
            {
                title:'产品名称',
                dataIndex:'proName'
            },
            {
                title:'元素',
                dataIndex:'element'
            },
        ]
        return(
            <div>
                <Card title="产品管理表" style={{margin:'10px 0'}}>
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
