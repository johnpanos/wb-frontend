<template>
  <el-container v-loading="loading">
    <div class="purchase-order-sidebar" v-if="purchaseOrder != null">
      <div class="status-title">
        <p class="status-title-bold">Current Status</p>
        <p class="status-title-right">Last updated {{ lastUpdatedText }}</p>
      </div>
      <div class="status" v-bind:style="{ backgroundColor: statusBackgroundColor }">
        <p>{{ removeUnderscores(purchaseOrder.status) }}</p>
      </div>
      <div>
        <div v-if="purchaseOrder.part">
          <sidebar-item label="Location">
            {{ purchaseOrder.part.location.name }}-{{ purchaseOrder.part.sublocation }}
          </sidebar-item>
          <sidebar-item label="Vendor">
            <p v-for="vendorInfo in purchaseOrder.part.vendorInformation" v-bind:key="vendorInfo.id">{{ vendorInfo.vendor.name }}: {{ vendorInfo.partNumber }}</p>
          </sidebar-item>
        </div>
        <sidebar-item label="Ordered By">
          {{ purchaseOrder.user.firstName }} {{ purchaseOrder.user.lastName }}
        </sidebar-item>
        <sidebar-item label="Updated By">
          {{ purchaseOrder.lastUpdatedBy }}
        </sidebar-item>
      </div>
    </div>
    <div class="purchase-order-main" v-if="purchaseOrder != null">
      <el-menu mode="horizontal" menu-trigger="click">
        <el-submenu index="2">
          <template slot="title">Change Status</template>
          <el-menu-item v-for="status in statuses" v-bind:key="status" :index="status" @click="onChangeStatusClick">{{ removeUnderscores(status) }}</el-menu-item>
        </el-submenu>
        <el-menu-item @click="onDeleteClick">
          Delete
        </el-menu-item>
      </el-menu>
    </div>
  </el-container>
</template>

<script>
import PartCard from '@/components/inventory/part/PartCard';
import SidebarItem from '@/components/purchase-orders/SidebarItem';
import { PurchaseOrderService } from '@/common/api';
import { ColorHelper } from '@/common/color';
import timeago from 'timeago.js';

export default {
  props: ['orderId'],
  components: {
    PartCard,
    SidebarItem
  },
  data() {
    return {
      loading: false,
      statuses: [
        'ON_HOLD',
        'NOT_REQUIRED',
        'TO_BE_ORDERED',
        'ORDERED',
        'RECEIVED',
        'IN_STOCK',
      ],
      purchaseOrder: null,
      statusBackgroundColor: '',
      lastUpdatedText: 'Loading'
    }
  },
  methods: {
    refreshPurchaseOrder() {
      // Fetch purchase order and set color based on status
      this.loading = true;
      PurchaseOrderService.getPurchaseOrder(this.orderId).then(response => {
        this.purchaseOrder = response.data;
        let type;
        switch(response.data.status) {
          default:
          case 'NOT_REQUIRED':
          case 'REJECTED':
            type = 'danger';
            break;
          case 'TO_BE_ORDERED':
            type = 'info';
            break;
          case 'ON_HOLD':
          case 'ORDERED':
            type = 'warning';
            break;
          case 'RECEIVED':
          case 'IN_STOCK':
            type = 'success';
            break;
        }
        this.statusBackgroundColor = ColorHelper(type)
        // Set how long ago the purchase order was updated
        this.lastUpdatedText = timeago().format(this.purchaseOrder.updatedAt);
        this.loading = false;
      }).catch(() => {
        // If we can't get the purchase order then it doesn't exist
        this.$store.dispatch('messageError', '[PurchaseOrderView] Purchase order does not exist with id: ' + this.orderId);
        this.$router.back();
      });
    },
    removeUnderscores(text) {
      // Remove underscores from the status so it's human readable
      if (!text) return '';
      return text.split('_').join(' ');
    },
    onChangeStatusClick(menuItem) {
      // Don't change the status to the current one
      if (this.purchaseOrder.status === menuItem.index) return;
      PurchaseOrderService.updatePurchaseOrderStatus(this.purchaseOrder.id, menuItem.index).then(() => {
        this.refreshPurchaseOrder();
      });
    },
    onDeleteClick() {
      // Delete then if there's an error, then notify the user
      PurchaseOrderService.deletePurchaseOrder(this.purchaseOrder.id).then(() => {
        this.loading = true;
        this.$router.back();
      }).catch(() => {
        this.loading = false;
        this.$store.dispatch('messageError', '[PurchaseOrderView] An error occured deleting purchase order with id: ' + this.purchaseOrder.id);
      });
    }
  },
  mounted() {
    // When the page is loaded get the purchase order
    this.refreshPurchaseOrder();
  }
}
</script>

<style>
.purchase-order-sidebar {
  width: 550px;
}
.purchase-order-main {
  padding-left: 10px;
  width: 100%;
}
.status-title p {
  display: inline-block;
  margin-bottom: 5px;
}
.status-title-bold {
  font-weight: 600;
}
.status-title-right {
  text-align: right;
  font-size: 0.8rem;
  float: right;
}
.status {
  width: 100%;
  height: 64px;
  background-color: black;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.status p {
  color: white;
  font-size: 1.3rem;
}
</style>
