import request from '@/utils/request';

let url = '/api/currentUser';
url = `http://localhost:8087${url}`;
// url = `http://02eb8281.ngrok.io${url}`;
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request(url);
}
export async function queryNotices() {
  return request('/api/notices');
}
