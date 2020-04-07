import React from 'react'
import {Card,Button,Table,Select,Form,Input} from 'antd'
import './ui.less'
import ManageTable from '../../table/manageTable'
const FormItem = Form.Item;
const  Option  = Select.Option;
const Search = Input.Search;
export default class Manage extends React.Component{
    
    render(){
        
        return(
            <div>
                 <Card title="产品管理">
                    <FilterForm/>
                </Card>
                <Card>
                    <ManageTable/>
                </Card>
            </div>
        )
    }
}


class FilterForm extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
        this.handleClickBtn=this.handleClickBtn.bind(this);
    }
    handleClickBtn=()=>{
        window.location.href='/#/producer/manage/changePro'
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="元素">
                    {
                        getFieldDecorator('element_id')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="1">钾</Option>
                                <Option value="2">Ca</Option>
                                <Option value="3">Na</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Search placeholder="输入产品名称" enterButton="Search" /**点击search返回的是元素和产品名称两部分的内容 */ onSearch={value => console.log(value)} />
                    
                </FormItem>
                <FormItem>
                    <Button icon="plus" onClick={this.handleClickBtn}>创建新产品</Button>
                </FormItem>
                
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);