<template>
  <el-main style="padding:10px">
    <el-tabs tab-position="left" type="border-card" class="full">
      <el-tab-pane label="基础" class="full">
        <el-form label-width="100px" label-position="top">
          <el-form-item label="姓名:">
            <el-input v-model="basic_form.name" prefix-icon="el-icon-user" />
          </el-form-item>

          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" size="medium" @click="reset_name">确定</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="更改密码" class="full">
        <el-form label-width="100px" label-position="top">
          <el-form-item label="旧密码:">
            <el-input
              name="old"
              type="password"
              v-model="password_form.old"
              placeholder="Password"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>

          <el-form-item label="新密码:">
            <el-input
              name="password"
              type="password"
              v-model="password_form.new"
              placeholder="Password"
              tabindex="2"
              autocomplete="on"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>

          <el-form-item label="新密码确认:">
            <el-input
              name="password"
              type="password"
              v-model="password_form.again"
              placeholder="Password"
              tabindex="3"
              autocomplete="on"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" size="medium" @click="reset_password">确定</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import Cookie from "js-cookie";

export default {
  path: "/setting",
  weight: 0,
  meta: {
    menu_title: "设置",
    menu_icon: "el-icon-setting",
    require_logined: true
  },
  data() {
    return {
      basic_form: {
        name: ""
      },
      password_form: {
        old: "",
        new: "",
        again: ""
      }
    };
  },
  methods: {
    async reset_name() {
      this.basic_form.name = this.basic_form.name.trim();

      if (this.basic_form.name.length == 0) {
        this.$message.error("请输入姓名");
        return;
      }

      await this.$store.dispatch("user_reset", {
        basic: this.basic_form
      });

      this.$message.success("成功修改");
    },
    async reset_password() {
      if (this.password_form.old.length == 0) {
        this.$message.error("请先输入旧密码");
        return;
      }

      this.password_form.new = this.password_form.new.trim();
      this.password_form.again = this.password_form.again.trim();

      if (this.password_form.new != this.password_form.again) {
        this.$message.error("两次密码要一致");
        return;
      }

      if (
        this.password_form.new.length == 0 ||
        this.password_form.again.length == 0
      ) {
        this.$message.error("请输入新密码");
        return;
      }
      await this.$store.dispatch("user_reset", {
        password: this.password_form
      });

      this.$message.success("成功修改");

      Cookie.remove("token");

      this.$router.replace({ path: "/login" });
    }
  }
};
</script>