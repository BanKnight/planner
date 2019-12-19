<template>
  <el-container class="full">
    <el-main class="full">
      <el-table :data="planners" style="width: 100%" height="100%" :stripe="true">
        <el-table-column label="标题" prop="name" width="150">
          <template slot-scope="scope">
            <router-link :to="'/project/' + scope.row._id" class="el-link el-link--default">
              <h4>{{scope.row.name}}</h4>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="描述" prop="desc"></el-table-column>

        <el-table-column label="创建日期" width="120">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ $format(scope.row.created) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="right" fixed="right">
          <template slot="header">
            <el-button type="primary" icon="el-icon-plus" @click="adding =!adding"></el-button>
          </template>
          <el-button-group>
            <el-button size="mini" icon="el-icon-star-off" type="success"></el-button>
          </el-button-group>
        </el-table-column>
      </el-table>
    </el-main>

    <transition>
      <el-main v-if="adding">
        <el-form label-position="top" :model="form" ref="new_plan">
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
    </transition>
  </el-container>
</template>

<script>
export default {
  path: "",
  weight: 0,
  meta: { menu_title: "项目", require_logined: true },
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

