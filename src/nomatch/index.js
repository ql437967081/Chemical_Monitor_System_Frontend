import React from 'react'
import {Card, Empty} from 'antd';

export default class NoMatch extends React.Component{
    render(){
        return(
            <div style={{textAlign:'center',fontSize:'24'}}>
                <Card>
                    {<Empty />}
                    请求的页面不存在，请检查地址重新输入
                </Card>
            </div>
        )
    }
}