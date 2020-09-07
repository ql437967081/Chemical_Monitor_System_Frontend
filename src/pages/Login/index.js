import React from 'react'
import {Card,Form, Input,Button,message,Icon, Checkbox} from "antd";
import "./Login.css"
import {withRouter} from 'react-router'
import {post} from "../../request";
import {USER_ROLE} from "../../config/userRole";
import {backend_url} from "../../config/httpRequest1";
import systemName from '../../config/systemName';

const FormItem = Form.Item;

const baseUrl = backend_url + 'user/login';

class Index extends React.Component{

    handleSubmit = () =>{
        let history = this.props.history;
        let userInfo = this.props.form.getFieldsValue();
        this.props.form.validateFields((err,values)=>{
            const { userName, userPwd } = userInfo;
            if (!err) {
                post(baseUrl,
                    {name: userName, password: userPwd}).then(function (res) {
                    console.log(res);
                    const { userId, type, name } = res.data;
                    const loginRole = USER_ROLE[type];
                    sessionStorage.setItem('loginRole', loginRole);
                    sessionStorage.setItem('loginId', userId);
                    sessionStorage.setItem('loginName', name);
                    message.success(`欢迎${name}进入${systemName}`);
                    history.push(`/${loginRole}`);
                }).catch(function (err) {
                    console.log(err);
                    console.log(err.response);
                    message.error('用户名或密码错误！');
                })
            }
            /*
            if((!err)&&(userInfo.userName==='admin')&&(userInfo.userPwd==='123456')) {
                sessionStorage.setItem('loginRole', 'admin');
                message.success(`欢迎${userInfo.userName}进入危害化学品追踪系统`);
                history.push('/admin',{username:'admin'});
            }else if ((!err) && (userInfo.userName === 'producer') && (userInfo.userPwd === '123456')) {
                message.success(`欢迎${userInfo.userName}进入危害化学品追踪系统`);
                history.push('/producer');
            }else if ((!err) && (userInfo.userName === 'storekeeper') && (userInfo.userPwd === '123456')) {
                message.success(`欢迎${userInfo.userName}进入危害化学品追踪系统`);
                history.push('/storekeeper');
            }else if ((!err) && (userInfo.userName === 'operator') && (userInfo.userPwd === '123456')) {
                sessionStorage.setItem('loginRole', 'operator');
                message.success(`欢迎${userInfo.userName}进入危害化学品追踪系统`);
                history.push('/operator', {username:'operator'});
            }else if ((!err) && (userInfo.userName === 'monitor') && (userInfo.userPwd === '123456')) {
                sessionStorage.setItem('loginRole', 'monitor');
                message.success(`欢迎${userInfo.userName}进入危害化学品追踪系统`);
                history.push('/monitor', {username:'monitor'});
            }
            else{
                message.error('您输入的账号信息有误，请重新输入')
            }

             */
       });
    };


    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <div className={"layout1"}>
                <Card className={"layout3"} title="登录界面">
                    <Form style={{width:320}} onSubmit={this.handleSubmit}>
                        <FormItem>
                            {
                                getFieldDecorator('userName',{
                                    initialValue:'',
                                    rules:[
                                        {
                                            required:true,
                                            message:'用户名不可为空'
                                        }
                                    ]
                                })(
                                <Input prefix={<Icon type="user"/>} placeholder="请输入用户名(admin/storekeeper/producer/operator)" />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('userPwd',{
                                    initialValue:'',
                                    rules:[{
                                        required:true,
                                        message:'密码不可为空'
                                    }]
                                })(
                                    <Input prefix={<Icon type="lock"/>} placeholder="请输入密码(123456)"/>
                                )
                            }

                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('remember',{
                                    valuePropName:'checked',
                                    initialValue:true,
                                })(
                                    <Checkbox style={{float:'left'}}>记住密码</Checkbox>
                                )
                            }
                            <a href="#" style={{float:'right'}}>忘记密码</a>
                        </FormItem>
                        <FormItem>
                            <Button className={"layout2"} type="primary" htmlType={"submit"} >登录</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    };
}
export default withRouter(Form.create()(Index));
