<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="用户名" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.userStatusOptions" placeholder="客户状态" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in userStatusOptions" :key="item" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">
        Search
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="Date" width="150px" align="center" />
      <el-table-column label="Title" min-width="150px" />
      <el-table-column label="Author" width="110px" align="center" />
      <el-table-column label="Imp" width="80px" />
      <el-table-column label="Readings" align="center" width="95" />
      <el-table-column label="Status" class-name="status-col" width="100" />
    </el-table>
    <pagination v-show="total>=0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      userStatusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '异常' }],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  }
}
</script>

<style scoped>

</style>
