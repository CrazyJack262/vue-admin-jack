<template>
  <div class="app-container shadow">
    <dividing-line :title="'用户管理'" />
    <div class="filter-container" style="margin-top: 10px">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-select v-model="listQuery.userStatus" placeholder="客户状态" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in userStatusOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" @click="handleSearch">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleAdd">
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
      <el-table-column label="登录账号" align="center" min-width="40">
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
      <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="handleReset(row)">
            重置
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>=0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="tempUser"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :hide-required-asterisk="true"
      >
        <el-form-item label="用户状态">
          <el-select v-model="tempUser.userStatus" placeholder="客户状态" class="filter-item" style="width: 330px">
            <el-option v-for="item in userStatusOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName">
          <el-input v-model="tempUser.loginName" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="登录密码" prop="loginPassword">
          <el-input v-model="tempUser.loginPassword" show-password />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="tempUser.userName" />
        </el-form-item>
        <el-form-item label="电话号码" prop="userPhone">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="resetDialogFormVisible">
      <el-form
        ref="resetDataForm"
        :model="tempUser"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :hide-required-asterisk="true"
      >
        <el-form-item label="登录账号" prop="loginName">
          <el-input v-model="tempUser.loginName" :disabled="true" />
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPassword">
          <el-input v-model="tempUser.loginPassword" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleResetData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchList, saveUser, deleteUserById, updateUserById } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import DividingLine from '@/components/DividingLine'

export default {
  name: 'User',
  components: { DividingLine, Pagination },
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
        userStatus: 0
      },
      userStatusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '异常' }],
      dialogFormVisible: false,
      resetDialogFormVisible: false,
      dialogStatus: '',
      statusMap: {
        0: '正常',
        1: '异常'
      },
      textMap: {
        edit: '编辑用户',
        create: '新增用户',
        reset: '密码重置'
      },
      dialogPvVisible: false,
      tempUser: {
        id: undefined,
        loginName: '',
        userName: '',
        userPhone: '',
        userStatus: 0,
        loginPassword: '',
        remark: ''
      },
      downloadLoading: false,
      rules: {
        loginName: [{ required: true, message: '登录账号不能为空', trigger: 'blur' }],
        userName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        userPhone: [{ required: true, message: '电话号码不能为空', trigger: 'blur' }],
        loginPassword: [{ required: true, message: '登录密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      searchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    resetTemp() {
      this.tempUser = {
        id: undefined,
        loginName: '',
        userName: '',
        userPhone: '',
        userStatus: 0,
        loginPassword: '',
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定要删除 ' + row.userName + ' 用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserById(row.id).then(response => {
          const data = response.data
          console.log(data)
        })
        this.$notify({
          title: '成功',
          message: '用户删除成功！',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
        this.total--
      }).catch(
        action => {
        }
      )
    },
    handleReset(row) {
      this.tempUser = row
      this.dialogStatus = 'reset'
      this.resetDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['resetDataForm'].clearValidate()
      })
    },
    handleResetData() {
      this.$refs['resetDataForm'].validate((valid) => {
        if (valid) {
          updateUserById({ id: this.tempUser.id, version: this.tempUser.version, loginPassword: this.tempUser.loginPassword }).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '用户密码重置成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.resetDialogFormVisible = false
          })
        }
      })
    },
    handleEdit(row) {
      this.tempUser = row
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempUser)
          saveUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '用户新增成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempUser)
          updateUserById(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '用户更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
