import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Icon,
  message, List,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ listTableList, loading }) => ({
  listTableList,
  loading: loading.models.listTableList,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    stepFormValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
        idName: '',
        userName: '',
        startTime: '',
        endTime: '',
        pointName: '',
        orderStatus: '',
        payStatus: '',
        saleStatus: '',
        isSuccess: '',
      },
    });
  }

  handlePageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      pageNum: page,
      pageSize,
      ...formValues,
    };
    dispatch({
      type: 'listTableList/fetch',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        idName: (fieldsValue.idName !== undefined) ? fieldsValue.idName : null,
        userName: (fieldsValue.userName !== undefined) ? fieldsValue.userName : null,
        startTime: (fieldsValue.startTime !== undefined) ? moment(fieldsValue.startTime[0]).format('x') : null,
        endTime: (fieldsValue.startTime !== undefined) ? moment(fieldsValue.startTime[1]).format('x') : null,
        pointName: (fieldsValue.pointName !== undefined) ? fieldsValue.pointName : null,
        orderStatus: (fieldsValue.orderStatus !== undefined) ? fieldsValue.orderStatus : null,
        payStatus: (fieldsValue.payStatus !== undefined) ? fieldsValue.payStatus : null,
        saleStatus: (fieldsValue.saleStatus !== undefined) ? fieldsValue.saleStatus : null,
        isSuccess: (fieldsValue.isSuccess !== undefined) ? fieldsValue.isSuccess : null,
      };
      this.setState({
        formValues: values,
      });
      const params = {
        ...values,
        pageNum: 1,
        pageSize: 10,
      };
      dispatch({
        type: 'listTableList/fetch',
        payload: params,
      });
    });
  };


  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 80,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={9} sm={24}>
            <FormItem label="">
              {getFieldDecorator('idName')(
                <InputGroup compact>
                  <Select defaultValue="商品名称">
                    <Option value="商品名称">商品名称</Option>
                    <Option value="订单编号" disabled>订单编号</Option>
                    <Option value="商户单号" disabled>商户单号</Option>
                  </Select>
                  <Input style={{ width: '70%' }} placeholder="关键词" />
                </InputGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户昵称">
              {getFieldDecorator('userName')(
                <Input
                  placeholder="" />,
                )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <Form.Item label="下单日期">
              {getFieldDecorator('startTime', {
                initialValue: [moment().startOf('day'), moment().endOf('day')],
              })(
                <RangePicker
                  style={{
                    width: '100%',
                  }}/>,
                )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 80,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={6} sm={24}>
            <FormItem label="运营商名">
              {getFieldDecorator('name1')(
                <Input
                  disabled
                  placeholder="" />,
                )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="点位组名">
              {getFieldDecorator('name2')(
                <Input
                  disabled
                  placeholder="" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="点位全称">
              {getFieldDecorator('pointName')(
                <Input
                  placeholder="" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所在地区">
              {getFieldDecorator('name3')(
                <Input
                  disabled
                  placeholder="搜索省、市、区" />,
                  )}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 80,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={6} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择"
                >
                  <Option value={ null }>全部</Option>
                  <Option value="激活">激活</Option>
                  <Option value="未激活">未激活</Option>
                  <Option value="取消">取消</Option>
                  <Option value="超时">超时</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('payStatus', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择"
                >
                  <Option value={ null }>全部</Option>
                  <Option value="成功">成功</Option>
                  <Option value="失败">失败</Option>
                  <Option value="未支付">未支付</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="出货状态">
              {getFieldDecorator('saleStatus', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择"
                >
                  <Option value={ null }>全部</Option>
                  <Option value="未出货">未出货</Option>
                  <Option value="成功">成功</Option>
                  <Option value="失败">失败</Option>
                  <Option value="取消">取消</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="退款状态">
              {getFieldDecorator('isSuccess', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择"
                >
                  <Option value={ null }>全部</Option>
                  <Option value="未退">未退</Option>
                  <Option value="已退">已退</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              float: 'right',
              marginBottom: 24,
            }}
          >
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button
              disabled
              style={{
                marginLeft: 8,
              }}
            >
              导出
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      listTableList: { data },
      loading,
    } = this.props;

    const paginationProps = {
      onChange: this.handlePageChange,
      pageSize: 10,
      total: data.total,
    };

    const { modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
    };
    const updateMethods = {
      handleUpdate: this.handleUpdate,
    };
    const Info = ({ title, value, unit, bordered }) => (
      <div className={styles.headerInfo}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}<span className={styles.unit}>{unit}</span></div>
        {bordered && <em />}
      </div>
    );
    const PayIcon = ({ payType }) => (
      (payType === '微信') ? <Icon type="wechat" theme="filled" style={{ color: '#87d068' }} /> : <Icon type="alipay-circle" theme="filled" style={{ color: '#108ee9' }} />
    );
    const OrderStatusBadge = ({ data: orderStatus }) => {
      const status = (orderStatus === '激活') ? 'success' : 'default';
      return <Badge status={status} text={orderStatus} />
    };

    const PayStatusBadge = ({ data: orderStatus }) => {
      const status = (orderStatus === '成功') ? 'success' : 'default';
      return <Badge status={status} text={orderStatus} />
    };

    const SaleStatusBadge = ({ data: orderStatus }) => {
      const status = (orderStatus === '出货') ? 'success' : 'default';
      return <Badge status={status} text={orderStatus} />
    };

    const IsSuccessBadge = ({ data: orderStatus }) => {
      const status = (orderStatus === '未退') ? 'success' : 'default';
      return <Badge status={status} text={orderStatus} />
    };

    // eslint-disable-next-line max-len
    const ListContent = ({ data: { userName, pay, orderStatus, payStatus, saleStatus, isSuccess, orderPay } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>{userName}</span>
          <p><PayIcon payType={pay}/> ¥{orderPay}</p>
        </div>
        <div className={styles.listContentItem}>
          <p>订单: <OrderStatusBadge data={orderStatus} /></p>
          <p>支付: <PayStatusBadge data={payStatus} /></p>
        </div>
        <div className={styles.listContentItem}>
          <p>出货: <SaleStatusBadge data={saleStatus} /></p>
          <p>退款: <IsSuccessBadge data={isSuccess} /></p>
        </div>
      </div>
    );
    const ListItemTitle = ({ data: { title, orderTime } }) => (
      <div className={styles.listContentItemTitle}>{title}<span>{moment(orderTime).format('YYYY-MM-DD HH:mm')}</span></div>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <div className={styles.standardList}>
              <Card bordered={false}>
                <Row>
                  <Col sm={8} xs={24}>
                    <Info title="订单总数" value={data.orderTotal} unit="笔" bordered />
                  </Col>
                  <Col sm={8} xs={24}>
                    <Info title="售卖商品总计" value={data.saleSum} unit="元" bordered />
                  </Col>
                  <Col sm={8} xs={24}>
                    <Info title="订单金额总计" value={data.orderSum} unit="元" />
                  </Col>
                </Row>
              </Card>
            </div>
            <Divider />
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={data.records}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" disabled>查看/退款</Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<ListItemTitle data={item}/>}
                    description={item.pointName}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
