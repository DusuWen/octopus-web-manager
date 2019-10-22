import request from '@/utils/request';
import baseUrl from '../../../config/baseUrl';

export async function queryFakeList(params) {
  return request(`${baseUrl}/order/selectOrderList`, {
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
