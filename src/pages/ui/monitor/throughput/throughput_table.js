import React from "react";
import { Table } from "antd";
import "./last_row_style.css"

const TIME_TYPES = [ '年份', '季度', '月份', '日期' ];

/*
entityType
0: consume + produce + in + out
1 or 2: consume + produce
3: in + out
 */

export default class ThroughputTable extends React.Component {

    productColumn = (casThroughput, columnIndex) => {
        const { casId, name } = casThroughput;
        return {
            title: name,
            dataIndex: columnIndex + casId,
            key: columnIndex + casId
        }
    };

    productsColumn = (casThroughputList, columnName, columnIndex) => {
        return casThroughputList.length > 0 ? {
            title: columnName,
            children: casThroughputList.map(casThroughput => this.productColumn(casThroughput, columnIndex))
        } : null;
    };

    parkColumns = throughput => {
        const { out } = throughput;
        const _in = throughput['in'];
        return this.consumeAndProduceColumns(throughput).concat([
            this.productsColumn(_in, '入园', 'in'),
            this.productsColumn(out, '出园', 'out')
        ])
    };

    consumeAndProduceColumns = throughput => {
        const { consume, produce } = throughput;
        return [
            this.productsColumn(consume, '消耗', 'consume'),
            this.productsColumn(produce, '产出', 'produce')
        ]
    };

    storeColumns = throughput => {
        const { out } = throughput;
        const _in = throughput['in'];
        return [
            this.productsColumn(_in, '入库', 'in'),
            this.productsColumn(out, '出库', 'out')
        ]
    };

    addProductData = (data, casThroughput, columnIndex) => {
        const { casId, total, throughput } = casThroughput;
        const len = throughput.length;
        for (let i = 0; i < len; i++) {
            data[i][columnIndex + casId] = throughput[i];
        }
        data[len][columnIndex + casId] = total;
    };

    addProductsData = (data, casThroughputList, columnIndex) => {
        for (let casThroughput of casThroughputList) {
            this.addProductData(data, casThroughput, columnIndex);
        }
    };

    render() {
        const { entityType, timeType, getThroughput } = this.props;
        const throughput = getThroughput();
        let throughputColumns = [];
        switch (entityType) {
            case 0:
                throughputColumns = this.parkColumns(throughput);
                break;
            case 1:
            case 2:
                throughputColumns = this.consumeAndProduceColumns(throughput);
                break;
            case 3:
                throughputColumns = this.storeColumns(throughput);
                break;
            default:
                break;
        }
        const columns = [
            {
                title: TIME_TYPES[timeType],
                dataIndex: 'time',
                key: 'time',
                width: 120,
                fixed: 'left'
            },
            {
                title: '吞吐量',
                children: throughputColumns.filter(productsColumn => productsColumn)
            }
        ];
        console.log(columns);

        const { times, consume, produce, out } = throughput;
        const _in = throughput['in'];
        const len = times.length;

        const data = [];
        for (let i = 0; i < len; i++) {
            data.push({ key: i, time: times[i] });
        }
        data.push({ key: len, time: '总计' });

        this.addProductsData(data, consume, 'consume');
        this.addProductsData(data, produce, 'produce');
        this.addProductsData(data, _in, 'in');
        this.addProductsData(data, out, 'out');

        console.log(data);

        return (
            <Table
                columns={columns}
                dataSource={data}
                bordered
                scroll={{x: true}}
                rowClassName={record => record.key === len ? 'lastRowStyle' : ''}
            />
        );
    }
}
