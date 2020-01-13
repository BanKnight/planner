<template>
  <el-row class="login-container" type="flex" justify="center" align="middle">
    <div>
      <div class="title-container">
        <h3 class="title">登 录</h3>
      </div>

      <el-tabs type="border-card" style="width:520px;border-radius:4px">
        <el-tab-pane label="登录">
          <el-form
            ref="login"
            :model="login_form"
            :rules="rules"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="account">
              <el-input
                ref="login_name"
                v-model="login_form.account"
                placeholder="用户名称(请使用邮箱地址)"
                name="account"
                type="text"
                tabindex="1"
                autocomplete="on"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="login_password"
                v-model="login_form.password"
                placeholder="Password"
                name="password"
                :type="passwordType"
                tabindex="2"
                autocomplete="on"
                prefix-icon="el-icon-lock"
                @keyup.enter.native="login"
                show-password
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                style="width:100%;"
                @click.native.prevent="login"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册">
          <el-form
            ref="regist"
            :model="regist_form"
            :rules="rules"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="account">
              <el-input
                ref="regist_name"
                v-model="regist_form.account"
                placeholder="用户名称(请使用邮箱地址)"
                name="account"
                type="text"
                tabindex="1"
                autocomplete="on"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="regist_password"
                v-model="regist_form.password"
                placeholder="Password"
                name="password"
                :type="passwordType"
                tabindex="2"
                autocomplete="on"
                prefix-icon="el-icon-lock"
                show-password
                @keyup.enter.native="regist"
              ></el-input>
            </el-form-item>

            <el-form-item prop="name">
              <el-input
                ref="regist_name"
                v-model="regist_form.name"
                placeholder="输入姓名"
                name="name"
                type="text"
                tabindex="3"
                autocomplete="on"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                style="width:100%;"
                @click.native.prevent="regist"
              >注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-row>
</template>

<script>

import Cookie from "js-cookie";

export default {
  name: "login",
  path: "/login",
  weight: 0,
  data()  {
    return {
      login_form: {
        account: "",
        password: ""
      },
      regist_form: {
        account: "",
        password: "",
        name: ""
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route)      {
        const query = route.query;
        if (query)        {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created()  {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted()  {

    Cookie.remove("token");

    this.$refs.login_name.focus();
  },
  destroyed()  {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  computed: {
    rules()    {
      return {
        account: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "非法的邮箱格式", trigger: "blur" },
          { min: 3, message: "长度过短", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, message: "长度过短", trigger: "blur" }
        ],
        name: [
          { min: 2, message: "长度过短", trigger: "blur" },
          { required: true, message: "请输入你的姓名", trigger: "blur" }
        ]
      };
    }
  },
  methods: {
    showPwd()    {
      if (this.passwordType === "password")      {
        this.passwordType = "";
      } else      {
        this.passwordType = "password";
      }
      this.$nextTick(() =>      {
        this.$refs.password.focus();
      });
    },
    login()    {
      this.$refs.login.validate(async valid =>      {
        if (!valid)        {
          return false;
        }
        this.loading = true;

        try        {
          await this.$store.dispatch("login", this.login_form);
          this.loading = false;

          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery
          });
        } catch (e)        {
          this.loading = false;
        }
      });
    },
    regist()    {
      this.$refs.regist.validate(async valid =>      {
        if (!valid)        {
          return false;
        }
        this.loading = true;

        try        {
          await this.$store.dispatch("regist", this.regist_form);

          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery
          });

          this.loading = false;
        } catch (e)        {
          this.loading = false;
        }
      });
    },
    getOtherQuery(query)    {
      return Object.keys(query).reduce((acc, cur) =>      {
        if (cur !== "redirect")        {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #344444;
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      color: white;
    }
  }
}
</style>
