<template>
  <el-container class="full" style="padding:10px">
    <el-main class="full" style="padding:0;">
      <el-table
        :data="planners"
        style="width: 100%"
        height="100%"
        :stripe="true"
      >
        <el-table-column label="标题" prop="name" width="150">
          <template slot-scope="scope">
            <router-link
              :to="'/planner/' + scope.row._id"
              class="el-link el-link--default"
            >
              <h4>{{ scope.row.name }}</h4>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="描述" prop="desc"></el-table-column>

        <el-table-column label="创建日期" width="130">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              $format(scope.row.created)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="right">
          <template slot="header">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="adding = !adding"
            ></el-button>
          </template>
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                :icon="star_icon(scope.row)"
                :type="star_type(scope.row)"
                @click="star(scope.row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <transition>
      <el-main v-if="adding" class="el-card" style="margin-left:10px">
        <el-form label-position="top" :model="form" ref="new_plan">
          <el-form-item label="标题">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.desc"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" :loading="loading" @click="on_create"
                >立即创建</el-button
              >
            </el-row>
          </el-form-item>
        </el-form>
      </el-main>
    </transition>
  </el-container>
</template>

<script>
export default {
  path: "/",
  weight: 0,
  meta: {
    menu_title: "项目",
    menu_icon: "el-icon-finished",
    require_logined: true
  },
  inject: ["reload_menu"],
  data() {
    return {
      form: {
        name: "",
        desc: ""
      },
      adding: false,
      loading: false,
      planners: [],
      stars: []
    };
  },

  mounted() {
    this.fetch_planners();
    this.fetch_stars();
  },
  methods: {
    async fetch_planners() {
      this.planners = [];

      let data = await this.$store.dispatch("planner_list");

      for (let one of data) {
        this.planners.push(one);
      }
    },
    star_icon(planner) {
      if (this.stars.includes(planner._id)) {
        return "el-icon-star-on";
      }
      return "el-icon-star-off";
    },
    star_type(planner) {
      if (this.stars.includes(planner._id)) {
        return "danger";
      }
      return "info";
    },
    async fetch_stars() {
      this.stars = await this.$store.dispatch("planner_list_star");
    },
    on_create() {
      this.$refs.new_plan.validate(async valid => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
        this.loading = true;

        try {
          await this.$store.dispatch("planner_create", this.form);
          this.loading = false;
          this.adding = false;

          this.fetch_planners();
        } catch (e) {
          this.adding = false;
          this.loading = false;
        }
      });
    },
    async star(planner) {
      this.stars = await this.$store.dispatch("planner_star", {
        data: {
          planner: planner._id,
          value: !this.stars.includes(planner._id)
        }
      });

      this.reload_menu();
    }
  }
};
</script>
