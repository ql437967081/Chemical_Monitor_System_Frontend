import React from "react";
import {withRouter} from "react-router";
import {Card} from "antd";
import QueryConditionForm from "./query_condition_form";
import ThroughputTable from "./throughput_table";

class Throughput extends React.Component{

    state = {
        primaryQueryRequest: { entityType: -1, entityId: 0, timeType: -1, start: null, end: null, casId: 0 },  // 原始查询条件
        queryRequest: null,
        throughputVO: null
    };

    onCompleteUnnecessaryToQuery = queryRequest => {
        this.setState({ queryRequest });
    };

    onQueryComplete = (queryRequest, throughputVO) => {
        this.setState({ primaryQueryRequest: queryRequest, queryRequest, throughputVO });
    };

    render() {
        const { primaryQueryRequest, queryRequest, throughputVO } = this.state;
        let throughput = null;
        const casDict = {};
        if (throughputVO) {
            let { times, consume, produce, out } = throughputVO;
            let _in = throughputVO['in'];

            const timeRangerEqual = primaryQueryRequest['start'] === queryRequest['start']
                && primaryQueryRequest['end'] === queryRequest['end'];
            const casEqual = primaryQueryRequest['casId'] === queryRequest['casId'];

            if (!casEqual) {
                const filterCAS = casThroughput => casThroughput['casId'] === queryRequest['casId'];
                consume = consume.filter(filterCAS);
                produce = produce.filter(filterCAS);
                _in = _in.filter(filterCAS);
                out = out.filter(filterCAS);

            }
            if (!timeRangerEqual) {
                let startIndex, endIndex;
                for (let i = 0; i < times.length; i++) {
                    if (times[i] === queryRequest['start'])
                        startIndex = i;
                    if (times[i] === queryRequest['end'])
                        endIndex = i;
                }
                const filterRanger = (x, index) => startIndex <= index && index <= endIndex;
                const getFractionDigits = x => {
                    const fractionPart = x.toString().split('.')[1];
                    return fractionPart ? fractionPart.length : 0;
                };
                const filterCASRanger = casThroughput => {
                    const { casId, name, throughput, total } = casThroughput;
                    let toSubtract = 0;
                    let fractionDigits = getFractionDigits(total);
                    for (let i = 0; i < startIndex; i++) {
                        toSubtract += throughput[i];
                        fractionDigits = Math.max(fractionDigits, getFractionDigits(throughput[i]));
                    }
                    for (let i = endIndex + 1; i < throughput.length; i++) {
                        toSubtract += throughput[i];
                        fractionDigits = Math.max(fractionDigits, getFractionDigits(throughput[i]));
                    }
                    return { casId, name, throughput: throughput.filter(filterRanger), total: (total - toSubtract).toFixed(fractionDigits) };
                };
                const filterCASRangerList = casThroughputList =>
                    casThroughputList.map(casThroughput => filterCASRanger(casThroughput))
                        .filter(casThroughput => casThroughput['total'] > 0);

                times = times.filter(filterRanger);
                consume = filterCASRangerList(consume);
                produce = filterCASRangerList(produce);
                _in = filterCASRangerList(_in);
                out = filterCASRangerList(out);
            }

            throughput = { times, consume, produce, in: _in, out };

            const collectCAS = casThroughputList => casThroughputList.forEach(casThroughput => {
                const { casId, name } = casThroughput;
                casDict[casId] = name;
            });
            collectCAS(consume); collectCAS(produce); collectCAS(_in); collectCAS(out);
        }

        return (
            <Card title={'吞吐量查询'}>
                <QueryConditionForm {...primaryQueryRequest}
                                    onComplete={this.onQueryComplete}
                                    onUnnecessary={this.onCompleteUnnecessaryToQuery}
                                    getCASDict={() => casDict}
                                    getHistory={() => this.props.history}
                />
                <br />
                { throughputVO ? (
                    <ThroughputTable {...queryRequest} getThroughput={() => throughput} />
                ) : null}
            </Card>
        );
    }
}

export default withRouter(Throughput);
