<template>
  <el-container class="full" style="padding:10px">
    <el-container class="full">
      <el-main class="full" style="padding:0;">
        <el-table :data="planners" style="width: 100%" height="100%" :stripe="true">
          <el-table-column label="标题" prop="name" width="150">
            <template slot-scope="scope">
              <router-link
                v-if="scope.row.is_member"
                :to="'/planner/' + scope.row._id"
                class="el-link el-link--default"
              >
                <el-tag effect="dark" type="success">{{ scope.row.name }}</el-tag>
              </router-link>
              <el-tag effect="dark" type="info" v-else title="你不在这个项目中">{{ scope.row.name }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="描述" prop="desc"></el-table-column>

          <el-table-column label="创建日期" width="130">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ $format(scope.row.created) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" align="right">
            <template slot="header">
              <el-button type="primary" icon="el-icon-plus" @click="adding = !adding"></el-button>
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
    </el-container>

    <transition>
      <el-main v-if="adding" class="el-card" style="margin-left:10px">
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
  path: "/",
  weight: 0,
  meta: {
    menu_title: "项目",
    menu_icon: "el-icon-finished",
    require_logined: true
  },
  inject: ["reload_menu"],
  data()  {
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
      },
    };
  },

  mounted()  {
    this.fetch_planners(1);
    this.fetch_stars();
  },
  methods: {
    async fetch_planners(page)    {
      this.planners = [];

      let page_info = await this.$store.dispatch("planner_list", {
        params: {
          curr: page //页码
        }
      });

      this.page.curr = page_info.curr;
      this.page.count = page_info.count;
      this.page.total = page_info.total;

      this.page.data = [];

      for (let one of page_info.data)      {
        this.planners.push(one);
      }
    },
    star_icon(planner)    {
      if (this.stars.includes(planner._id))      {
        return "el-icon-star-on";
      }
      return "el-icon-star-off";
    },
    star_type(planner)    {
      if (this.stars.includes(planner._id))      {
        return "danger";
      }
      return "info";
    },
    async fetch_stars()    {
      this.stars = await this.$store.dispatch("planner_list_star");
    },
    on_create()    {
      this.$refs.new_plan.validate(async valid =>      {
        if (!valid)        {
          return false;
        }
        this.loading = true;

        try        {
          await this.$store.dispatch("planner_create", this.form);
          this.loading = false;
          this.adding = false;

          this.fetch_planners(1);
        } catch (e)        {
          this.adding = false;
          this.loading = false;
        }
      });
    },
    async star(planner)    {
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
