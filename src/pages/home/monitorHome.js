import React from 'react'
import './index.less'
import { Icon, Result} from 'antd';
import systemName from '../../config/systemName';


export default class MonitorHome extends React.Component{
    render(){
        return(
            <div className="home-wrap">
                <Result icon={<Icon type={"smile"} theme={"twoTone"}/>} title={`监控员，你好！欢迎进入${systemName}。`} subTitle={"左侧是你的功能列表，你也可以在右上角修改你的个人信息"}/>
            </div>
        )
    }
}
