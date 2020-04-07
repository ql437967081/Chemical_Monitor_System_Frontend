import React from 'react'
import {Row, Col, Layout} from 'antd'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProducerNav from '../../components/NavLeft/producerNav'
import '../../style/common.less'
export default class Producer extends React.Component{

    render(){
        return(
            <Row className="container">
                <Col span={3} className="nav-left">
                    <ProducerNav/>
                </Col>
                <Col span={21} className="main">
                    <Header/>
                    <Row className="content">
                        <div id={"container"}>
                            {this.props.children}
                        </div>
                    </Row>
                    <Footer/>
                </Col>
            </Row>
        );
    }
}
