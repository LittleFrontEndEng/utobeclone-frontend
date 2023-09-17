<template>
  <div class="gspRov">
    <h2>Login to your account</h2>
    <form>
      <ul class="errors" v-if="errors">
        <li>{{errors}}</li>
      </ul>
      <input v-model="user.email" type="email" placeholder="email" />
      <input v-model="user.password" type="password" placeholder="password" />
      <div class="action input-group">
        <span class="pointer">Sign Up</span>
        <!-- <button>Login</button> -->
        <el-button type="primary" :loading="btnLoading" @click="handleSubmit">Login</el-button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { login } from '@/api/user';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex'
const user = reactive({
  email: "d.wthnnyteq@myrs.gw",
  password: "123456",
})
const errors = ref('');
const btnLoading = ref(false);
const router = useRouter();
const route = useRoute();
const store = useStore();
const handleSubmit = async () => {
  errors.value = ''
  btnLoading.value = true;
  try {
    const result = await login(user)
    store.commit('addUserInfo', result.user)
    const redirect = route.query.redirect || '/'
    localStorage.setItem("userInfo", JSON.stringify(result.user))
    router.push(redirect)
  } catch (error) {
    errors.value = error.error;
  } finally {
    btnLoading.value = false;
  }
}
</script>
<style lang="">
  
</style>