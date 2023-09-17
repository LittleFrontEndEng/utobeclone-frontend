<!-- src\components\UploadVideo\index.vue -->
<template>
  <div class="sc-AxiKw dZbDOR">
    <div class="modal-content">
      <form>
        <div class="modal-header">
          <div class="modal-header-left">
            <svg
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
              @click="handleClose"
            >
              <g>
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                ></path>
              </g>
            </svg>
            <h3>Upload Video</h3>
          </div>
          <div style="display: block">
            <el-button type="primary" class="sc-AxirZ erzyjX"  @click="handleSubmit">Save</el-button>
            <!-- <button @click="handleSubmit">Save</button> -->
          </div>
        </div>
        <div class="tab video-form">
          <input ref="fileRef" required type="file" @change="handelFileChange"/>
          <video ref="videoFileRef" controls></video>
          <input v-model="video.title" required type="text" placeholder="Enter the title" />
          <textarea
            required
            v-model="video.description"
            placeholder="Tell viewers about your video"
          ></textarea>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits, reactive } from 'vue';
import { createUploadVideo, refreshUploadVideo } from "@/api/vod.js"
import { useRoute, useRouter } from 'vue-router';
import { createVideo } from "@/api/video.js";
import { getVideoPlayAuth } from "@/api/vod.js";
const router = useRouter();
const emits = defineEmits(['close']);
const fileRef = ref(null);
const videoFileRef = ref(null);
const video = reactive({
  title: '',
  description: '',
  vodVideoId: '',
  cover: '',
})
onMounted(() => {

})

const createUploader = () => {
  console.log(window.AliyunUpload)
  const uploader = new window.AliyunUpload.Vod({
     // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
     userId:"1917778847039415",
     // 上传到视频点播的地域，默认值为'cn-shanghai'，
     //eu-central-1，ap-southeast-1
     region:"",
     // 分片大小默认1 MB，不能小于100 KB（100*1024）
     partSize: 1048576,
     // 并行上传分片个数，默认5
     parallel: 5,
     // 网络原因失败时，重新上传次数，默认为3
     retryCount: 3,
     // 网络原因失败时，重新上传间隔时间，默认为2秒
     retryDuration: 2,
     // 开始上传
     'onUploadstarted': async function (uploadInfo) {
        if (uploadInfo.videoId) {
          const data = await refreshUploadVideo(uploadInfo.videoId)
          uploader.setUploadAuthAndAddress(uploadInfo, data.UploadAuth, data.UploadAddress, data.VideoId);
        } else {
          const data = await createUploadVideo({
            Title: uploadInfo.file.name,
            FileName: uploadInfo.file.name,
          })
          uploader.setUploadAuthAndAddress(uploadInfo, data.UploadAuth, data.UploadAddress, data.VideoId);
        }
      },
     // 文件上传成功
     'onUploadSucceed': async function (uploadInfo) {
        // console.log(uploadInfo)
        video.vodVideoId = uploadInfo.videoId;
        const data = await getVideoPlayAuth(uploadInfo.videoId);
        if (data) {
          video.cover = data.VideoMeta.CoverURL;
          const result = await createVideo(video)
          if (result.success) {
            router.push({
              path: 'watch',
              query: {
                videoId: result.video._id,
              }
            })
            emits('close');
          }
        }
        // 提交后台
      },
     // 文件上传失败
     'onUploadFailed': function (uploadInfo, code, message) {
      },
     // 文件上传进度，单位：字节
     'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
      },
     // 上传凭证或STS token超时
     'onUploadTokenExpired': async function (uploadInfo) {
        const data = await refreshUploadVideo(uploadInfo.videoId)
        uploader.resumeUploadWithAuth(data.UploadAuth);
      },
     // 全部文件上传结束
     'onUploadEnd':function(uploadInfo){
      }
  });

  console.log(uploader)

  return uploader;
}

const handleSubmit = async () => {
  console.log(123)
  const uploader = createUploader();
  
  // // 获取文件
  uploader.addFile(fileRef.value.files[0],null,null,null,'{"Vod":{}}');

  uploader.startUpload();
}

const handelFileChange = () => {
  const file = fileRef.value.files[0];

  videoFileRef.value.src = URL.createObjectURL(file);
}

const handleClose = () => {
  emits('close');
}


</script>

<style scoped></style>