import React from 'react'
import Menuconfig from '../../config/producerMenu'
import {Menu,Icon} from 'antd';
import './index.less'
import {NavLink} from 'react-router-dom'
import systemName from '../../config/systemName';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class ProducerNav extends React.Component{

    componentWillMount(){
        const menuTreeNode = this.renderMenu(Menuconfig);
        this.setState({
            menuTreeNode
        })
    }
    //菜单渲染
    renderMenu=(data)=>{
        return data.map((item)=>{
            if(item.children){
                return (
                    <SubMenu title={item.title} key={item.key}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }
    render(){
        return(
            <div>
                <div className="logo">
                    <h1>{systemName}</h1>
                </div>
                <Menu theme="dark">
                    {/* <SubMenu key="sub1" title={<span> <Icon type="appstore" /> <span>产品管理</span> </span>}></SubMenu>
                    <SubMenu key="sub2" title={<span> <Icon type="appstore" /> <span>发货</span> </span>}></SubMenu>
                    <SubMenu key="sub3" title={<span> <Icon type="appstore" /> <span>发货记录</span> </span>}></SubMenu> */}
                    {this.state.menuTreeNode}

                </Menu>
            </div>
        )
    }
}
