<template>
  <el-container direction="vertical" class="full">
    <el-dialog title="快速添加" width="500px" :visible.sync="adding">
      <el-form label-position="top" :model="form" :rules="rules" ref="new_one">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="due">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.due"
            value-format="timestamp"
            class="full-width"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="full-width" :loading="loading" @click="on_create">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="editing_dialog_visible"
      v-if="editing_dialog_visible"
      width="600px"
      :title="current.title"
    >
      <el-container>
        <el-aside width="250px" style="border-right: 1px solid #e4e7ed;padding-right:10px">
          <el-form label-position="top" :model="editing_form" :rules="rules" ref="new_one">
            <el-form-item label="标题" prop="title">
              <el-input v-model="editing_form.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="editing_form.desc"></el-input>
            </el-form-item>

            <el-form-item label="截止时间" prop="due">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editing_form.due"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                class="full-width"
                icon="el-icon-upload"
                :loading="loading"
                @click="finish_edit"
              >确定修改</el-button>
            </el-form-item>

            <el-form-item>
              <el-button
                type="danger"
                class="full-width"
                icon="el-icon-delete"
                @click="del(current)"
              >删除</el-button>
            </el-form-item>
          </el-form>
        </el-aside>

        <el-main>
          <el-tabs class="full">
            <el-tab-pane label="需求">
              <el-table
                :data="view.backlogs"
                style="width: 100%"
                :show-header="false"
                size="small"
                row-key="_id"
              >
                <el-table-column label="标题" prop="title">
                  <template slot-scope="scope">
                    <router-link
                      :to="`${root}/backlogs/detail/${scope.row._id}`"
                      class="el-link el-icon-s-opportunity el-link--default"
                    >{{ scope.row.title }}</router-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="工单">
              <el-table
                :data="view.notes"
                style="width: 100%"
                :show-header="false"
                size="small"
                row-key="_id"
              >
                <el-table-column label="标题" prop="title">
                  <template slot-scope="scope">
                    <router-link
                      :to="`${root}/boards`"
                      class="el-link el-icon-document el-link--default"
                    >{{ scope.row.title }}</router-link>
                  </template>
                </el-table-column>

                <el-table-column label="截止日期" width="130">
                  <template slot-scope="scope">
                    <date-preview :value="scope.row.stop" />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="问题">
              <el-table
                :data="view.issues"
                style="width: 100%"
                :show-header="false"
                size="small"
                row-key="_id"
              >
                <el-table-column label="标题" prop="title">
                  <template slot-scope="scope">
                    <router-link
                      :to="`${root}/issues/detail/${scope.row._id}`"
                      class="el-link el-icon-s-opportunity el-link--default"
                    >{{ scope.row.title }}</router-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-dialog>

    <el-table
      v-loading="loading"
      :data="page.data"
      style="width: 100%"
      height="100%"
      size="small"
      :stripe="true"
      :row-class-name="row_class"
      row-key="_id"
    >
      <el-table-column width="80">
        <template slot="header">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="adding = !adding"></el-button>
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.closed"
            title="关闭或者打开"
            active-color="#ff4949"
            inactive-color="#13ce66"
            @change="close(scope.row, $event)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="200" label="标题" prop="title">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="edit(scope.row)">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>

      <el-table-column width="120" label="日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ $format(scope.row.due) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" prop="desc">
        <template slot-scope="scope">
          <span @click="edit(scope.row)">{{ scope.row.desc }}</span>
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
</template>

<script>

import DatePreview from "@/components/DatePreview";

export default {
  path: "milestone",
  weight: 10,
  meta: {
    menu_title: "里程碑",
    menu_icon: "el-icon-s-opportunity",
    require_logined: true
  },
  components: { DatePreview },
  data()  {
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
      view: {
        backlogs: [],
        notes: [],
        issues: [],
      },
      current: null,
      editing_form: null,
      editing_dialog_visible: false,
    };
  },
  mounted()  {
    this.fetch(1);
  },
  computed: {
    root()    {
      return `/planner/${this.planner_id}`;
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    rules()    {
      return {
        title: [
          {
            type: "string",
            required: true,
            message: "请输入标题",
            trigger: "blur"
          },
          { min: 1, message: "长度过短", trigger: "blur" }
        ],
        due: [
          {
            type: "date",
            required: true,
            message: "请输入截止时间",
            trigger: "blur"
          }
        ]
      };
    }
  },
  methods: {
    row_class({ row, rowIndex })    {
      let classes = [];

      if (row == this.current)      {
        classes.push("primary-row");
      }

      if (row.closed)      {
        classes.push("closed-row");
      }

      if (rowIndex % 2 == 0)      {
        classes.push("normal-row");
      }
      return classes.concat(" ");
    },
    on_create()    {
      this.$refs.new_one.validate(async valid =>      {
        if (!valid)        {
          return false;
        }
        this.loading = true;

        try        {
          await this.$store.dispatch("milestone_create", {
            planner: this.planner_id,
            data: this.form
          });

          this.adding = false;
          this.loading = false;

          this.fetch(1);
        } catch (e)        {
          this.loading = false;
        }
      });
    },

    async fetch(page)    {
      this.current = null;
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

      for (let one of page_info.data)      {
        one.closed = !!one.closed
        this.page.data.push(one);
      }
      this.loading = false;
    },

    edit(milestone)    {

      this.current = milestone;
      this.editing_form = Object.assign({}, milestone);

      this.editing_dialog_visible = true

      this.look_about(milestone)
    },
    async finish_edit()    {

      await this.$store.dispatch("milestone_update", {
        planner: this.planner_id,
        milestone: this.current._id,
        data: this.editing_form
      });

      this.editing_dialog_visible = false
      this.current = null;
      this.editing_form = null;

      this.fetch(this.page.curr);
    },
    async close(milestone, value)    {

      if (value)
      {
        try
        {
          await this.$confirm("注意：关闭后，相关内容都会被关闭", milestone.title, {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          });
        }
        catch (e)        {
          milestone.closed = !value
          return
        }
      }

      await this.$store.dispatch("milestone_update", {
        planner: this.planner_id,
        milestone: milestone._id,
        data: { closed: value }
      });

      this.fetch(this.page.curr);
    },
    async del(milestone)    {
      await this.$confirm(milestone.title, "是否确认删除?", {
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

      this.editing_dialog_visible = false
      this.current = null;
      this.editing_form = null;

      this.fetch(this.page.curr);
    },
    async look_about(milestone)
    {
      this.current = milestone

      const data = await this.$store.dispatch("milestone_about", {
        planner: this.planner_id,
        milestone: milestone._id
      });

      this.view = data
    }
  }
};
</script>
