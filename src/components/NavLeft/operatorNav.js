import React from 'react'
import Menuconfig from '../../config/operatorMenu'
import {Menu,Icon} from 'antd';
import './index.less'
import {NavLink} from 'react-router-dom'
import systemName from '../../config/systemName';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class OperatorNav extends React.Component{

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
                    {this.state.menuTreeNode}

                </Menu>
            </div>
        )
    }
}
