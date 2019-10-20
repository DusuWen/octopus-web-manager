import { parse } from 'url';
// mock tableListDataSource
let tableListDataSource = [];

tableListDataSource.push({
  orderId: '78909',
  user: '6987',
  userName: '小爱',
  pay: '微信',
  pointName: '德礼楼德礼楼',
  number: '38',
  id: '32',
  idName: '统一绿茶 茉莉味',
  orderPay: '3.3',
  idPay: '3.30',
  sale: '0.00',
  gift: '',
  orderStatus: '激活',
  payStatus: '成功',
  saleStatus: '成功',
  isSuccess: '否',
  orderTime: '2018-09-01 00:00:25',
  payTime: '2018-09-01 00:00:31',
  saleTime: '2018-09-01 00:00:35',
});

function getRule(req, res) {
  const result = {
    code: 200,
    data: {
      total: 11,
      size: 10,
      current: 1,
      pages: 1,
      records: tableListDataSource,
    },
    message: 'success',
  };
  return res.json(result);
}

function postRule(req, res, u, b) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;

    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;

    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          return { ...item, desc, name };
        }

        return item;
      });
      break;

    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };
  return res.json(result);
}

export default {
  'POST /order/selectOrderList': getRule,
  'POST /api/rule': postRule,
};
