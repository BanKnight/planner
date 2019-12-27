<template>
  <layout>
    <el-container direction="horizontal" class="full">
      <transition name="el-fade-in">
        <el-container direction="vertical">
          <el-table
            :data="page.data"
            style="width: 100%"
            height="100%"
            border
            v-loading="loading"
            :row-class-name="row_class"
            row-key="_id"
          >
            <el-table-column width="38">
              <template slot="header">
                <i class="el-icon-check"></i>
              </template>

              <template slot-scope="scope">
                <el-checkbox :value="!!scope.row.closed" @change="close(scope.row,$event)"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label="标题" prop="title" width="150"></el-table-column>

            <el-table-column label="描述" prop="desc"></el-table-column>

            <el-table-column label="截止日期" width="130">
              <template slot-scope="scope">
                <i v-if="scope.row.due" class="el-icon-time">{{ $format(scope.row.due) }}</i>
                <el-tag v-else>无</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="进度" width="180">
              <template slot-scope="scope">
                <el-progress
                  :percentage="scope.row.percent"
                  :title="scope.row.percent + '%'"
                  :text-inside="true"
                  :stroke-width="20"
                ></el-progress>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120" align="right" fixed="right">
              <template slot="header">
                <el-button type="primary" icon="el-icon-plus" @click="adding=!adding"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="del(scope.row)"
                  ></el-button>
                  <el-button
                    size="mini"
                    icon="el-icon-edit"
                    type="primary"
                    @click="edit(scope.row)"
                  ></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <el-footer height="auto" style="display: flex;justify-content: center">
            <el-pagination
              :page-count="page.count"
              layout="total,prev, pager, next"
              :total="page.total"
              @current-change="fetch"
              @prev-click="fetch"
              @next-click="fetch"
            ></el-pagination>
          </el-footer>
        </el-container>
      </transition>

      <transition name="el-zoom-in-center">
        <el-main width="300px" v-if="adding" class="el-card">
          <el-form label-position="top" :model="form" ref="new_one">
            <el-form-item label="标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc"></el-input>
            </el-form-item>

            <el-form-item label="截止时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.due"
                value-format="timestamp"
                class="full-width"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-row type="flex" justify="center">
                <el-button type="primary" :loading="loading" @click="on_create">立即创建</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </el-main>
      </transition>

      <transition name="el-zoom-in-center">
        <el-main width="300px" v-if="editing" class="el-card">
          <el-form label-position="top" :model="editing_form" ref="new_one">
            <h3>{{editing_form.title}}</h3>

            <el-form-item label="标题">
              <el-input v-model="editing_form.title"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="editing_form.desc"></el-input>
            </el-form-item>

            <el-form-item label="截止时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editing_form.due"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-row type="flex" justify="center">
                <el-button type="primary" :loading="loading" @click="on_edit">确定修改</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </el-main>
      </transition>
    </el-container>
  </layout>
</template>

<script>
import layout from "../layout";

export default {
  path: "",
  weight: 10,
  meta: { menu_title: "里程碑", require_logined: true },
  components: { layout },
  data() {
    return {
      adding: false,
      loading: false,
      page: {
        curr: 1, //当前页码
        count: 1, //总页数
        total: 0, //条目总数
        data: [] //当前页的数据
      },
      form: {
        title: "",
        desc: "",
        due: null
      },
      editing: null,
      editing_form: null
    };
  },
  mounted() {
    this.fetch(1);
  },
  computed: {
    planner_id() {
      return this.$route.params.planner;
    }
  },
  methods: {
    row_class({ row, rowIndex }) {
      let classes = [];

      if (row == this.editing) {
        classes.push("primary-row");
      }

      if (row.closed) {
        classes.push("closed-row");
      }

      if (rowIndex % 2 == 0) {
        classes.push("normal-row");
      }
      return classes.concat(" ");
    },
    on_create() {
      this.$refs.new_one.validate(async valid => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
        this.loading = true;

        try {
          await this.$store.dispatch("milestone_create", {
            planner: this.planner_id,
            data: this.form
          });
          this.loading = false;

          this.fetch(1);
        } catch (e) {
          this.loading = false;
        }
      });
    },

    async fetch(page) {
      this.editing = null;
      this.loading = true;

      const page_info = await this.$store.dispatch("milestone_list", {
        planner: this.planner_id,
        params: {
          curr: page //页码
        }
      });

      this.page.curr = page_info.curr;
      this.page.count = page_info.count;
      this.page.total = page_info.total;

      this.page.data = [];

      for (let one of page_info.data) {
        one.percent = one.percent || parseInt(Math.random().toFixed(2) * 100);
        this.page.data.push(one);
      }
      this.loading = false;
    },

    edit(milestone) {
      this.adding = false;

      if (this.editing === milestone) {
        this.editing = null;
        this.editing_form = null;
      } else {
        this.editing = milestone;
        this.editing_form = Object.assign({}, milestone);
      }
    },
    async on_edit() {
      await this.$store.dispatch("milestone_update", {
        planner: this.planner_id,
        milestone: this.editing._id,
        data: this.editing_form
      });

      this.fetch(this.page.curr);
      this.editing = null;
      this.editing_form = null;
    },
    async close(milestone, value) {
      await this.$store.dispatch("milestone_update", {
        planner: this.planner_id,
        milestone: milestone._id,
        data: { closed: value }
      });

      this.fetch(this.page.curr);
    },
    async del(milestone) {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await this.$store.dispatch("milestone_destroy", {
        planner: this.planner_id,
        milestone: milestone._id
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      this.fetch(this.page.curr);
    }
  }
};
</script>