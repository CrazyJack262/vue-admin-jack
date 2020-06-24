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
          <el-button type="primary" size="mini" icon="el-third-icon-edit" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            icon="el-third-icon-delete"
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
      console.log('getList')
    },
    handleSearch() {
      console.log('search')
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      console.log('add')
    },
    handleEdit(row) {
      console.log('edit')
      console.log(row)
    },
    handleDelete(row) {
      console.log('delete')
      console.log(row)
    },
    createData() {
      console.log('新增数据')
    },
    updateData() {
      console.log('更新数据')
    }
  }
}
</script>

<style scoped>

</style>
