<template>
  <layout>
    <el-container class="full">
      <el-header height="auto" style="padding:0;margin-bottom:10px">
        <el-row type="flex" justify="space-between" align="middle">
          <span>
            <template v-for="(one,index) in curr_path_array">
              <el-tag
                type="success"
                size="mini"
                effect="dark"
                v-if="index != (curr_path_array.length - 1)"
                :key="one.path"
                @click="$router.push(`${root}?path=${one.path}`)"
                style="cursor:pointer"
              >
                {{one.name}}
                <i class="el-icon-arrow-right" />
              </el-tag>

              <el-tag type="danger" size="mini" effect="dark" v-else :key="one.path">{{one.name}}</el-tag>
            </template>
          </span>

          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-upload"
              @click="upload.visible = true"
            >上传</el-button>
            <el-button size="mini" icon="el-icon-folder-add" @click="mkdir">新建</el-button>
          </el-button-group>
        </el-row>

        <el-dialog title="文件上传" :visible.sync="upload.visible">
          <el-upload drag :action="upload_url" multiple with-credentials :file-list="upload.files">
            <i class="el-icon-upload"></i>

            <div class="el-upload__tip" slot="tip">大小不能超过20m</div>
          </el-upload>
        </el-dialog>

        <el-dialog title="图片查看" :visible.sync="preview.visible" class="scroll-if-need full">
          <el-image v-if="preview.url" :src="preview.url"></el-image>
        </el-dialog>
      </el-header>

      <el-table
        :data="children"
        size="mini"
        style="width: 100%"
        height="100%"
        border
        v-loading="loading"
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

        <el-table-column label="名称">
          <template slot-scope="scope">
            <i class="el-icon-folder" v-if="scope.row.directory">
              <router-link
                :to="`${root}?path=${scope.row.path}`"
                class="el-link el-link--default"
              >{{scope.row.name}}</router-link>
            </i>
            <i
              class="el-icon-picture el-link el-link--default"
              v-else-if="scope.row.ext== '.png' || scope.row.ext== '.jpg' || scope.row.ext== '.gif'"
              @click="watch_img(scope.row)"
            >{{scope.row.name}}</i>
            <i class="el-icon-document" v-else>{{scope.row.name}}</i>
          </template>
        </el-table-column>

        <el-table-column label="大小" width="130">
          <template slot-scope="scope" v-if="!scope.row.directory">{{filesize(scope.row.size)}}</template>
        </el-table-column>

        <el-table-column label="更新时间" width="130">
          <template slot-scope="scope">
            <i v-if="scope.row.updated" class="el-icon-time">{{ $format(scope.row.updated) }}</i>
            <el-tag v-else>无</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="作者" width="130">
          <template slot-scope="scope">
            <member-preview :value="scope.row.author" size="mini" :planner="planner_id" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="right" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" icon="el-icon-edit" @click="destroy(scope.row)"></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="destroy(scope.row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
  </layout>
</template>

<script>
import MemberPreview from "@/components/MemberPreview";
import filesize from "file-size";
import path from "path";
import layout from "../layout";

export default {
  path: "pan",
  weight: 4,
  meta: {
    menu_title: "文件",
    menu_icon: "el-icon-files",
    require_logined: true
  },
  components: { layout, MemberPreview },
  data()  {
    return {
      curr: null,
      children: [],
      loading: false,
      upload: { visible: false, files: [] },
      preview: { visible: false, url: "" }
    };
  },
  computed: {
    root()    {
      return `/planner/${this.planner_id}/pan`;
    },
    curr_path()    {
      return this.$route.query.path || "/";
    },
    curr_path_array()    {
      let array = [];

      let target = this.curr_path;

      for (let i = 0; i < 25; ++i)      {
        let parent = path.dirname(target);

        let name = path.basename(target);

        if (parent == target)        {
          name = "网盘";
        }

        array.unshift({
          path: target,
          name
        });

        if (parent == target)        {
          break;
        }

        target = parent;
      }

      return array;
    },
    upload_url()    {
      return `${this.$http.defaults.baseURL}/api/planner/${this.planner_id}/pan?path=${this.curr_path}`;
    },
    planner_id()    {
      return this.$route.params.planner;
    }
  },
  watch: {
    curr_path()    {
      // console.log("query changed");
      this.fetch();
    },
    "upload.visible": function()    {
      this.fetch();
    }
  },
  mounted()  {
    this.fetch();
  },
  methods: {
    async fetch()    {
      this.loading = true;
      let resp = await this.$store.dispatch("pan_list", {
        planner: this.planner_id,
        params: {
          path: this.curr_path
        }
      });

      this.loading = false;
      this.curr = resp.file;
      this.children = resp.children;
    },

    async mkdir()    {
      let resp = await this.$prompt("文件夹的名称", "提示", {
        confirmButtonText: "确定"
      });

      await this.$store.dispatch("pan_mkdir", {
        planner: this.planner_id,
        data: {
          path: this.curr_path,
          name: resp.value
        }
      });

      this.$message({
        type: "success",
        message: `创建成功`
      });

      this.fetch();
    },
    watch_img(file)    {
      this.preview.visible = true;
      this.preview.url = `${this.$http.defaults.baseURL}/public/upload/${this.planner_id}/${file.res}`;
    },
    async destroy(file)    {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await this.$store.dispatch("pan_destroy", {
        planner: this.planner_id,
        data: {
          path: this.curr_path,
          name: file.name
        }
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      this.fetch();
    },
    filesize(number)    {
      return filesize(number).human();
    }
  }
};
</script>