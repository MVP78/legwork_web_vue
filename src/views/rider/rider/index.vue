<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item
        label="骑手编号"
        prop="riderId"
      >
        <el-input
          v-model="queryParams.riderId"
          placeholder="请输入骑手编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="骑手姓名"
        prop="riderName"
      >
        <el-input
          v-model="queryParams.riderName"
          placeholder="请输入骑手姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="骑手电话"
        prop="riderPhone"
      >
        <el-input
          v-model="queryParams.riderPhone"
          placeholder="请输入骑手电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="余额/元"
        prop="riderBalance"
      >
        <el-input
          v-model="queryParams.riderBalance"
          placeholder="请输入余额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="信誉分"
        prop="riderCreditPoints"
      >
        <el-input
          v-model="queryParams.riderCreditPoints"
          placeholder="请输入信誉分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="创建时间"
        prop="riderCreateTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.riderCreateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="骑手状态"
        prop="riderStatus"
      >
        <el-select
          v-model="queryParams.riderStatus"
          placeholder="请选择骑手状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.lw_rider_status"
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
      :data="riderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="骑手编号"
        align="center"
        prop="riderId"
      />
      <el-table-column
        label="骑手姓名"
        align="center"
        prop="riderName"
      />
      <el-table-column
        label="骑手电话"
        align="center"
        prop="riderPhone"
      />
      <el-table-column
        label="证件照片"
        align="center"
        prop="riderStudentCard"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview
            :src="scope.row.riderStudentCard"
            :width="50"
            :height="50"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="余额"
        align="center"
        prop="riderBalance"
      />
      <el-table-column
        label="信誉分"
        align="center"
        prop="riderCreditPoints"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="riderCreateTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.riderCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="骑手状态"
        align="center"
        prop="riderStatus"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.lw_rider_status"
            :value="scope.row.riderStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['rider:rider:edit']"
          >审核</el-button>
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

    <!-- 添加或修改骑手管理对话框 -->
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
        <!-- <el-form-item
          label="小程序用户编号"
          prop="userId"
        >
          <el-input
            v-model="form.userId"
            placeholder="请输入小程序用户编号"
          />
        </el-form-item>
        <el-form-item
          label="骑手姓名"
          prop="riderName"
        >
          <el-input
            v-model="form.riderName"
            placeholder="请输入骑手姓名"
          />
        </el-form-item>
        <el-form-item
          label="骑手电话"
          prop="riderPhone"
        >
          <el-input
            v-model="form.riderPhone"
            placeholder="请输入骑手电话"
          />
        </el-form-item>
        <el-form-item
          label="证件照片"
          prop="riderStudentCard"
        >
          <image-upload v-model="form.riderStudentCard" />
        </el-form-item>
        <el-form-item
          label="余额"
          prop="riderBalance"
        >
          <el-input
            v-model="form.riderBalance"
            placeholder="请输入余额"
          />
        </el-form-item>
        <el-form-item
          label="信誉分"
          prop="riderCreditPoints"
        >
          <el-input
            v-model="form.riderCreditPoints"
            placeholder="请输入信誉分"
          />
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="riderCreateTime"
        >
          <el-date-picker
            clearable
            v-model="form.riderCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item
          label="骑手状态"
          prop="riderStatus"
        >
          <el-radio-group v-model="form.riderStatus">
            <el-radio
              v-for="dict in dict.type.lw_rider_status"
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
  listRider,
  getRider,
  delRider,
  addRider,
  updateRider,
} from "@/api/rider/rider";

export default {
  name: "Rider",
  dicts: ["lw_rider_status"],
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
      // 骑手管理表格数据
      riderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        riderId: null,
        userId: null,
        riderName: null,
        riderPhone: null,
        riderStudentCard: null,
        riderBalance: null,
        riderCreditPoints: null,
        riderCreateTime: null,
        riderStatus: null,
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
    /** 查询骑手管理列表 */
    getList() {
      this.loading = true;
      listRider(this.queryParams).then((response) => {
        this.riderList = response.rows;
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
        riderId: null,
        userId: null,
        riderName: null,
        riderPhone: null,
        riderStudentCard: null,
        riderBalance: null,
        riderCreditPoints: null,
        riderCreateTime: null,
        riderStatus: null,
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
      this.ids = selection.map((item) => item.riderId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加骑手管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const riderId = row.riderId || this.ids;
      getRider(riderId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "审核骑手";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.form.riderId != null) {
            updateRider(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRider(this.form).then((response) => {
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
      const riderIds = row.riderId || this.ids;
      this.$modal
        .confirm('是否确认删除骑手管理编号为"' + riderIds + '"的数据项？')
        .then(function () {
          return delRider(riderIds);
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
        "rider/rider/export",
        {
          ...this.queryParams,
        },
        `rider_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
