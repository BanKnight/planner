<template>
  <el-container class="full">
    <el-main class="full">
      <div class="planner-cards full">
        <el-button
          icon="el-icon-plus"
          style="width:220px;height:100px"
          @click="adding = !adding"
          >创建新计划</el-button
        >

        <planner-card
          v-for="planner in planners"
          :key="planner._id"
          :value="planner"
          @click.native="goto(planner)"
        />
      </div>
    </el-main>

    <el-footer height="auto" style="display: flex;justify-content: center">
      <el-pagination
        :page-count="page.count"
        layout="total,prev, pager, next"
        :total="page.total"
        @current-change="fetch_planners"
        @prev-click="fetch_planners"
        @next-click="fetch_planners"
      ></el-pagination>
    </el-footer>

    <el-dialog :visible.sync="adding" title="新的项目" width="500px">
      <el-form :model="form" ref="new_plan" label-position="top">
        <el-form-item label="标题:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.desc"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="full-width"
            :loading="loading"
            @click="on_create"
            >立即创建</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import PlannerCard from "@/components/PlannerCard";

export default {
  path: "/",
  weight: 0,
  meta: {
    menu_title: "全部项目",
    menu_icon: "el-icon-finished",
    require_logined: true
  },
  inject: ["reload_menu"],
  components: { PlannerCard },
  data() {
    return {
      form: {
        name: "",
        desc: ""
      },
      adding: false,
      loading: false,
      planners: [],
      stars: [],
      page: {
        curr: 1, //当前页码
        count: 1, //总页数
        total: 0, //条目总数
        data: [] //当前页的数据
      }
    };
  },

  mounted() {
    this.fetch_planners(1);
    this.fetch_stars();
  },
  methods: {
    async fetch_planners(page) {
      let page_info = await this.$store.dispatch("planner_list", {
        params: {
          curr: page //页码
        }
      });

      this.page.curr = page_info.curr;
      this.page.count = page_info.count;
      this.page.total = page_info.total;

      this.page.data = [];

      this.planners = [];

      for (let one of page_info.data) {
        this.planners.push(one);
      }
    },
    star_icon(planner) {
      if (this.stars.includes(planner._id)) {
        return "el-icon-star-on";
      }
      return "el-icon-star-off";
    },
    async fetch_stars() {
      this.stars = await this.$store.dispatch("planner_list_star");
    },
    goto(planner) {
      if (planner.is_member) {
        this.$router.push(`/planner/${planner._id}`);
      }
    },
    on_create() {
      this.$refs.new_plan.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.loading = true;

        try {
          await this.$store.dispatch("planner_create", this.form);
          this.loading = false;
          this.adding = false;

          this.fetch_planners(1);
        } catch (e) {
          this.adding = false;
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style>
.planner-cards {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-flow: row wrap;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
