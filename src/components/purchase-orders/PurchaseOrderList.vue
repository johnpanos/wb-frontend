<template>
  <el-container direction="vertical">
    <h1>Purchase Orders</h1>
    <el-table
        :data="purchaseOrders.content"
        border
        style="width: 100%; margin-top: 20px;"
        empty-text="No Purchase Orders Places">
      <el-table-column
        sortable
        label="ASAP"
        width="60">
        <template slot-scope="scope">
          {{ scope.row.asap ? 'YES' : 'NO' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="partName"
        label="Part Name"
        width="160">
      </el-table-column>
      <el-table-column
        sortable
        prop="partName"
        label="Part Name">
      </el-table-column>
      <el-table-column
        prop="partNumber"
        label="Part Number"
        width="160">
      </el-table-column>
      <el-table-column
        label="Status"
        width="160">
        <template slot-scope="scope">
          {{ scope.row.status.split('_').join(' ') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="Quantity Needed"
        width="160">
      </el-table-column>
      <el-table-column
        label="Cost Per Item"
        width="160">
        <template slot-scope="scope">
          ${{ scope.row.costPerItem }}
        </template>
      </el-table-column>
      <el-table-column
        label="Total Cost">
        <template slot-scope="scope">
          ${{ scope.row.costPerItem * scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="needByDate"
        label="Need By">
      </el-table-column>
      <el-table-column
        sortable
        prop="dateOrdered"
        label="Ordered On">
      </el-table-column>
      <el-table-column
        label="Ordered By">
        <template slot-scope="scope">
          {{ scope.row.user.firstName + " " + scope.row.user.lastName }}
        </template>
      </el-table-column>
      <el-table-column
        label="Operations">
        <template slot-scope="scope">
          <el-button type="text">View</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 10px;">
      <el-pagination
        layout="prev, pager, next"
        :total="purchaseOrders.totalElements"
        :page-size="purchaseOrders.size"
        :current-page.sync="page">
      </el-pagination>
    </el-row>
  </el-container>
</template>

<script>
import { PurchaseOrderService } from '@/common/api';
export default {
  data() {
    return {
      purchaseOrders: [],
      page: 0
    }
  },
  methods: {
    refreshPurchaseOrders() {
      PurchaseOrderService.getPurchaseOrders(25, this.page - 1).then(response => {
        this.purchaseOrders = response.data;
      });
    }
  },
  mounted() {
    this.refreshPurchaseOrders();
  },
  watch: {
    page() {
      this.refreshPurchaseOrders();
    }
  }
}
</script>

<style>

</style>
