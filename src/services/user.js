import request from '@/utils/request';
import baseUrl from '../../config/baseUrl';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request(`${baseUrl}/api/currentUser`);
}
export async function queryNotices() {
  return request('/api/notices');
}
