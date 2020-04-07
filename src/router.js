import React from 'react'
import {HashRouter,Route,Switch} from 'react-router-dom'
import Admin from './pages/user/admin'
import Login from "./pages/Login/Login";
import NoMatch from './nomatch'
import AdminHome from './pages/home/adminHome'
import StoreKeeperHome from "./pages/home/storeKeeperHome";
import ProducerHome from "./pages/home/producerHome";
import Manage from './pages/ui/producer/manage'
import SendManage from './pages/ui/producer/sendManage'
import Recording from './pages/ui/all/recording'
import ChangePro from './pages/ui/producer/changePro'
import ChangeInfo from './pages/ui/changeInfo'
import Receipt from './pages/ui/all/receipt'
import Sending from './pages/ui/business/sending'
import Remind from './pages/ui/administrator/remind'
import {createBrowserHistory} from 'history'
import Monitor_sankey from "./pages/ui/administrator/monitor_sankey";
import Monitor_tree from "./pages/ui/administrator/monitor_tree";
import proScene from "./pages/ui/producer/proScene";
import Producer from "./pages/user/producer";
import StoreKeeper from "./pages/user/storeKeeper";
import StockIn from "./pages/ui/storeKeeper/stockIn";
import StockOut from "./pages/ui/storeKeeper/stockOut";
import OutZone from "./pages/ui/storeKeeper/outZone";
import Approval from "./pages/ui/administrator/approval";
import Operate from "./pages/ui/administrator/operate";
import Entity from "./pages/ui/administrator/entity";
import Enterprise from "./pages/ui/administrator/enterprise/enterprise";
import ProductionLine from "./pages/ui/administrator/production_line/production_line";
import Store from "./pages/ui/administrator/store/store";
import User from "./pages/ui/administrator/user/user";
import Operator from "./pages/user/operator";
import OperatorHome from "./pages/home/operatorHome";
import InPark from "./pages/ui/launcher/inPark";
import OutPark from "./pages/ui/operator/outPark";
import Destroy from "./pages/ui/operator/destroy";
import RawOut from "./pages/ui/operator/rawOut";
import ProductIn from "./pages/ui/operator/productIn";
import ExpressOut from "./pages/ui/operator/expressOut";
import ExpressIn from "./pages/ui/operator/expressIn";
import LaunchOutPark from "./pages/ui/launcher/launchOutPark";
import LaunchDestroy from "./pages/ui/launcher/launchDestroy";
import LaunchProduction from "./pages/ui/launcher/launchProduction";
import ProductionBatchOut from "./pages/ui/launcher/productionBatchOut";
import LaunchExpress from "./pages/ui/launcher/launchExpress";
import CancelExpress from "./pages/ui/launcher/cancelExpress"
import Monitor from "./pages/user/monitor";
import MonitorHome from "./pages/home/monitorHome";
import BatchInfo from "./pages/ui/monitor/batchInfo";
import Throughput from "./pages/ui/monitor/throughput/throughput";
import AuthRouter from "./AuthRouter";


//send是生产商，sending是商家
export default class IRouter extends React.Component{

    render(){
        return(
            <HashRouter history={createBrowserHistory()}>
                <Route path="/" render={()=>
                        <Switch>
                            <Route path="/" component={Login} exact/>
                            <Route path="/login" component={Login}/>
                            <Route path="/admin" render={()=>
                                <Admin>
                                    <Switch>
                                        <AuthRouter exact path="/admin" component={AdminHome} loginRole='admin'/>
                                        <AuthRouter path="/admin/home" component={AdminHome} loginRole='admin' />
                                        <AuthRouter path="/admin/enterprise" component={Enterprise} loginRole='admin' />
                                        <AuthRouter path="/admin/production_line" component={ProductionLine} loginRole='admin' />
                                        <AuthRouter path="/admin/store" component={Store} loginRole='admin' />
                                        <AuthRouter path="/admin/user" component={User} loginRole='admin' />
                                        <Route path="/admin/entity" component={Entity} />
                                        <Route path="/admin/approval" component={Approval} />
                                        <Route path="/admin/operate" component={Operate} />
                                        <Route path="/admin/recording" component={Recording} />
                                        <Route path="/admin/remind" component={Remind} />
                                        <Route path="/admin/monitor_sankey" component={Monitor_sankey} />
                                        <Route path="/admin/monitor_tree" component={Monitor_tree} />
                                        <Route path="/admin/changeInfo" component={ChangeInfo} />
                                        <Route component={NoMatch} />
                                    </Switch>
                                </Admin>
                            }/>
                            <Route path="/monitor" render={()=>
                                <Monitor>
                                    <Switch>
                                        <AuthRouter exact path="/monitor" component={MonitorHome} loginRole='monitor' />
                                        <AuthRouter path="/monitor/home" component={MonitorHome} loginRole='monitor' />
                                        <AuthRouter path="/monitor/batch_info" component={BatchInfo} loginRole='monitor' />
                                        <AuthRouter path="/monitor/throughput" component={Throughput} loginRole='monitor' />
                                        <AuthRouter component={NoMatch} loginRole='monitor' />
                                    </Switch>
                                </Monitor>
                            }/>
                            <Route path="/producer" render={()=>
                                <Producer>
                                    <Switch>
                                        <Route path="/producer" component={ProducerHome} exact/>
                                        <Route path="/producer/home" component={ProducerHome} />
                                        <Route path="/producer/proScene" component={proScene} />
                                        <Route path="/producer/manage" render={()=>
                                            <Switch>
                                                <Route path="/producer/manage" component={Manage} exact/>
                                                <Route path="/producer/manage/changePro" component={ChangePro} />
                                                <Route component={NoMatch} />
                                            </Switch>
                                        }/>
                                        <Route path="/producer/send" component={SendManage} />
                                        <Route path="/producer/recording" component={Recording} />
                                        <Route path="/producer/changeInfo" component={ChangeInfo} />
                                        <Route component={NoMatch} />
                                    </Switch>
                                </Producer>
                            } />
                            <Route path="/storekeeper" render={()=>
                                <StoreKeeper>
                                    <Switch>
                                        <Route path="/storeKeeper" component={StoreKeeperHome} exact/>
                                        <Route path="/storeKeeper/home" component={StoreKeeperHome} />
                                        <Route path="/storeKeeper/recording" component={Recording} />
                                        <Route path="/storeKeeper/stockIn" component={StockIn} />
                                        <Route path="/storeKeeper/stockOut" component={StockOut} />
                                        <Route path="/storeKeeper/receipt" component={Receipt}/>
                                        <Route path="/storeKeeper/sending" component={Sending} />
                                        <Route path="/storeKeeper/outZone" component={OutZone} />
                                        <Route path="/storeKeeper/changeInfo" component={ChangeInfo} />
                                        <Route component={NoMatch} />
                                    </Switch>
                                </StoreKeeper>
                            } />
                            <Route path="/operator" render={()=>
                                <Operator>
                                    <Switch>
                                        <AuthRouter path="/operator" component={OperatorHome} exact loginRole='operator'/>
                                        <AuthRouter path="/operator/home" component={OperatorHome} loginRole='operator' />
                                        <AuthRouter path="/operator/in_park" component={InPark} loginRole='operator' />
                                        <AuthRouter path="/operator/out_park" component={OutPark} loginRole='operator' />
                                        <AuthRouter path="/operator/destroy" component={Destroy} loginRole='operator' />
                                        <AuthRouter path="/operator/raw_out" component={RawOut} loginRole='operator' />
                                        <AuthRouter path="/operator/product_in" component={ProductIn} loginRole='operator' />
                                        <AuthRouter path="/operator/express_out" component={ExpressOut} loginRole='operator' />
                                        <AuthRouter path="/operator/express_in" component={ExpressIn} loginRole='operator' />
                                        <AuthRouter path="/operator/launch_out_park" component={LaunchOutPark} loginRole='operator' />
                                        <AuthRouter path="/operator/launch_destroy" component={LaunchDestroy} loginRole='operator' />
                                        <AuthRouter path="/operator/launch_production" component={LaunchProduction} loginRole='operator' />
                                        <AuthRouter path="/operator/production_batch_out" component={ProductionBatchOut} loginRole='operator' />
                                        <AuthRouter path="/operator/launch_express" component={LaunchExpress} loginRole='operator' />
                                        <AuthRouter path="/operator/cancel_express" component={CancelExpress} loginRole='operator' />
                                        <AuthRouter component={NoMatch} loginRole='operator' />
                                    </Switch>
                                </Operator>
                            }/>
                            <Route component={NoMatch} />
                        </Switch>
                }/>
            </HashRouter>
        );
    }
}
