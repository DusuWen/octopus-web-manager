import request from '@/utils/request';

let url = '/order/selectOrderList';
url = `http://localhost:8087${url}`;
// url = `http://02eb8281.ngrok.io${url}`;
export async function queryFakeList(params) {
  return request(url, {
    method: 'POST',
    data: { ...params },
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
