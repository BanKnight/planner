<template>
  <el-container direction="horizontal" class="full">
    <el-container direction="vertical">
      <el-main style="padding:0">
        <el-timeline>
          <el-timeline-item
            size="large"
            icon="el-icon-plus"
            color="#469ffc"
            placement="top"
            timestamp="新的里程碑"
          >
            <el-button size="small" type="primary" icon="el-icon-plus" @click="adding = !adding"></el-button>
          </el-timeline-item>

          <el-timeline-item
            size="large"
            v-for="one in page.data"
            :key="one._id"
            placement="top"
            :timestamp="$format(one.due)"
          >
            <el-checkbox slot="dot" :value="!!one.closed" @change="close(one, $event)"></el-checkbox>

            <el-card>
              <el-button-group>
                <el-button
                  title="展开"
                  size="mini"
                  type="success"
                  class="no-border"
                  icon="el-icon-view"
                  @click="view_dailog_visible = true;current = one"
                ></el-button>

                <el-button
                  title="编辑"
                  size="mini"
                  type="primary"
                  class="no-border"
                  icon="el-icon-edit"
                  @click="edit(one)"
                ></el-button>
              </el-button-group>

              <el-divider direction="vertical" />

              <el-tag style="cursor:pointer" effect="dark" type="info" @click="edit(one)">
                {{ one.title }}
                :
                {{ one.desc }}
              </el-tag>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-main>
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

    <el-dialog title="快速添加" width="500px" :visible.sync="adding">
      <el-form label-position="top" :model="form" :rules="rules" ref="new_one">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc"></el-input>
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

        <el-form-item>
          <el-button type="primary" class="full-width" :loading="loading" @click="on_create">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="editing_dialog_visible"
      v-if="editing_dialog_visible"
      width="500px"
      :title="current.title"
    >
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
          <el-button type="danger" class="full-width" icon="el-icon-delete" @click="del(current)">删除</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="current.title"
      :visible.sync="view_dailog_visible"
      v-if="view_dailog_visible"
      width="500px"
    ></el-dialog>
  </el-container>
</template>

<script>

export default {
  path: "milestone",
  weight: 10,
  meta: {
    menu_title: "里程碑",
    menu_icon: "el-icon-s-opportunity",
    require_logined: true
  },
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
      current: null,
      editing_form: null,
      editing_dialog_visible: false,
      view_dailog_visible: false
    };
  },
  mounted()  {
    this.fetch(1);
  },
  computed: {
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
        one.percent = one.percent || parseInt(Math.random().toFixed(2) * 100);
        this.page.data.push(one);
      }
      this.loading = false;
    },

    edit(milestone)    {

      this.current = milestone;
      this.editing_form = Object.assign({}, milestone);

      this.editing_dialog_visible = true
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
    }
  }
};
</script>
