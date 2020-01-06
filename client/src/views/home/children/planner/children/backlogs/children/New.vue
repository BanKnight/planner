<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;align-content:center;margin-bottom:10px"
    >
      <el-button-group>
        <el-button icon="el-icon-s-fold" @click="folding=!folding">选项</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
      </el-button-group>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside
        width="180px"
        v-if="folding==false"
        style="margin-right:10px;padding:10px"
        class="el-card"
      >
        <el-form :model="article">
          <el-form-item label="指派:">
            <member-select v-model="article.assignee" :planner="planner_id" />
          </el-form-item>
          <el-form-item label="里程碑:">
            <milestone-select v-model="article.milestone" :planner="planner_id" />
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
        <el-input placeholder="请输入标题" v-model="article.title" clearable />
        <md-editor v-model="article.content" theme="small" :editable="true" @save="summit" />

        <el-footer style="background-color:#f0f9eb;" class="scroll-if-need">
          <el-row type="flex" justify="start" align="middle" class="full-height">
            <el-upload
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
              closable
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
  path: "new",
  weight: 10,
  meta: { require_logined: true },
  components: { MilestoneSelect, MemberSelect, MdEditor },
  data()  {
    return {
      article: {
        title: "",
        content: "",
        assignee: null,
        milestone: null,
        attachments: [],
      },
      folding: false
    };
  },
  computed: {

    root()    {
      return `/planner/${this.planner_id}/backlogs`;
    },
    planner_id()    {
      return this.$route.params.planner;
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
  methods: {
    async summit()    {
      this.article.title = this.article.title.trim();
      this.articlecontent = this.article.content;

      if (this.article.title.length == 0)      {
        this.$message.error("提交前标题不能为空");
        return;
      }
      await this.$store.dispatch("backlogs_create", {
        planner: this.planner_id,
        data: this.article
      });

      this.$message.success("创建成功");

      this.goback();
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
      console.log("close_file", file.name)

    }
  }
};
</script>

<style>
.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader .el-upload:hover {
  border-color: #409eff;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>

