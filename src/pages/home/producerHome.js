import React from 'react'
import './index.less'
import { Icon, Result} from 'antd';


export default class ProducerHome extends React.Component{
    render(){
        return(
            <div className="home-wrap">
                <Result icon={<Icon type={"smile"}theme={"twoTone"}/>} title={"生产人员，你好！欢迎进入危害化学品追踪系统。"} subTitle={"左侧是你的功能列表，你也可以在右上角修改你的个人信息"}/>
            </div>
        )
    }
}