<template>
  <el-container direction="vertical">
    <!-- Search/Toolbar -->
    <el-row type="flex" :gutter="10">
      <el-col>
        <div>
          <el-input v-model="search" placeholder="Search"></el-input>
        </div>
      </el-col>
      <el-col :span="4" v-permission="['ADMIN', 'MENTOR', 'INV_EDIT']">
        <el-dropdown style="width: 100%" trigger="click" placement="bottom" @command="handleCommand">
          <el-button round :disabled="selectedParts.length < 1" style="width: 100%">Actions<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="delete">Delete Part(s)</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="2" v-permission="['ADMIN', 'MENTOR', 'INV_EDIT']">
        <el-button style="width: 100%;" @click="$router.push('/inventory/parts/create')" type="primary" icon="el-icon-edit"></el-button>
      </el-col>
    </el-row>
    <!-- Parts Table Start -->
    <el-table
        border
        v-loading="partsLoading"
        :data="parts.content"
        style="width: 100%; margin-top: 20px;"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        @cell-click="onCellClick"
        empty-text="No Parts Found">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name">
      </el-table-column>
      <el-table-column
        prop="nomenclature"
        label="Nomenclature">
      </el-table-column>
      <el-table-column label="Location">
        <template slot-scope="scope">
          <p>{{ scope.row.location.name + "-" + scope.row.sublocation }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Quantity"
        width="100">
        <template slot-scope="scope">
          <p @click.end="onQuantityPressed(scope.row)">{{ scope.row.quantity }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Vendor Information">
        <template slot-scope="scope">
          <p v-for="vendorInfo in scope.row.vendorInformation" v-bind:key="vendorInfo.id">{{ vendorInfo.vendor.name + ": " + vendorInfo.partNumber }}</p>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 10px;">
      <el-pagination
        layout="prev, pager, next"
        :total="parts.totalElements"
        :page-size="parts.size"
        :current-page.sync="currentPage">
      </el-pagination>
    </el-row>
  </el-container>
</template>

<script>
import { InventoryService } from '@/common/api.js';
import { mapGetters } from 'vuex';
import {
  GET_PARTS,
  SEARCH_PARTS
} from '@/store/actions';
import permission from '@/directive/permission';
export default {
  directives: {
    permission
  },
  computed: {
    ...mapGetters(['parts', 'loading'])
  },
  data() {
    return {
      search: '',
      parts: {
        totalElements: 0,
        size: 0,
        content: []
      },
      quantityPart: {
        name: '',
        quantity: 0
      },
      quantityDialog: false,
      newQuantity: 0,
      currentPage: 1,
      selectedParts: [],
      partsLoading: true
    }
  },
  methods: {
    // If searching, then request the search endpoint,
    // however, if were just viewing, request the normal one
    refreshParts() {
      this.partsLoading = true;
      if (this.search.length > 0) {
        InventoryService.searchParts(20, this.currentPage - 1, this.search).then(response => {
          this.parts = response.data;
          this.partsLoading = false;
        });
      } else {
        InventoryService.getParts(20, this.currentPage - 1).then(response => {
          this.parts = response.data;
          this.partsLoading = false;
        });
      }
    },
    deleteParts() {
      this.$confirm('Are you sure you want to delete those parts?')
        .then(_ => {
          this.partsLoading = true;
          InventoryService.deleteParts(this.selectedParts).then(() => {
            this.refreshParts();
          });
        })
        .catch(_ => {});
    },
    handleSelectionChange(val) {
      this.selectedParts = val;
    },
    handleCommand(command) {
      switch(command) {
        case 'delete':
          this.deleteParts();
          break;
      }
    },
    onCellClick(row) {
      this.$router.push('/inventory/part/' + row.id);
    },
    tableRowClassName(obj) {
      if (obj.row.minQuantity >= obj.row.quantity) {
        return 'danger-row';
      } else {
        return '';
      }
    }
  },
  watch: {
    // Watch the search, and if anything changes
    // refresh the part list with the search
    search() {
      if (this.search.length == 0) {
        this.currentPage = 1;
      }
      this.refreshParts();
    },
    // Whenever the current page changes, have the 
    currentPage() {
      this.refreshParts();
    }
  },
  mounted() {
    this.refreshParts();
    console.log(this);
  }
}
</script>

<style>
  .el-table .danger-row {
    background: #ffb5b5;
  }
</style>
