<template>
  <el-container class="full">
    <el-button type="info" size="mini" icon="el-icon-plus" @click="adding =!adding"></el-button>

    <el-main class="full scroll-if-need">
      <el-row
        v-if="adding == false && planners.length > 0"
        type="flex"
        justify="space-around"
        style="flex-wrap:wrap"
        align="start"
      >
        <planner-card v-for="planner in planners" :key="planner._id" :value="planner" />
      </el-row>

      <el-form
        v-if="adding || planners.length == 0"
        label-position="top"
        :model="form"
        ref="new_plan"
      >
        <el-form-item label="标题">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-button type="primary" :loading="loading" @click="on_create">立即创建</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import PlannerCard from "@/components/PlannerCard";

export default {
  title: "Hub",
  path: "",
  weight: 0,
  meta: { require_logined: true },
  components: { PlannerCard },
  data() {
    return {
      form: {
        name: "",
        desc: ""
      },
      adding: false,
      loading: false,
      planners: []
    };
  },

  mounted() {
    this.init_planners();
  },
  methods: {
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

          this.init_planners();
        } catch (e) {
          this.adding = false;
          this.loading = false;
        }
      });
    },
    async init_planners() {
      this.planners = [];

      let data = await this.$store.dispatch("planner_list");

      for (let one of data) {
        this.planners.push(one);
      }
    }
  }
};
</script>

