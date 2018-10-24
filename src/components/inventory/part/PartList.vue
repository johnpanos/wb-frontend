<template>
  <el-container direction="vertical">
    <!-- Search/Toolbar -->
    <el-row type="flex" :gutter="10">
      <el-col>
        <div>
          <el-input @change="refreshSearch" placeholder="Search"></el-input>
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
        v-loading="loading"
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
        :current-page.sync="page">
      </el-pagination>
    </el-row>
  </el-container>
</template>

<script>
import { InventoryService } from '@/common/api.js';
import { mapGetters } from 'vuex';
import permission from '@/directive/permission';
export default {
  directives: {
    permission
  },
  computed: {
    ...mapGetters(['search', 'parts', 'loading', 'currentPage']),
    page: {
      set(page) {
        this.$store.commit('setPage', page);
      },
      get() {
        return this.currentPage;
      }
    }
  },
  data() {
    return {
      selectedParts: []
    }
  },
  methods: {
    // If searching, then request the search endpoint,
    // however, if were just viewing, request the normal one
    refreshSearch(search) {
      this.$store.dispatch('searchParts', search);
    },
    refreshParts() {
      this.$store.dispatch('getParts');
    },
    deleteParts() {
      this.$confirm('Are you sure you want to delete those parts?')
        .then(_ => {
          this.$store.dispatch('deleteParts', this.selectedParts);
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
    currentPage() {
      this.refreshParts();
    }
  },
  mounted() {
    this.refreshParts();
  }
}
</script>

<style>
  .el-table .danger-row {
    background: #ffb5b5;
  }
</style>
