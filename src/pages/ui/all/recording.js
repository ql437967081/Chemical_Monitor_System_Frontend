import React from 'react'
import {Card,Button,Table,Select,Form,Input,DatePicker} from 'antd'
import RecordingTable from '../../table/recordingTable'
const FormItem = Form.Item;
const  Option  = Select.Option;
const Search = Input.Search;
export default class Recording extends React.Component{
    render(){
        return(
            <div>
                <Card title="发货记录" className="recording">
                    <FilterForm/>
                    <RecordingTable/>
                </Card>
            </div>
        )
    }
}

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="订单时间">
                    {
                        getFieldDecorator('pro_time')(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )
                    }
                </FormItem>
               
                <FormItem label="产品名称">
                    {
                        getFieldDecorator('element_id')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="1">产品1</Option>
                                <Option value="2">产品2</Option>
                                <Option value="3">产品3</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Search placeholder="请输入uid" enterButton="Search"  onSearch={value => console.log(value)} />
                </FormItem>
                
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);