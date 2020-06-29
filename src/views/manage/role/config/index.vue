<template>
  <div class="app-container shadow">
    <dividing-line :title="'角色管理'" />
    <div class="filter-container" style="margin-top: 10px">
      <el-input
        v-model="listQuery.roleName"
        placeholder="角色名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSearch"
      />
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
      <el-table-column label="角色名称" align="center" min-width="40">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" min-width="40">
        <template slot-scope="{row}">
          <span>{{ row.roleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="版本号">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
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
        :model="tempRole"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
        :hide-required-asterisk="true"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="tempRole.roleName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="tempRole.roleDesc" />
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
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import DividingLine from '@/components/DividingLine'
import { deleteRoleById, getRoleList, saveRole, updateRoleyId } from '@/api/role'

export default {
  name: 'RoleConfig',
  components: { DividingLine, Pagination },
  directives: { waves },
  data() {
    return {
      textMap: {
        edit: '编辑角色',
        create: '新增角色'
      },
      tempRole: {
        roleName: null,
        roleDesc: null
      },
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        roleName: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    resetTemp() {
      this.tempRole = {
        roleName: null,
        roleDesc: null
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
    handleEdit(row) {
      this.tempRole = row
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定要删除 ' + row.roleName + ' 角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleById(row.id).then(response => {
          const data = response.data
          console.log(data)
        })
        this.$notify({
          title: '成功',
          message: '角色删除成功！',
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempRole)
          saveRole(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '角色新增成功',
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
          const tempData = Object.assign({}, this.tempRole)
          updateRoleyId(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '角色更新成功',
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
