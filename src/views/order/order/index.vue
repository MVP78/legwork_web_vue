<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item
        label="订单编号"
        prop="orderId"
      >
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="订单类型"
        prop="orderType"
      >
        <el-select
          v-model="queryParams.orderType"
          placeholder="请选择订单类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.lw_order_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="订单金额/元"
        prop="orderAmount"
      >
        <el-input
          v-model="queryParams.orderAmount"
          placeholder="请输入订单金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="下单时间"
        prop="orderTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.orderTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择下单时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="订单状态"
        prop="orderStatus"
      >
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择订单状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.lw_order_status"
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
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="订单编号"
        align="center"
        prop="orderId"
      />
      <el-table-column
        label="订单类型"
        align="center"
        prop="orderType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.lw_order_type"
            :value="scope.row.orderType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="订单金额/元"
        align="center"
        prop="orderAmount"
      />
      <el-table-column
        label="下单时间"
        align="center"
        prop="orderTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        align="center"
        prop="orderStatus"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.lw_order_status"
            :value="scope.row.orderStatus"
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
            @click="selectOrderData(scope.row)"
          >查看详情</el-button>
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

    <!-- 添加或修改订单管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >

      <el-descriptions
        style="margin-bottom: 20px;"
        title="代拿信息"
        direction="vertical"
        :column="4"
        border
      >
        <el-descriptions-item label="订单编号">{{form.lwOrder.orderId}}</el-descriptions-item>
        <el-descriptions-item label="订单时间">{{form.lwOrder.orderTime}}</el-descriptions-item>
        <el-descriptions-item label="订单金额/元">{{form.lwOrder.orderAmount}}</el-descriptions-item>
        <el-descriptions-item
          label="代拿类型"
          v-if="form.lwOrder.orderType === '0'"
        >快递代拿</el-descriptions-item>
        <el-descriptions-item
          label="代拿类型"
          v-if="form.lwOrder.orderType === '1'"
        >外卖代拿</el-descriptions-item>
        <el-descriptions-item
          label="快递尺寸"
          v-if="form.lwCharges"
        >{{form.lwCharges.chargesSize}}</el-descriptions-item>
        <el-descriptions-item label="代拿地址">{{form.lwOrder.orderPickupAddress}}</el-descriptions-item>
        <el-descriptions-item label="预约送达时间">
          {{form.lwOrder.orderExpectedTime}}
        </el-descriptions-item>
        <el-descriptions-item label="取件内容">{{form.lwOrder.orderContent}}</el-descriptions-item>
        <el-descriptions-item label="备注信息">{{form.lwOrder.orderNotes}}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions
        style="margin-bottom: 20px;"
        title="收货人信息"
        direction="vertical"
        :column="4"
        border
      >
        <el-descriptions-item label="姓名">{{form.lwReceiver.receiverName}}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{form.lwReceiver.receiverPhone}}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{form.lwReceiver.receiverAddress}}</el-descriptions-item>

      </el-descriptions>
      <el-descriptions
        style="margin-bottom: 20px;"
        title="骑手信息"
        direction="vertical"
        :column="4"
        border
        v-if="form.lwRider"
      >
        <el-descriptions-item label="姓名">{{form.lwRider.riderName}}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{form.lwRider.riderPhone}}</el-descriptions-item>

      </el-descriptions>
      <el-descriptions
        title="送达信息"
        style="margin-bottom: 20px;"
        direction="vertical"
        :column="4"
        border
        v-if="form.lwOrder.orderImage"
      >
        <el-descriptions-item label="送达图片"><img
            :src="form.lwOrder.orderImage"
            alt=""
            style="height: 400px"
          ></el-descriptions-item>

        <el-descriptions-item
          label="订单评价"
          v-if="form.lwOrder.orderEvaluate"
        >{{ getStatusText(form.lwOrder.orderEvaluate) }}</el-descriptions-item>

      </el-descriptions>

    </el-dialog>
  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
  getOrderDetil,
} from "@/api/order/order";

export default {
  name: "Order",
  dicts: ["lw_order_status", "lw_order_type"],
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
      // 订单管理表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        orderType: null,
        orderAmount: null,
        orderTime: null,
        orderStatus: null,
      },
      // 表单参数
      form: {
        lwCharges: {
          chargesAmount: 10,
          chargesCreateTime: "2024-03-20",
          chargesId: 2,
          chargesIntroduce: "小件",
          chargesSize: "小",
          chargesStatus: "0",
        },
        lwOrder: {
          chargesId: 2,
          orderAmount: 10,
          orderContent: null,
          orderEvaluate: "4",
          orderExpectedTime: "2024-03-13 00:00:00",
          orderId: "40894995301002569509832",
          orderImage: null,
          orderNotes: "麻烦快一点",
          orderPickupAddress: "驿站",
          orderStatus: "5",
          orderTime: "2024-03-20",
          orderType: "0",
          receiverId: 2,
          riderId: 1,
          userId: 1,
        },
        lwReceiver: {
          receiverAddress: "a302",
          receiverCreateTime: "2024-03-20",
          receiverDefault: "0",
          receiverId: 2,
          receiverName: "小李",
          receiverPhone: "15521917952",
          receiverStatus: "0",
          userId: 1,
        },
        lwRider: {
          riderBalance: 0,
          riderCreateTime: "2024-03-20",
          riderCreditPoints: 80,
          riderId: 1,
          riderName: "测试",
          riderPhone: "15521917952",
          riderStatus: "2",
          riderStudentCard: "证件照片",
          userId: 2,
        },
      },
      // 表单校验
      rules: {},
      //订单评价
      orderEvaluateList: ["很差", "较差", "一般", "良好"],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单管理列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows;
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
        orderId: null,
        userId: null,
        riderId: null,
        receiverId: null,
        chargesId: null,
        orderType: null,
        orderPickupAddress: null,
        orderContent: null,
        orderExpectedTime: null,
        orderNotes: null,
        orderImage: null,
        orderEvaluate: null,
        orderAmount: null,
        orderTime: null,
        orderStatus: null,
      };
      this.resetForm("form");
    },
    //根据订单状态获取标题
    getStatusText(status) {
      const index = parseInt(status, 10); // 将字符串转换为整数

      return this.orderEvaluateList[index - 1] || "未知状态";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams);

      this.queryParams.pageNum = 1;
      this.getList();
    },
    selectOrderData(row) {
      getOrderDetil(row.orderId).then((res) => {
        console.log(res.data);
        this.form = res.data;
        this.open = true;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.orderId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const orderId = row.orderId || this.ids;
      getOrder(orderId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.orderId != null) {
            updateOrder(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then((response) => {
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
      const orderIds = row.orderId || this.ids;
      this.$modal
        .confirm('是否确认删除订单管理编号为"' + orderIds + '"的数据项？')
        .then(function () {
          return delOrder(orderIds);
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
        "system/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
