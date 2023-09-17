import request from '@/utils/request';

export const createUploadVideo = (data) => {
  return request.get(`/api/v1/vod/CreateUploadVideo?Title=${data.Title}&FileName=${data.FileName}`, )
}

export const refreshUploadVideo = (data) => {
  return request.get(`/api/v1/vod/RefreshUploadVideo?VideoId=${data}`)
}


export const getVideoPlayAuth = (data) => {
  return request.get(`/api/v1/vod/GetVideoPlayAuth?VideoId=${data}`)
}