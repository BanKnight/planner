<template>
  <layout>
    <el-container direction="horizontal" class="full">
      <transition name="el-fade-in">
        <el-main style="padding:0">
          <el-table
            :data="items"
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
        </el-main>
      </transition>

      <transition name="el-zoom-in-center">
        <el-main width="300px" v-if="adding">
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
        <el-main width="300px" v-if="editing">
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
  title: "里程碑",
  path: "",
  weight: 10,
  meta: { require_logined: true },
  components: { layout },
  data() {
    return {
      adding: false,
      loading: false,
      items: [],
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
    this.init_milestones();
  },
  computed: {
    planner_id() {
      return this.$route.params.id;
    }
  },
  methods: {
    row_class({ row, rowIndex }) {
      if (row == this.editing) {
        return "primary-row";
      }

      if (row.closed) {
        return "warning-row";
      }

      if (rowIndex % 2 == 0) {
        return "normal-row";
      }
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

          this.init_milestones();
        } catch (e) {
          this.loading = false;
        }
      });
    },

    async init_milestones() {
      this.items = [];
      this.editing = null;
      this.loading = true;

      let data = await this.$store.dispatch("milestone_list", this.planner_id);

      for (let one of data) {
        one.percent = one.percent || parseInt(Math.random().toFixed(2) * 100);
        this.items.push(one);
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

      this.init_milestones();
      this.editing = null;
      this.editing_form = null;
    },
    async close(milestone, value) {
      await this.$store.dispatch("milestone_update", {
        planner: this.planner_id,
        milestone: milestone._id,
        data: { closed: value }
      });

      this.init_milestones();
    },
    async del(milestone) {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      await this.$store.dispatch("milestone_destroy", {
        planner: this.planner_id,
        milestone: milestone._id
      });

      this.init_milestones();
    }
  }
};
</script>