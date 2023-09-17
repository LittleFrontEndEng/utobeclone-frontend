import request from '@/utils/request';

// 登录
export const login = (data) => {
  return request.post('/api/v1/users/login', data)
}

// 注册
export const signup = (data) => {
  return request.post('/api/v1/users', data)
}