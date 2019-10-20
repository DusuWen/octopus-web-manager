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
  message, List, Avatar,
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

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ listTableList, loading }) => ({
  listTableList,
  loading: loading.models.listTableList,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      sorter: true,
      align: 'right',
      render: val => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: '0',
        },
        {
          text: status[1],
          value: '1',
        },
        {
          text: status[2],
          value: '2',
        },
        {
          text: status[3],
          value: '3',
        },
      ],

      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '上次调度时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/fetch',
      payload: {
        count: 5,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listTableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listTableList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listTableList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'listTableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listTableList/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
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
              {getFieldDecorator('name')(
                <InputGroup compact>
                  <Select defaultValue="商品名称">
                    <Option value="商品名称">商品名称</Option>
                  </Select>
                  <Input style={{ width: '70%' }} placeholder="关键词" />
                </InputGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户昵称">
              {getFieldDecorator('name')(
                <Input
                  placeholder="" />,
                )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <Form.Item label="下单日期">
              {getFieldDecorator('range-picker')(
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
              {getFieldDecorator('name')(
                <Input
                  disabled
                  placeholder="" />,
                )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="点位组名">
              {getFieldDecorator('name')(
                <Input
                  disabled
                  placeholder="" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="点位全称">
              {getFieldDecorator('name')(
                <Input
                  placeholder="" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所在地区">
              {getFieldDecorator('name')(
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
              {getFieldDecorator('status3')(
                <Select
                  placeholder="请选择"
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('status3')(
                <Select
                  placeholder="请选择"
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="出货状态">
              {getFieldDecorator('status4')(
                <Select
                  placeholder="请选择"
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="退货状态">
              {getFieldDecorator('status4')(
                <Select
                  placeholder="请选择"
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
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
      listTableList: { list },
      loading,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const { modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
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
    const ListContent = ({ data: { createdAt } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>田几木</span>
          <p><PayIcon payType="支付宝"/> ¥5.00</p>
        </div>
        <div className={styles.listContentItem}>
          <p>订单: <Badge status="success" text="激活" /></p>
          <p>支付: <Badge status="success" text="成功" /></p>
        </div>
        <div className={styles.listContentItem}>
          <p>出货: <Badge status="success" text="成功" /></p>
          <p>退款: <Badge status="default" text="未退" /></p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );
    const ListItemTitle = ({ data: { title, createdAt } }) => (
      <div className={styles.listContentItemTitle}>{title}<span>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</span></div>
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
                    <Info title="订单总数" value="11877" unit="笔" bordered />
                  </Col>
                  <Col sm={8} xs={24}>
                    <Info title="售卖商品总计" value="45360.45" unit="元" bordered />
                  </Col>
                  <Col sm={8} xs={24}>
                    <Info title="订单金额总计" value="44624.60" unit="元" />
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
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" disabled>查看/退款</Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<ListItemTitle data={item}/>}
                    description="北大三楼一楼电梯口"
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
