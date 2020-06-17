<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.userStatus" placeholder="客户状态" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in userStatusOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-third-icon-add-copy" @click="handleAdd">
        新增
      </el-button>
    </div>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px"
    >
      <el-table-column label="ID" prop="id" align="center" min-width="15">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名" align="center" min-width="40">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" align="center" min-width="40">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.loginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="版本号">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center" min-width="30">
        <template slot-scope="{row}">
          {{ statusMap[row.userStatus] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-third-icon-edit" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" icon="el-third-icon-delete" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>=0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="tempUser" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="客户状态">
          <el-select v-model="tempUser.userStatus" placeholder="客户状态" class="filter-item" style="width: 330px">
            <el-option v-for="item in userStatusOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="tempUser.loginName" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="tempUser.userName" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="tempUser.userPhone" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tempUser.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList } from '@/api/user'
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
        limit: 10,
        username: undefined,
        userStatus: undefined
      },
      userStatusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '异常' }],
      dialogFormVisible: false,
      dialogStatus: '',
      statusMap: {
        0: '正常',
        1: '异常'
      },
      textMap: {
        edit: '编辑用户',
        create: '新增用户'
      },
      dialogPvVisible: false,
      tempUser: {
        id: undefined,
        loginName: '',
        userName: '',
        userPhone: '',
        userStatus: 0,
        remark: ''
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 260)
      })
    },
    resetTemp() {
      this.tempUser = {
        id: undefined,
        loginName: '',
        userName: '',
        userPhone: '',
        userStatus: 0,
        remark: ''
      }
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.$confirm('确定要删除 ' + row.userName + ' 用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '用户删除成功！',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
        this.total--
      }).catch(() => {
      })
    },
    handleEdit(row) {
      this.tempUser = row
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    }

  }
}
</script>

<style scoped>

</style>
