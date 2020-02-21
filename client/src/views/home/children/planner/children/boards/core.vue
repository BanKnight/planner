<template>
  <el-container class="full" direction="horizontal">
    <el-aside width="150px">
      <el-table
        :data="groups"
        style="width: 100%"
        height="100%"
        size="mini"
        class="el-card"
        :border="false"
        :row-class-name="row_class"
        row-key="_id"
      >
        <el-table-column>
          <template slot="header">
            <el-button
              icon="el-icon-plus"
              type="success"
              size="mini"
              title="添加分组"
              @click="add_form_visible = true"
            ></el-button>
            <el-button icon="el-icon-edit" size="mini" title="编辑" @click="begin_edit"></el-button>
          </template>

          <template slot-scope="scope">
            <router-link
              v-if="!is_editing"
              :to="`${root}/detail/${scope.row._id}`"
              class="el-link el-link--default"
            >
              <i v-if="scope.row.mode == 'normal'" class="el-icon-s-grid"></i>
              <i v-else class="el-icon-s-data"></i>
              {{ scope.row.title }}
            </router-link>

            <template v-else>
              <el-tag
                :disable-transitions="true"
                effect="dark"
                :closable="true"
                @close="destroy_group(scope.row)"
              >{{ scope.row.title }}</el-tag>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-aside>

    <el-dialog title="快速添加" :visible.sync="add_form_visible">
      <el-form label-position="left" :model="add_form" :rules="rules" ref="add_form">
        <el-form-item prop="title">
          <el-input autofocus placeholder="请输入标题" v-model="add_form.title" clearable />
        </el-form-item>
        <el-form-item>
          <el-radio v-model="add_form.mode" label="normal" border>
            <i class="el-icon-s-grid">普通模式:工单不会进行流程间的迁移,仅有状态变化</i>
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="add_form.mode" label="workflow" border>
            <i class="el-icon-s-data">工作流模式:工单在流程间迁移</i>
          </el-radio>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add_group">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-container style="margin-left:10px">
      <router-view />
    </el-container>
  </el-container>
</template>

<script>

export default {
  path: "boards",
  weight: 8,
  meta: {
    menu_title: "工单",
    menu_icon: "el-icon-s-cooperation",
    require_logined: true
  },
  data()  {
    return {
      groups: [],
      is_editing: false,
      add_form_visible: false,
      add_form: {
        title: "",
        mode: "normal"
      },
    };
  },
  computed: {
    default_active()    {
      if (this.groups.length > 0)
      {
        return this.groups[0]._id
      }
      return null
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    root()    {
      return `/planner/${this.planner_id}/boards`;
    },
    rules()    {
      return {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
        ]
      };
    }
  },
  mounted()  {
    this.refresh();
  },
  methods: {
    async refresh()    {
      let data = await this.$store.dispatch("boards_group_list", {
        planner: this.planner_id
      });

      this.groups = [];
      for (let one of data)      {
        this.groups.push(one); //全部都是id
      }

      if (this.groups.length == 0)
      {
        return
      }

      const group = this.groups[0]

      if (this.$route.params.group == null)
      {
        this.$router.push(`${this.root}/detail/${group._id}`);
      }
    },
    begin_edit()
    {
      this.is_editing = !this.is_editing;

      console.log("this is editing", this.is_editing)
    },
    add_group()
    {
      this.$refs.add_form.validate(async valid =>      {
        if (!valid)        {
          return false;
        }
        this.add_form.title = this.add_form.title.trim();

        let group = await this.$store.dispatch("boards_create_group", {
          planner: this.planner_id,
          data: this.add_form
        });

        this.groups.push(group);

        this.active = group.id

        this.$message.success("创建成功");

        this.add_form_visible = false;
        this.add_form.title = "";

        this.$router.push(`${this.root}/detail/${group._id}`);

        // this.refresh();
      });
    },
    destroy_group(group)
    {
      this.$confirm("一旦删除分组，不可恢复，是否删除?", group.title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () =>       
        {
          await this.$store.dispatch("boards_destroy_group", {
            planner: this.planner_id,
            group: group._id
          });

          let index = this.groups.indexOf(group)

          this.groups.splice(index, 1);
        })
        .catch(() => { });
    },
    row_class({ row, rowIndex })    {
      let classes = [];

      if (row._id == this.$route.params.group)      {
        classes.push("primary-row");
      }

      if (rowIndex % 2 == 0)      {
        classes.push("normal-row");
      }

      return classes.concat(" ");
    }
  }
};
</script>

