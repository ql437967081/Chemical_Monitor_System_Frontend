import React from "react";
import {Button, DatePicker, Form, InputNumber, message, Select} from "antd";
import {checkTokenExpiration, post} from "../../../../request";
import {backend_url} from "../../../../config/httpRequest1";

import moment from "moment";
import "moment/locale/zh-cn";
import QuarterSelector from "./quarterSelector";
import ChemicalSearchInput from "../../all/chemical_search_input";
moment.locale('zh-cn');

const { MonthPicker } = DatePicker;
const { Option } = Select;

const baseUrl = backend_url + 'throughput/';

const ENTITY_TYPES = [ '园区', '企业', '生产线', '仓库' ];

const TIME_TYPES = [ '年', '季度', '月', '日' ];

const INITIAL_VALUES = [ undefined, { year: undefined, quarter: undefined }, undefined, undefined];

class QueryConditionForm extends React.Component{

    state = { queryLoading: false };

    checkEntityId = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        const entityType = getFieldValue('entityType');
        const entityName = ENTITY_TYPES[entityType];
        if ( value.length === 0 ) {
            return callback(`请输入${entityName}id`);
        }
        if (!/^\d+$/.test(value)) {
            return callback(`请输入正确的${entityName}id`);
        }
        callback();
    };

    yearFormItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const start = getFieldValue('start');
        const end = getFieldValue('end');
        const minYear = 2000;
        const maxYear = moment().year();

        const startOptions = [];
        const maxY = (end ? end : maxYear);
        for (let year = minYear; year <= maxY; year++) {
            startOptions.push(<Option value={year} key={year}>{year}</Option>)
        }

        const endOptions = [];
        for (let year = (start ? start: minYear); year <= maxYear; year++) {
            endOptions.push(<Option value={year} key={year}>{year}</Option>)
        }

        return [
            (
                <Form.Item key={0}>
                    {getFieldDecorator('start', {
                        rules: [{ required: true, message: '请选择开始年份！' }]
                    })(<Select style={{ width: 120 }} placeholder={'开始年份'} firstActiveValue={'' + maxY}>
                        {startOptions}
                    </Select>)}
                </Form.Item>
            ),
            (
                <Form.Item key={1}>
                    {getFieldDecorator('end', {
                        rules: [{ required: true, message: '请选择结束年份！' }]
                    })(<Select style={{ width: 120 }} placeholder={'结束年份'} firstActiveValue={'' + maxYear}>
                        {endOptions}
                    </Select>)}
                </Form.Item>
            )
        ];
    };

    quarterFormItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const start = getFieldValue('start');
        const end = getFieldValue('end');

        const minYear = 2000;
        const minQuarter = 1;
        const maxYear = moment().year();
        const maxQuarter = moment().quarter();

        let maxStartYear = maxYear, maxStartQuarter = maxQuarter;
        if (end) {
            const endYear = end.year;
            const endQuarter = end.quarter;
            if (endYear && endQuarter) {
                maxStartYear = endYear;
                maxStartQuarter = endQuarter;
            }
            if (endYear && !endQuarter) {
                if (endYear < maxYear) {
                    maxStartYear = endYear;
                    maxStartQuarter = 4;
                }
            }
            if (!endYear && endQuarter) {
                maxStartQuarter = Math.min(maxStartQuarter, endQuarter);
            }
        }

        let minEndYear = minYear, minEndQuarter = minQuarter;
        if (start) {
            const startYear = start.year;
            const startQuarter = start.quarter;
            if (startYear && startQuarter) {
                minEndYear = startYear;
                minEndQuarter = startQuarter;
            }
            if (startYear && !startQuarter) {
                minEndYear = startYear;
                minEndQuarter = 1;
            }
            if (!startYear && startQuarter) {
                minEndQuarter = Math.max(minEndQuarter, startQuarter);
            }
        }

        const checkStart = (rule, value, callback) => {
            const { year, quarter } = value;
            if (!year || !quarter) {
                return callback('请选择开始季度');
            }
            callback();
        };
        const checkEnd = (rule, value, callback) => {
            const { year, quarter } = value;
            if (!year || !quarter) {
                return callback('请选择结束季度');
            }
            callback();
        };

        return [
            (
                <Form.Item key={0} label={'开始季度'} style={{width: 250}}>
                    {getFieldDecorator('start', {
                        rules: [{ validator: checkStart }]
                    })(<QuarterSelector
                        minYear={minYear}
                        minQuarter={minQuarter}
                        maxYear={maxStartYear}
                        maxQuarter={maxStartQuarter}
                    />)}
                </Form.Item>
            ),
            (
                <Form.Item key={1} label={'结束季度'} style={{width: 250}}>
                    {getFieldDecorator('end', {
                        rules: [{ validator: checkEnd }]
                    })(<QuarterSelector
                        minYear={minEndYear}
                        minQuarter={minEndQuarter}
                        maxYear={maxYear}
                        maxQuarter={maxQuarter}
                    />)}
                </Form.Item>
            )
        ];
    };

    monthFormItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const disabledStartAndEnd = (start, end) => {
            return start.startOf('month').valueOf() > end.startOf('month').valueOf();
        };
        const disabledStart = start => {
            if (!start)
                return false;
            if (disabledStartAndEnd(start, moment()))
                return true;
            const end = getFieldValue('end');
            if (!end)
                return false;
            return disabledStartAndEnd(start, end);
        };
        const disabledEnd = end => {
            if (!end)
                return false;
            if (disabledStartAndEnd(end, moment()))
                return true;
            const start = getFieldValue('start');
            if (!start)
                return false;
            return disabledStartAndEnd(start, end);
        };
        return [
            (
                <Form.Item key={0}>
                    {getFieldDecorator('start', {
                        rules: [{ type: 'object', required: true, message: '请选择开始月份!'}]
                    })(<MonthPicker placeholder={'开始月份'} disabledDate={disabledStart} />)}
                </Form.Item>
            ),
            (
                <Form.Item key={1}>
                    {getFieldDecorator('end', {
                        rules: [{ type: 'object', required: true, message: '请选择结束月份!'}]
                    })(<MonthPicker placeholder={'结束月份'} disabledDate={disabledEnd} />)}
                </Form.Item>
            )
        ];
    };

    dateFormItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const disabledStartAndEnd = (start, end) => {
            return start.startOf('day').valueOf() > end.startOf('day').valueOf();
        };
        const disabledStart = start => {
            if (!start)
                return false;
            if (disabledStartAndEnd(start, moment()))
                return true;
            const end = getFieldValue('end');
            if (!end)
                return false;
            return disabledStartAndEnd(start, end);
        };
        const disabledEnd = end => {
            if (!end)
                return false;
            if (disabledStartAndEnd(end, moment()))
                return true;
            const start = getFieldValue('start');
            if (!start)
                return false;
            return disabledStartAndEnd(start, end);
        };
        return [
            (
                <Form.Item key={0}>
                    {getFieldDecorator('start', {
                        rules: [{ type: 'object', required: true, message: '请选择开始日期!'}]
                    })(<DatePicker placeholder={'开始日期'} disabledDate={disabledStart} />)}
                </Form.Item>
            ),
            (
                <Form.Item key={1}>
                    {getFieldDecorator('end', {
                        rules: [{ type: 'object', required: true, message: '请选择结束日期!'}]
                    })(<DatePicker placeholder={'结束日期'} disabledDate={disabledEnd} />)}
                </Form.Item>
            )
        ];
    };

    casFormItem = () => {
        const { getFieldDecorator } = this.props.form;
        const { getCASDict, getHistory } = this.props;
        const casDict = getCASDict();
        return (
            <Form.Item label={'查询产品'}>
                {getFieldDecorator('casId', {
                    initialValue: undefined,
                })(<ChemicalSearchInput
                    placeholder={'查询所有产品'}
                    style={{ width: 200 }}
                    getInitialCasList={() => casDict}
                    getHistory={getHistory}
                />)}
            </Form.Item>
        );
    };

    compareRequest = currentRequest => {
        const { entityType, entityId, timeType, start, end, casId } = this.props;
        if (entityType !== currentRequest.entityType)
            return false;
        if (entityId !== currentRequest.entityId)
            return false;
        if (timeType !== currentRequest.timeType)
            return false;
        if (start > currentRequest.start)
            return false;
        if (end < currentRequest.end)
            return false;
        if (casId > 0 && casId !== currentRequest.casId)
            return false;
        return true;
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ queryLoading: true });

                const { entityType, entityId, timeType, start, end ,casId } = values;

                const queryRequest = { entityType, entityId, timeType };

                if (entityType === 0)
                    queryRequest['entityId'] = 0;

                const formatYear = year => '' + year;
                const formatQuarter = quarter => quarter['year'] + '-Q' + quarter['quarter'];
                const formatMonth = month => month.format('YYYY-MM');
                const formatDate = date => date.format('YYYY-MM-DD');
                let format = null;
                switch (timeType) {
                    case 0:
                        format = formatYear;
                        break;
                    case 1:
                        format = formatQuarter;
                        break;
                    case 2:
                        format = formatMonth;
                        break;
                    case 3:
                        format = formatDate;
                        break;
                    default:
                        format = formatYear;
                }
                queryRequest['start'] = format(start);
                queryRequest['end'] = format(end);

                queryRequest['casId'] = casId === undefined ? 0 : casId;

                //console.log(queryRequest);

                if (this.compareRequest(queryRequest)) {
                    const { onUnnecessary } = this.props;
                    onUnnecessary(queryRequest);
                    this.setState({ queryLoading: false });
                    return;
                }

                /*axios({
                    method: 'post',
                    url: baseUrl,
                    data: queryRequest
                }).then(function (res) {
                    const { data } = res;
                    //console.log(data);
                    if (data['code'] !== 200) {
                        message.error(data['msg']);
                    } else {
                        const { onComplete } = this.props;
                        onComplete(queryRequest, data['data']);
                    }
                    this.setState({ queryLoading: false });
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    message.error('服务器繁忙');
                    this.setState({ queryLoading: false });
                }.bind(this));*/
                post(baseUrl, queryRequest).then(function (res) {
                    if (checkTokenExpiration(res, this.props.getHistory()))
                        return;
                    const data = res;
                    //console.log(data);
                    if (data['code'] !== 200) {
                        message.error(data['msg']);
                    } else {
                        const { onComplete } = this.props;
                        onComplete(queryRequest, data['data']);
                    }
                    this.setState({ queryLoading: false });
                }.bind(this)).catch(function (err) {
                    console.log(err);
                    message.error('服务器繁忙');
                    this.setState({ queryLoading: false });
                }.bind(this));
            }
        });
    };

    render() {
        const { queryLoading } = this.state;
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;

        const entityTypeOptions = ENTITY_TYPES.map((type, index) => (
            <Option value={index} key={index}>{type}</Option>
        ));
        let entityType = getFieldValue('entityType');
        entityType = entityType === undefined ? 0 : entityType;

        const timeTypeOptions = TIME_TYPES.map((type, index) => (
            <Option value={index} key={index}>{type}</Option>
        ));
        let timeType = getFieldValue('timeType');
        timeType = timeType === undefined ? 0 : timeType;

        let timeRangerFormItem = null;
        switch (timeType) {
            case 0: timeRangerFormItem = this.yearFormItem(); break;
            case 1: timeRangerFormItem = this.quarterFormItem(); break;
            case 2: timeRangerFormItem = this.monthFormItem(); break;
            case 3: timeRangerFormItem = this.dateFormItem(); break;
            default: break;
        }

        return (
            <Form layout={"inline"} onSubmit={this.handleSubmit}>
                <Form.Item label={'查询范围'}>
                    {getFieldDecorator('entityType', {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: 0
                    })(<Select
                        style={{ width: 80 }}
                        onChange={() => setFieldsValue({ entityId: null })}
                    >
                        {entityTypeOptions}
                    </Select>)}
                </Form.Item>
                {entityType > 0 ? (
                    <Form.Item label={`${ENTITY_TYPES[entityType]}id`}>
                        {getFieldDecorator('entityId', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{ validator: this.checkEntityId }]
                        })(<InputNumber min={0} />)}
                    </Form.Item>
                ) : null}
                <Form.Item label={`时间单位（按${TIME_TYPES[timeType]}查询）`}>
                    {getFieldDecorator('timeType', {
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue: 0
                    })(<Select
                        style={{ width: 70 }}
                        onChange={value => setFieldsValue({ start: INITIAL_VALUES[value], end: INITIAL_VALUES[value] })}
                    >
                        {timeTypeOptions}
                    </Select>)}
                </Form.Item>
                {timeRangerFormItem}
                {this.casFormItem()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={queryLoading}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(QueryConditionForm);
