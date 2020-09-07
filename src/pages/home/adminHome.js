import React from 'react'
import './index.less'
import { Result,Icon} from 'antd';
import systemName from '../../config/systemName';

function onChange(a, b, c) {
    console.log(a, b, c);
}


export default class AdminHome extends React.Component {
    render() {
        return(
            <div className={"home-wrap"}>
                <Result icon={<Icon type={"smile"} theme={"twoTone"}/>} title={`管理员，你好！欢迎进入${systemName}。`} subTitle={"左侧是你的功能列表"}/>
            </div>
        )
    }
}
