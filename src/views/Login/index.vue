<template>
  <div class="gspRov">
    <h2>Login to your account</h2>
    <form>
      <ul class="errors" v-if="errors">
        <li>{{errors}}</li>
      </ul>
      <input v-if="isSingUp" v-model="user.username" type="username" placeholder="username" />
      <input v-model="user.email" type="email" placeholder="email" />
      <input v-model="user.password" type="password" placeholder="password" />
      <div class="action input-group">
        <span class="pointer" @click="enjoinSignUp">Sign Up</span>
        <!-- <button>Login</button> -->
        <el-button type="primary" :loading="btnLoading" @click="handleSubmit">{{ isSingUp ? "signup" : 'Login' }}</el-button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { login, signup } from '@/api/user';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
const user = reactive({
  username: '',
  email: "",
  password: "",
})
const errors = ref('');
const isSingUp = ref(false);
const btnLoading = ref(false);
const router = useRouter();
const route = useRoute();
const store = useStore();
const handleSubmit = async () => {
  errors.value = ''
  btnLoading.value = true;
  if (!isSingUp.value) {

    try {
      const result = await login({
        email: user.email,
        password: user.password
      })
      store.commit('addUserInfo', result.user)
      const redirect = route.query.redirect || '/'
      localStorage.setItem("userInfo", JSON.stringify(result.user))
      router.push(redirect)
    } catch (error) {
      errors.value = error.error;
    } finally {
      btnLoading.value = false;
    }
  } else {
    try {
      const result = await signup(user)
      if (result.success) {
        ElMessage({
          message: '注册成功',
          type: 'success',
        })
        user.password = '';
        user.username = '';
        isSingUp.value = false;
      }
    } catch (error) {
      errors.value = error.error;
    } finally {
      btnLoading.value = false;
    }
  }
}

const enjoinSignUp = () => {
  isSingUp.value = true;
}
</script>
<style lang="">
  
</style>