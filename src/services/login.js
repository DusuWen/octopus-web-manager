import request from '@/utils/request';

let url = '/user/login';
url = `http://localhost:8087${url}`;
// url = `http://02eb8281.ngrok.io${url}`;
export async function fakeAccountLogin(params) {
  return request(url, {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
