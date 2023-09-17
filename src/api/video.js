import request from '@/utils/request';

// 创建视频
export const createVideo = (data) => {
  return request.post('/api/v1/videos', data)
}

// 获取视频
export const getVideo = (data) => {
  return request.get(`/api/v1/videos/${data}`)
}
