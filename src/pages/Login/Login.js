import React from "react";
import Index from "./index"
import "./Login.css"
import {Layout} from "antd";
import Footer from "../../components/Footer";


const {Content} = Layout

class Login extends React.Component{
    render() {
        return(
            <div>
                <Layout  className={"background"}>
                    <Content>
                    </Content>
                    <Content>
                        <Index />
                    </Content>
                    <Footer></Footer>
                </Layout>
            </div>
        )
    }
}

export default Login
