<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item
        label="小程序用户名"
        prop="nickname"
      >
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入小程序用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="小程序用户电话"
        prop="userPhone"
      >
        <el-input
          v-model="queryParams.userPhone"
          placeholder="请输入小程序用户电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="用户创建时间"
        prop="createTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择用户创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="小程序用户状态"
        prop="userStatus"
      >
        <el-select
          v-model="queryParams.userStatus"
          placeholder="请选择小程序用户状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="小程序用户名"
        align="center"
        prop="nickname"
      />
      <el-table-column
        label="小程序用户头像"
        align="center"
        prop="avatarUrl"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview
            :src="scope.row.avatarUrl"
            :width="50"
            :height="50"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="小程序用户电话"
        align="center"
        prop="userPhone"
      />
      <el-table-column
        label="用户创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="小程序用户状态"
        align="center"
        prop="userStatus"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_notice_status"
            :value="scope.row.userStatus"
          />
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改小程序用户管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="小程序用户名"
          prop="nickname"
        >
          <el-input
            v-model="form.nickname"
            placeholder="请输入小程序用户名"
          />
        </el-form-item>
        <el-form-item
          label="小程序用户头像"
          prop="avatarUrl"
        >
          <image-upload v-model="form.avatarUrl" />
        </el-form-item>
        <el-form-item
          label="小程序用户电话"
          prop="userPhone"
        >
          <el-input
            v-model="form.userPhone"
            placeholder="请输入小程序用户电话"
          />
        </el-form-item>
        <el-form-item
          label="小程序用户状态"
          prop="userStatus"
        >
          <el-radio-group v-model="form.userStatus">
            <el-radio
              v-for="dict in dict.type.sys_notice_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
} from "@/api/user/user";

export default {
  name: "User",
  dicts: ["sys_notice_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 小程序用户管理表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickname: null,
        avatarUrl: null,
        userPhone: null,
        createTime: null,
        userStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询小程序用户管理列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        nickname: null,
        avatarUrl: null,
        userPhone: null,
        createTime: null,
        userStatus: null,
        openId: null,
        unionId: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加小程序用户管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改小程序用户管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != null) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除小程序用户管理编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
