import request from '@/utils/request';
import baseUrl from '../../config/baseUrl'

export async function fakeAccountLogin(params) {
  return request(`${baseUrl}/user/login`, {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
