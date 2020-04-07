import React from 'react'
import {Card,Select,Form,Input,DatePicker} from 'antd'
import RecordingTable from '../../table/recordingTable'
const FormItem = Form.Item;
const  Option  = Select.Option;
const Search = Input.Search;
export default class Remind extends React.Component{
    render(){
        return(
            <div>
                <Card title="最新异动信息" className="remind">
                   
                    <RecordingTable/>
                </Card>
            </div>
        )
    }
}
