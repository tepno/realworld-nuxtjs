<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in': 'Sign up'}}</h1>
          <p class="text-xs-center">
            <!-- <a href>Have an account?</a> -->
            <nuxt-link to="/register" v-if="isLogin">Need an account?</nuxt-link>
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(val, key) in errors">
              <li v-for="(msg, index) in val" :key="index">{{ key }} {{msg}}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                v-model="user.email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                minlength="8"
                v-model="user.password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">{{ isLogin ? 'Sign in': 'Sign up'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user";
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "notAuthenticated",
  name: "loginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      user: {
        email: "tepno@email.com",
        password: "12345678",
        username: "",
      },
      errors: {}, // 错误信息
    };
  },
  methods: {
    async onSubmit() {
      try {
        // 提交表单请求登录
        const { data } = this.isLogin
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            });
        // 保存用户的登录状态
        this.$store.commit("setUser", data.user);

        // 防止刷新页面数据丢失
        Cookie.set("user", data.user);

        // 跳转到首页
        this.$router.push("/");
      } catch (error) {
        // console.dir(error);
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>