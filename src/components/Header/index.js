import React from 'react'
import { Row,Col } from 'antd'
import './index.less'
import Util from '../../utils/utils'
import {withRouter} from "react-router";
import {post, logout} from "../../request";
import {backend_url} from "../../config/httpRequest1";

const baseUrl = backend_url + 'user/logout';

class Header extends React.Component{
    constructor(props){
        super(props);
        this.changeInfo=this.changeInfo.bind(this);
    }
    changeInfo=()=>{
        window.location.href='#/admin/changeInfo'
    };
    componentWillMount(){
        this.setState({
            userName: sessionStorage.getItem('loginName')
        });
        setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)
    }
    render(){
        return(
            <div className="header">
                <Row span={24} className="header-top">
                    <span>欢迎，{this.state.userName}</span>
                    <a onClick={() => {
                        const { history } = this.props;
                        post(baseUrl,
                            undefined).then(function (res) {
                            console.log(res);
                            logout(history);
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }}>退出</a>
                </Row>
                <Row className="breadcrumb">
                    <Col span={4} className="breadcrumb-title">

                    </Col>
                    <Col span={20} className="weather">
                        <span className="date">{this.state.sysTime}</span>
                    </Col>
                </Row>
            </div>
        )
    }
}
//<span>欢迎，<a onClick={this.changeInfo}>{this.state.userName}</a></span>
export default withRouter(Header);
