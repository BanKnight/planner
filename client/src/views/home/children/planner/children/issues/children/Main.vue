<template>
  <el-container direction="vertical" class="full">
    <el-row type="flex" justify="space-between" align="middle" style="margin-bottom:10px;">
      <el-input
        class="search"
        placeholder="输入搜索关键字"
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
        @clear="on_search"
        @keydown.enter.native.stop="on_search"
      >
        <el-button slot="append" icon="el-icon-search" @click="on_search"></el-button>
      </el-input>
    </el-row>

    <el-row
      v-if="tags.length > 0"
      type="flex"
      style="flex-wrap: wrap;margin-bottom:10px;background-color:white;border-radius:4px;border: 1px solid #EBEEF5;padding:10px"
    >
      <el-checkbox v-for="one in tags" v-model="one.checked" :key="one.title">{{ one.title }}</el-checkbox>
    </el-row>

    <el-dialog title="快速添加" :visible.sync="add_form_visible">
      <el-form
        label-position="left"
        label-width="60px"
        :model="add_form"
        :rules="rules"
        ref="add_form"
      >
        <el-form-item label="标题:" prop="title">
          <el-input placeholder="请输入标题" v-model="add_form.title" clearable tabindex="1" />
        </el-form-item>
        <el-form-item label="指派:" prop="assignee">
          <member-select v-model="add_form.assignee" :planner="planner_id" tabindex="2" />
        </el-form-item>
        <el-form-item label="里程碑:" prop="milestone">
          <milestone-select v-model="add_form.milestone" :planner="planner_id" tabindex="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add_one">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      ref="data"
      v-loading="loading"
      :data="page.data"
      style="width: 100%"
      height="100%"
      size="small"
      :stripe="true"
      border
      row-key="_id"
      :row-class-name="row_class"
    >
      <el-table-column width="38">
        <template slot="header">
          <i class="el-icon-check"></i>
        </template>

        <template slot-scope="scope">
          <el-checkbox :value="!!scope.row.closed" @change="close(scope.row, $event)"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title">
        <template slot-scope="scope">
          <router-link
            :to="`${root}/detail/${scope.row._id}`"
            class="el-link el-link--default"
          >{{ scope.row.title }}</router-link>
        </template>
      </el-table-column>

      <el-table-column label="标签" width="200">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" type="danger" size="small">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="指派给" width="120">
        <template slot-scope="scope">
          <member-preview :value="scope.row.assignee" size="mini" :planner="planner_id" />
        </template>
      </el-table-column>

      <el-table-column label="里程碑" width="120">
        <template slot-scope="scope">
          <milestone-preview :value="scope.row.milestone" size="mini" :planner="planner_id" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" align="right" fixed="right">
        <template slot="header">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="add_form_visible = true"
          ></el-button>
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="destroy(scope.row)"></el-button>
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
</template>

<script>
import MemberPreview from "@/components/MemberPreview";
import MilestonePreview from "@/components/MilestonePreview";

import MemberSelect from "@/components/MemberSelect";
import MilestoneSelect from "@/components/MilestoneSelect";

export default {
  path: "",
  weight: -1,
  meta: { require_logined: true },
  components: {
    MemberPreview,
    MilestonePreview,
    MilestoneSelect,
    MemberSelect
  },

  data()  {
    return {
      loading: false,
      page: {
        curr: 1, //当前页码
        count: 1, //总页数
        total: 0, //条目总数
        data: [] //当前页的数据
      },
      add_form_visible: false,
      add_form: {
        title: "",
        assignee: null,
        milestone: null
      },
      tags: [],
      keyword: ""
    };
  },
  mounted()  {
    this.fetch(1);
  },
  computed: {
    root()    {
      return `/planner/${this.planner_id}/issues`;
    },
    milestone()    {
      return `/planner/${this.planner_id}/milestone`;
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    rules()    {
      return {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, message: "长度过短", trigger: "blur" }
        ]
      };
    }
  },
  beforeRouteEnter(to, from, next)  {
    next(vm =>    {
      if (from.fullPath != "/")      {
        vm.from = from.fullPath;
      }
    });
  },
  methods: {
    async fetch(page)    {
      this.loading = true;

      const page_info = await this.$store.dispatch("issues_list", {
        planner: this.planner_id,
        params: {
          curr: page, //页码
          keyword: this.keyword
        }
      });

      this.page.curr = page_info.curr;
      this.page.count = page_info.count;
      this.page.total = page_info.total;

      this.page.data = [];

      for (let one of page_info.data)      {
        this.page.data.push(one);
      }

      this.loading = false;
    },
    row_class({ row, rowIndex })    {
      let classes = [];

      if (row.closed)      {
        classes.push("closed-row");
      }

      if (rowIndex % 2 == 0)      {
        classes.push("normal-row");
      }

      return classes.concat(" ");
    },
    async destroy(item)    {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await this.$store.dispatch("issues_destroy", {
        planner: this.planner_id,
        issue: item._id
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      this.fetch(this.page.curr);
    },
    async close(item, value)    {
      await this.$store.dispatch("issues_update", {
        planner: this.planner_id,
        issue: item._id,
        data: { closed: value }
      });

      this.fetch(this.page.curr);
    },
    on_search()    {
      this.fetch(1);
    },

    add_one()    {
      this.$refs.add_form.validate(async valid =>      {
        if (!valid)        {
          return false;
        }

        this.add_form.title = this.add_form.title.trim();

        await this.$store.dispatch("issues_create", {
          planner: this.planner_id,
          data: this.add_form
        });

        this.$message.success("创建成功");

        this.add_form_visible = false;
        this.add_form.title = "";
        this.add_form.assignee = null;
        this.add_form.milestone = null;

        this.fetch(1);
      });
    }
  }
};
</script>
