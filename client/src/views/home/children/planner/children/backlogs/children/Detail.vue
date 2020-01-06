<template>
  <el-container class="full">
    <el-header height="auto" style="padding:0;margin-bottom:10px">
      <template v-if="editing">
        <el-button-group>
          <el-button icon="el-icon-close" @click="reload_curr">取消</el-button>
          <el-button type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
        </el-button-group>
      </template>

      <template v-else>
        <el-button-group>
          <el-button icon="el-icon-s-fold" @click="folding=!folding">选项</el-button>
          <el-button icon="el-icon-edit" @click="editing = !editing">编辑</el-button>
        </el-button-group>
      </template>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside
        width="180px"
        v-if="folding==false || editing == true"
        style="margin-right:10px;padding:10px"
        class="el-card"
      >
        <el-form :model="article">
          <el-form-item label="指派:">
            <member-select v-model="article.assignee" :planner="planner_id" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="里程碑:">
            <milestone-select
              v-model="article.milestone"
              :planner="planner_id"
              :disabled="!editing"
            />
          </el-form-item>

          <!-- <el-form-item label="标签:">
            <el-select
              v-model="extra.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
      </el-aside>

      <el-container class="el-card" direction="vertical">
        <div v-if="!editing" style="text-align:center;">
          <h2>{{article.title}}</h2>
        </div>
        <el-input v-else placeholder="请输入标题" v-model="article.title" clearable></el-input>

        <md-editor
          v-model="article.content"
          theme="small"
          :editable="editing"
          :planner="planner_id"
        />

        <el-footer
          style="background-color:#f0f9eb;"
          class="scroll-if-need el-card"
          v-if="article.attachments.length > 0 || editing"
        >
          <el-row type="flex" justify="start" align="middle" class="full-height">
            <el-upload
              v-if="editing"
              class="upload-demo"
              :show-file-list="false"
              :action="upload_url"
              multiple
              with-credentials
              :on-success="on_upload_ok"
            >
              <el-button size="small" icon="el-icon-plus" style="margin-right:5px">上传附件</el-button>
            </el-upload>

            <el-tag
              v-for="one in article.attachments"
              class="el-icon-document"
              :key="one._id"
              :closable="editing"
              type="info"
              effect="plain"
              @click="preview_file(one)"
              @close="close_file(one)"
            >{{one.name}}</el-tag>
          </el-row>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import MemberSelect from "@/components/MemberSelect";
import MilestoneSelect from "@/components/MilestoneSelect";
import MdEditor from "@/components/MdEditor";

export default {
  path: "detail/:backlog",
  weight: 10,
  meta: { require_logined: true },
  components: { MilestoneSelect, MemberSelect, MdEditor },
  inject: ["reload_curr"],
  data()  {
    return {
      article: {
        title: "",
        content: "",
        assignee: null,
        milestone: null,
        attachments: [],
      },
      editing: false,
      deleting: [],
      folding: true
    };
  },
  computed: {

    fold_icon()    {
      if (this.folding == false)      {
        return "el-icon-s-fold";
      }
      return "el-icon-s-unfold";
    },
    root()    {
      return `/planner/${this.planner_id}/backlogs`;
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    id()    {
      return this.$route.params.backlog;
    },
    upload_url()    {
      return `${this.$http.defaults.baseURL}/api/planner/${this.planner_id}/pan?path=/.private`;
    },
  },
  beforeRouteEnter(to, from, next)  {
    next(vm =>    {
      if (from.fullPath != "/")      {
        vm.from = from.fullPath;
      }
    });
  },
  mounted()  {
    this.fetch();
  },

  methods: {
    async fetch()    {
      let article = await this.$store.dispatch("backlogs_detail", {
        planner: this.planner_id,
        backlog: this.id
      });

      this.article = article;
    },
    async summit()    {
      let title = this.article.title.trim();

      if (title.length == 0)      {
        this.$message.error("请输入完整的标题后再提交");

        return;
      }

      for (let file of this.deleting)
      {
        this.$store.dispatch("pan_destroy_priavte", {
          planner: this.planner_id,
          name: file.name,
        })
      }

      this.deleting = []

      await this.$store.dispatch("backlogs_update", {
        planner: this.planner_id,
        backlog: this.id,
        data: this.article
      });

      this.$message.success("修改成功");

      this.editing = false;
    },
    goback()    {
      if (this.from)      {
        this.$router.push(this.from);
      } else      {
        this.$router.push(this.root);
      }
    },
    on_upload_ok(response)    {
      this.article.attachments = this.article.attachments || []

      this.article.attachments.push(response)

      console.log("upload ok", response)
    },
    preview_file(file)
    {
      console.log("preview file", file.name)
    },
    close_file(file)
    {
      let index = this.article.attachments.indexOf(file)
      if (file < 0)
      {
        return
      }

      this.article.attachments.slice(index, 1)

      this.deleting.push(file)
    }
  }
};
</script>

