
<template>
  <el-main style="padding:10px">
    <el-tabs tab-position="left" type="border-card" class="full">
      <el-tab-pane label="基础" class="full" style="padding:10px">
        <el-form label-width="100px" label-position="top">
          <el-form-item label="项目名称:">
            <el-input v-model="basic.name"></el-input>
          </el-form-item>

          <el-form-item label="项目描述:">
            <el-input type="textarea" v-model="basic.desc"></el-input>
          </el-form-item>
          <el-form-item label="持有者">
            <member-select v-model="basic.owner" :planner="planner_id" />
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" :loading="loading" size="medium" @click="summit_basic">确定</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="成员" class="full" style="padding:10px">
        <el-form label-width="100px" label-position="top">
          <el-form-item label="当前成员:">
            <el-tag
              v-for="one in members"
              :key="one._id"
              effect="dark"
              :type="one._id == basic.owner?'danger':'info'"
              :closable="one._id != basic.owner"
              @close="remove_member(one)"
            >
              <i class="el-icon-user">{{one.name}}</i>
            </el-tag>
          </el-form-item>

          <el-form-item label="添加成员:">
            <el-select
              v-model="adding"
              filterable
              remote
              placeholder="请输入用户姓名"
              :remote-method="search_user"
              :loading="loading"
              value-key="_id"
            >
              <el-option
                v-for="user in users"
                :key="user._id"
                :label="user.name"
                :value="user._id"
                :disabled="user.is_member == true"
              ></el-option>
            </el-select>

            <el-button icon="el-icon-plus" @click="add_member" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import MemberSelect from "@/components/MemberSelect";

export default {
  path: "setting",
  weight: -1,
  meta: {
    menu_title: "设置",
    menu_icon: "el-icon-s-tools",
    require_logined: true
  },
  components: { MemberSelect },
  computed: {
    planner_id() {
      return this.$route.params.planner;
    }
  },
  data() {
    return {
      loading: false,
      adding: null, //
      users: [],
      basic: {
        name: "",
        desc: ""
      },
      members: []
    };
  },
  async mounted() {
    await this.fetch_basic();
    await this.fetch_members();
  },
  methods: {
    async fetch_basic() {
      this.loading = true;
      let info = await this.$store.dispatch("planner_detail", {
        planner: this.planner_id
      });

      Object.assign(this.basic, info);
      this.loading = false;
    },
    async fetch_members() {
      this.loading = true;

      let info = await this.$store.dispatch("member_list", this.planner_id);

      this.members = info;

      this.loading = false;
    },

    async summit_basic() {
      await this.$store.dispatch("planner_update", {
        planner: this.planner_id,
        data: this.basic
      });

      this.fetch_basic();
    },

    async search_user(keyword) {
      if (keyword == "") {
        this.users = [];
        return;
      }

      this.loading = true;
      this.users = await this.$store.dispatch("user_search", {
        keyword
      });

      for (let one of this.users) {
        for (let member of this.members) {
          if (member._id == one._id) {
            one.is_member = true;
          }
        }
      }
      this.loading = false;
    },
    async add_member() {
      if (this.adding == "" || this.adding == null) {
        return;
      }

      let user = await this.$store.dispatch("member_create", {
        planner: this.planner_id,
        user: this.adding
      });

      this.members.push(user);
    },
    async remove_member(one) {
      if (one._id == this.basic.owner) {
        this.$message.error("不能删除拥有者");
        return;
      }
      await this.$store.dispatch("member_destroy", {
        planner: this.planner_id,
        member: one._id
      });

      this.fetch_members();
    }
  }
};
</script>