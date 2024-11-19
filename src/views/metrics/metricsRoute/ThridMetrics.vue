<template>
  <div>
    <ExportHtml ref="exportHtmlComponent"/>
    <div style="display: flex; justify-content: center; color: dimgrey; font-weight: bolder;
  font-size: 20px; margin: 0px 0 1px;">

<!--      <span>医院国家三甲指标(</span>-->

<!--      <el-dropdown @command="selectDish">-->
<!--        <span class="underline">{{ selecteYear }}</span>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item-->
<!--              v-for="(dish, index) in years"-->
<!--              :key="index"-->
<!--              :command="dish">-->
<!--            {{ dish }}-->
<!--          </el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
<!--      <span>版本)</span>-->

      <span>医院国家三甲指标</span>
  <span v-if="versioninfo.ifupdate" style="font-size: 14px; color: red; font-weight: normal">
    版本有改动，请务必
    <button  @click="checkversion" style="font-weight:bolder;background: none; border: none; color: red; padding: 0; margin: 0; font-size: 14px; cursor: pointer; text-decoration: underline;">
      更新检查
    </button>！！！
  </span>

    </div>


    <div class="container">
      <div class="date-input-wrapper">
        <DatePickerShortcuts
            v-model="dateInfo"
            :list="resultList"
            :shortcuts="shortcuts"
            date-disabled
            @change="changeDate"
        ></DatePickerShortcuts>
      </div>


      <div class="controls"> <!-- Flex 容器 -->
        <el-checkbox-group v-model="checkboxGroup1" @change="handleCityClick">
          <el-checkbox-button
              v-for="city in cities"
              :label="city"
              :key="city"
              class="custom-checkbox-button"
          >
            <el-tooltip :content="cityTooltips[city]" placement="top" effect="light">
              <div class="city-content">
                <div class="city-label">{{ city }}</div>
                <div class="city-name">{{ cityCount(city) }}</div>
              </div>
            </el-tooltip>
          </el-checkbox-button>
        </el-checkbox-group>
        <el-button-group class="button-group">
          <el-pagination
              small
              layout="prev, pager, next,total"
              :total="filteredData.length"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :pager-count=5
          >
          </el-pagination>
          <el-select
              size="mini"
              clearable
              multiple
              collapse-tags
              v-model="selectValue"
              style="color: black;"
              :placeholder="selectplaceholder"
          >
            <el-option-group label="未备注">
              <el-option
                  v-for="item in selectOptions"
                  :key="item"
                  :value="item"
                  v-if="item.includes('未备注')"
              >
                <span style="color: black; font-weight: bolder">{{ selectCount(item) }}</span> {{ item }}
              </el-option>
            </el-option-group>

            <!-- 平台组 -->
            <el-option-group label="平台">
              <el-option
                  v-for="item in selectOptions"
                  :key="item"
                  :value="item"
                  v-if="!item.includes('医院') && !item.includes('未备注')"
              >
                <span style="color: red; font-weight: bolder">{{ selectCount(item) }}</span> {{ item }}
              </el-option>
            </el-option-group>

            <!-- 医院组 -->
            <el-option-group label="医院">
              <el-option
                  v-for="item in selectOptions"
                  :key="item"
                  :value="item"
                  v-if="item.includes('医院')"
              >
                <span style="color: grey; font-weight: bolder">{{ selectCount(item) }}</span> {{ item }}
              </el-option>
            </el-option-group>


          </el-select>


          <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-refresh" @click="refresh()">
            刷新
          </el-button>
          <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-share" @click="openAPI">API
          </el-button>
          <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-download" @click="downExcel">
            EXCEL
          </el-button>
          <el-tooltip content="导出指标问题备注" placement="top" effect="light">
            <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-download"
                       :loading="ExportHtmlLoading" @click="ExportHtml">
              备注
            </el-button>
          </el-tooltip>
        </el-button-group>
      </div>
    </div>

    <el-table
        ref="table1"
        v-loading="tableLoading"
        :data="filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        border

        style="width: 100% "
        :row-class-name="getRowClass"
        @expand-change="handleExpandChange"
    >
      <el-table-column prop="secondtarget"
                       label="指标模块"
                       width="220"
                       show-overflow-tooltip
      >
        <template slot="header" slot-scope="scope">
          <el-input placeholder="指标模块"
                    prefix-icon="el-icon-search"
                    size="mini" v-model="search.secondtarget"
                    class="custom-input"></el-input>
        </template>
        <template slot-scope="scope">

          <span>{{ scope.row.secondtarget }}</span>

        </template>
      </el-table-column>

      <el-table-column
          prop="thirdtarget"
          label="指标名称"
      >
        <template slot-scope="props">
             <span :class="{ 'shift-right': !props.row.isMainMetrics }">
          {{ props.row.thirdtarget }}
              <el-tooltip v-if="props.row.remarkType && props.row.remarkType.length > 0"
                          :content="props.row.remarkType.replace(/[\[\]]/g, '')"
                          placement="right" effect="light">
                <el-button
                    type="text"
                    icon="el-icon-warning-outline"
                    size="mini"
                    @click="viewRemark(props.row)"
                    style="color: red;font-weight: bolder">
                </el-button>
              </el-tooltip>
        </span>
        </template>

        <template slot="header" slot-scope="scope">
          <el-input placeholder="指标名称"
                    prefix-icon="el-icon-search"
                    size="mini" v-model="search.thirdtarget"
                    class="custom-input"></el-input>
        </template>
      </el-table-column>

      <el-table-column type="expand" label="详情" width="50">
        <template slot-scope="props">
          <div>
            <div style="font-weight: bolder; font-size: 20px;text-align: center; margin: 10px 0;">
              <span>{{ props.row.thirdtarget + "(各次指标科室明细对照)" }}</span>
            </div>
            <el-table class="expanded-content"
                      v-loading="table2Loading"
                      :cell-style="columnStyle"
                      :data="tableData2"
                      height="400"
                      border
                      :row-class-name="getNestedRowClass"
                      style="width: 100%;">
              <el-table-column
                  prop="provid"
                  label="科室"
                  align="center"
                  width="200"
              />
              <!-- 动态生成的一级表头和二级表头 -->
              <el-table-column
                  v-for="(mainColumn, mainIndex) in tableData2dynamicColumns"
                  :key="mainIndex"
                  :label="mainColumn.label"
                  align="center"
              >
                <el-table-column
                    v-for="(subColumn, subIndex) in mainColumn.children"
                    :key="subIndex"
                    :label="subColumn.label"
                    align="center"
                >
                  <template v-slot="scope">
                    {{ scope.row[mainColumn.prop]?.[subColumn.prop] }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template #header>
          <i class="el-icon-caret-bottom" style="font-size: 20px;"></i>
        </template>
      </el-table-column>
      <el-table-column
          prop="beValue"
          label="核查结果"
          width="150">
        <template slot-scope="scope">
          <div
              :class="{
         'red-background': (scope.row.beValue === ''),
         'yellow-background': (!scope.row.isMainMetrics && scope.row.dmValue !== scope.row.beValue&&scope.row.beValue!==''),
      }"
              class="cell-content"
          >
            {{ scope.row.beValue === '' ? '无数据' : scope.row.beValue }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="dmValue"
          label="DM层结果"
          width="150">
        <template slot-scope="scope">
          <div :class="{
         'red-background': (scope.row.dmValue === ''),
         'yellow-background': (!scope.row.isMainMetrics && scope.row.dmValue !== scope.row.beValue&&scope.row.dmValue!==''),
      }">

            {{ scope.row.dmValue === '' && !scope.row.isMainMetrics ? '无数据' : scope.row.dmValue }}
          </div>
        </template>
      </el-table-column>


      <el-table-column
          prop="dataid"
          label="编号"
          width="160">
        <template slot="header" slot-scope="scope">
          <el-input placeholder="编号"
                    prefix-icon="el-icon-search"
                    size="mini" v-model="search.dataid"
                    class="custom-input"></el-input>
        </template>


      </el-table-column>
      <el-table-column
          prop="author"
          label="作者"
          width="120">
        <template slot-scope="props">
          <div class="cell-content">
          <span class="shift-right">
          {{ props.row.author }}
        </span>
            <el-button-group style="margin-left: auto;  ">
              <el-tooltip content="编辑" placement="left" effect="light">
                <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="mini"
                    @click="edit(props.row)"
                    :style="{ backgroundColor: props.row.isMainMetrics ? '#dadada' : '#fff', color: props.row.isMainMetrics ? '#fff' : '#1e1f22' }">
                </el-button>
              </el-tooltip>
              <!--              <el-tooltip content="更新" placement="right" effect="light">-->
              <!--                <el-button icon="el-icon-link" size="mini"></el-button>-->
              <!--              </el-tooltip>-->
            </el-button-group>
          </div>
        </template>
        <template slot="header" slot-scope="scope">
          <el-input placeholder="作者"
                    prefix-icon="el-icon-search"
                    size="mini" v-model="search.author"
                    class="custom-input"></el-input>
        </template>


      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间"
          width="160"
          show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <el-input placeholder="更新时间"
                    prefix-icon="el-icon-search"
                    size="mini" v-model="search.updateTime"
                    class="custom-input"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="dialogVisibleRemark"
        :modal="false"
        :show-header="false"
        :show-close="true"
        width="60%"
        class="custom-dialog"
        :top="'0px'">
      <div>
        <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-download" @click="exportPdf">
          PDF
        </el-button>
      </div>
      <div id="remark-content" style="top: 0px">
        <div style="font-weight: bolder; text-align: center ; font-size: 20px ">
          <span>  {{ this.dialogVisibleRemarkData.indName }} <i style="color: red" class=" el-icon-warning-outline"></i></span>
        </div>
        <div style="text-align: right;">
         <span style=" font-size: 15px">
           <i class="el-icon-s-flag"></i>{{ this.dialogVisibleRemarkData.indId }}
           <i class="el-icon-user-solid"></i>{{ ' ' + this.dialogVisibleRemarkData.author }}
           <i class="el-icon-time"></i>  {{ ' ' + this.dialogVisibleRemarkData.updateTime }}
         </span>
        </div>
        <div>
         <span style=" font-weight: bolder; color:brown;   font-size: 16px">
        <i class=" el-icon-question"></i>
           {{ this.dialogVisibleRemarkData.remarkType }}
         </span>
        </div>
        <div>
          <span style="font-weight: bolder;font-size: 18px">    <i class=" el-icon-tickets"></i></span>
        </div>
        <div style="max-height: 73vh; overflow-y: auto;">
          <div v-html="dialogVisibleRemarkData.remark"></div>
        </div>
      </div>
    </el-dialog>
  </div>


</template>
<script>


import DatePickerShortcuts from "@/components/DatePickerShortcuts/DatePickerShortcuts.vue";
import ExportHtml from '@/components/ExportHtml.vue';
import {
  getThridMetrics,
  getMetrcisDate,
  getDeptThridMetrics,
  getMetricsRemarkByIndId
} from "@/api/metricsServer/metricsAPI";

import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import {MessageBox} from "element-ui";
import {mapState} from "vuex";


export default {
  name: 'ThridMetrics',
  components: {
    DatePickerShortcuts,
    ExportHtml,
  },

  data() {
    return {
      tableData: [],
      tableLoading: false,
      table2Loading: false,

      tableData2: [],
      tableData2dynamicColumns: [],
      shortcuts: [
        "year",
        "quarter",
        "month",
        "monthRange",
      ],
      dateInfo: {},
      resultList: [],

      input1: '',
      search: {author: '', thirdtarget: '', secondtarget: '', dataid: '', updateTime: ''},
      checkboxGroup1: [],
      selecteYear: '2020', // 默认初始值
      years: ['2020', '2024'], // 下拉选项
      currentPage: 1, //当前页 刷新后默认显示第一页
      pageSize: 24, //每一页显示的数据量 此处每页显示6条数据
      expandedRow: null, // 当前展开的行，
      selectValue: [],//
      selectOptions: [],
      dialogVisibleRemark: false,
      dialogVisibleRemarkData: {
        indId: '',
        IndName: '',
        author: '',
        updateTime: '',
        remarkType: '',
        remark: '',
      },
      selectplaceholder: '备注',
      ExportHtmlLoading: false, // 导出按钮的加载状态
      cities: ['主', '次', '未完成总值', '未完成明细', '无数据', '错误'], // 定义城市数组
      cityTooltips: {
        '主': '主指标数量/所有指标数量',
        '次': '次指标数量/所有指标数量',
        '未完成总值': '未对指标的总值进行编程的数量(包含主和次指标)',
        '未完成明细': '未对指标的明细进行编程的数量(包含主和次指标)',
        '无数据': '应用层没有数值的指标数量(包含主和次指标)',
        '错误': '1、新建层没有数值。2、新建层与应用层数值不一致。次指标数量(仅次指标)',
      },
      versioninfo:{"ifupdate":true},


    }
  },

  methods: {
    handleExpandChange(row) {
      // 如果已经有展开的行且不是当前行，则关闭它
      if (this.expandedRow && this.expandedRow !== row) {
        this.$refs.table1.toggleRowExpansion(this.expandedRow, false);
      }
      // 更新当前展开的行
      this.expandedRow = this.expandedRow === row ? null : row;

      // 如果新展开的行不为空，则调用 loadData 加载数据
      if (this.expandedRow) {
        this.loadData(this.expandedRow);
      }
    },


    //     handleExpandChange(row, expanded) {
    //   row.expanded = expanded;
    //   if (expanded) {
    //     this.loadData(row);
    //   } else {
    //     this.$set(this.tableData2, row.dataid, null); // 清除已展开的内容
    //   }
    // },

    async loadData(row) {
      this.table2Loading = true; // 显示加载状态
      // 模拟数据加载
      try {
        // let canshu = {
        //   "dataId": "n400",
        //   "year": "2024",
        //   "month": "0",
        //   "quarter": "0",
        //   "stage": "1-3"
        // }
        let canshu = this.dateInfo;
        canshu.dataId = row.dataid;
        const response = await getDeptThridMetrics(canshu.dataId, canshu.year, canshu.month, canshu.quarter, canshu.stage);
        if (response.data.code === 200) {
          this.tableData2 = response.data.data; // 根据实际 API 响应格式处理数据
          this.tableData2dealwith();

        } else {
          this.$message.error(`加载失败/metrics/getDeptThridMetrics：${response.data.message}`);
        }
      } catch (error) {
        // 处理请求失败的情况
        this.error = error;
        console.error("Error getDeptThridMetrics:", error);
        this.$message.error("/metrics/getDeptThridMetrics数据加载失败，请稍后再试。");
      } finally {
        this.table2Loading = false; // 隐藏加载状态
      }
    },
    getRowClass({row}) {
      if (!row.isMainMetrics) {
        return 'row-expand-cover';
      }
      return 'row-main';
    },
    getNestedRowClass() {
      return 'nested-row-bg';
    },
    columnStyle({row, column, rowIndex, columnIndex}) {
      if (column.label && column.label.includes('DM')) {
        return 'background: #ffffff;';
      }
      if (column.label && column.label.includes('相比')) {
        return 'background: #d3d7d4;';
      }
      if (column.label && column.label.includes('APP')) {
        return 'background: #ffffff;';
      }


    },
    async searchrMetrics(canshu) {
      this.tableLoading = true; // 开始加载
      try {
        const response = await getThridMetrics(canshu.year, canshu.month, canshu.quarter, canshu.timeStage);
        if (response.data.code === 200) {
          this.tableData = response.data.data; // 根据实际 API 响应格式处理数据
        }
      } catch (error) {
        // 处理请求失败的情况
        this.error = error;
        this.$message.error("/metrics/getThridMetrics接口请求失败，请检查网络或稍后重试"); // 请求异常时弹出提示
      } finally {
        this.tableLoading = false; // 加载完成
      }

    },
    changeDate() {
      //  console.log('this.dateInfo', this.dateInfo)
      this.searchrMetrics(this.dateInfo)
    },
    async getMetrcisDate() {
      try {
        const response = await getMetrcisDate();
        if (response.data.code === 200) {
          this.resultList = response.data.data.list; // 根据实际 API 响应格式处理数据
          this.dateInfo = response.data.data.default;
        } else {
          this.$message({
            message: '/metrics/getMetrcisDate失败，请重试！',  // 这里可以根据 response.data.message 或其他字段展示具体错误信息
            type: 'error'
          });
        }
      } catch (error) {
        // 处理请求失败的情况
        this.error = error;
        this.$message.error("/metrics/getMetrcisDate接口请求失败失败"); // 请求异常时弹出提示
      }

    },
    open() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },


    // goRouter(row) {
    //   //  console.log("row", row)
    //   let item = {
    //     path: '/MetricsManger',
    //     icon: 'setting',
    //     label: '指标编辑',
    //     name: 'MetricsManger',
    //     url: 'metrics/MetricsManger.vue',
    //   }
    //   this.$router.push({
    //     path: item.path,
    //     query: row  // 假设 row 中有 id，你可以根据需要传递其他字段
    //   });
    //   // 动态从 keep-alive 中移除 MetricsManger 以确保刷新
    //   this.$nextTick(() => {
    //     this.$refs.keepAliveExclude = ['MetricsManger'];
    //   });
    //   // 更新面包屑数据
    //   this.$store.commit("selectMenu", item);
    // },


// 不希望将参数直接显示在 URL 中，可以使用 params 替代 query 来传递参数
 goRouter(row) {
  let item = {
    path: '/MetricsManger',
    icon: 'setting',
    label: '指标编辑',
    name: 'MetricsManger',
    url: 'metrics/MetricsManger.vue',
  }
  this.$router.push({
    name: item.name, // 使用name而非path
    params: { row }   // 通过params传递参数
  });
  // 动态从 keep-alive 中移除 MetricsManger 以确保刷新
  this.$nextTick(() => {
    this.$refs.keepAliveExclude = ['MetricsManger'];
  });
  // 更新面包屑数据
  this.$store.commit("selectMenu", item);
},


    edit(row) {
      if (row.isMainMetrics) {
        this.$confirm('该指标为 <span style="color: red;">主指标</span>, 不建议进行编写SQL，因为很可能与次指标逻辑不符合。是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true  // 启用 HTML 解析
        }).then(() => this.goRouter(row))
            .catch(() => {
            });
      } else {
        this.goRouter(row)
      }
    },

    // 生成动态列数据
    tableData2dealwith() {
      // 生成动态列数据
      if (this.tableData2.length > 0) {
        const firstRow = this.tableData2[0];
        this.tableData2dynamicColumns = Object.keys(firstRow)
            .filter((key) => typeof firstRow[key] === "object")
            .map((key) => {
              return {
                label: key,
                prop: key,
                children: Object.keys(firstRow[key]).map((subKey) => ({
                  label: subKey,
                  prop: subKey
                }))
              };
            });
      }
    },

    handleCityClick() {
      // 处理城市点击逻辑，若已选中则取消选中
      if (this.checkboxGroup1.length === 0) {
        this.checkboxGroup1 = [];
      }
    },
    cityCount(city) {
      // 计算每个城市的数量
      if (city === '主') {
        return this.tableData.filter(item => item.isMainMetrics === true).length + "/" + this.tableData.length;

      }
      if (city === '次') {
        return this.tableData.filter(item => item.isMainMetrics === false).length + "/" + this.tableData.length;
      }

      if (city === '未完成总值') {
        return this.tableData.filter(item => item.sqlTotal === '' || !item.hasOwnProperty('sqlTotal')).length;
      }

      if (city === '未完成明细') {
        return this.tableData.filter(item => item.sqlDetail === '' || !item.hasOwnProperty('sqlDetail')).length;
      }

      if (city === '无数据') {
        return this.tableData.filter(item => item.beValue === '').length;
      }
      if (city === '错误') {
        return this.tableData.filter(item =>
            !item.isMainMetrics && (item.dmValue !== item.beValue || item.dmValue === '')).length;
      }
    },
    selectDish(dish) {
      this.selecteYear = dish; // 更新显示的年份
    },


    objectSpanMethod({row, column, rowIndex}) {
      if (column.property === 'secondtarget') {
        const currentValue = row.secondtarget;
        let rowspan = 1;

        // 查找该列中是否有相同的 secondtarget 值，确保合并
        if (rowIndex === 0 || this.tableData[rowIndex - 1].secondtarget !== currentValue) {
          for (let i = rowIndex + 1; i < this.tableData.length; i++) {
            if (this.tableData[i].secondtarget === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return [rowspan, 1];
        } else {
          // 如果当前行的 secondtarget 已在之前的行中合并过，则返回 [0, 0] 隐藏显示
          return [0, 0];
        }
      }
      // 其他列默认
      return [1, 1];
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
      // console.log(this.currentPage);
    },
    refresh() {
      //   console.log(this.dateInfo)
      if (this.dateInfo) {
        this.searchrMetrics(this.dateInfo); // 等到 dateInfo 获取后再执行 searchrMetrics
      }

    },
    openAPI() {
      window.open(process.env.VUE_APP_HOPPSCOTCH_API_URL, '_blank');
    },

    downExcel() {
      // 获取表格数据
      const tableData = this.filteredData;

      // 检查数据是否为空
      if (!tableData || tableData.length === 0) {
        this.$message.warning('没有数据可以导出');
        return;
      }

      // 准备 Excel 数据
      const excelData = tableData.map((row) => ({
        后端唯一ID: row.serialnumber,
        指标模块: row.secondtarget,
        指标名称: row.thirdtarget,
        主次: row.isMainMetrics ? '主' : '次',
        核查结果: row.beValue === '' ? '无数据' : row.beValue,
        DM层结果: row.dmValue === '' ? '无数据' : row.dmValue,
        编号: row.dataid,
        作者: row.author,
        更新时间: row.updateTime,
        备注: row.remarkType
      }));

      // 创建工作簿和工作表
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

      // 导出 Excel 文件
      XLSX.writeFile(workbook, 'table_data.xlsx');
    },


    async viewRemark(row) {
      let canshu = {
        indId: row.dataid
      }
      const response = await getMetricsRemarkByIndId(canshu);
      if (response.data.code === 200) {
        Array.isArray(response.data.data?.remarkType) ? response.data.data.remarkType : [];
        this.dialogVisibleRemark = true
        this.dialogVisibleRemarkData.indId = row.dataid;
        this.dialogVisibleRemarkData.indName = row.thirdtarget;
        this.dialogVisibleRemarkData.author = response.data.data.author;
        this.dialogVisibleRemarkData.updateTime = response.data.data.updateTime;
        // 获取 remarkType 数组，确保它是数组类型
        const remarkTypeArray = Array.isArray(response.data.data?.remarkType)
            ? response.data.data.remarkType
            : [];  // 如果不是数组，则使用默认空数组


        this.dialogVisibleRemarkData.remarkType = remarkTypeArray.join(', ');
        this.dialogVisibleRemarkData.remark = response.data.data?.remark ?? '';

      } else {
        await this.$alert('获取getMetricsRemarkByIndId备注接口失败。', '错误', {
          type: 'error',
          confirmButtonText: '确定',
        });

      }


    },


    async getMetricsRemarkByIndId() {
      let canshu = {
        indId: "仅仅获取类型"
      }
      const response = await getMetricsRemarkByIndId(canshu);
      if (response.data.code === 200) {
        this.selectOptions = Array.isArray(response.data.data?.remarkTypeALL)
            ? response.data.data.remarkTypeALL
            : [];

        if (!this.selectOptions.includes('未备注')) {
          this.selectOptions.push('未备注');
        }


      } else {
        this.selectplaceholder = '获取备注失败';
      }

    },


    selectCount(selectOption) {
      // 计算每个选择的数量
      // return this.tableData.filter(item => item.remarkType && item.remarkType.includes(selectOption)).length;


      // 计算每个选择的数量，包括 `remarkType` 为空或空字符串时匹配 `'未备注'`
      return this.tableData.filter(item => {
        if (selectOption === '未备注') {
          // 如果 `selectOption` 是 `'未备注'`，匹配 `item.remarkType` 为 `null`、`undefined` 或空字符串
          return item.remarkType === null || item.remarkType === '';
        } else {
          // 否则，匹配 `remarkType` 包含 `selectOption`
          return item.remarkType && item.remarkType.includes(selectOption);
        }
      }).length;
    },

    exportPdf() {

      // 获取原始的富文本元素
      const element = document.getElementById('remark-content');

      // 克隆元素
      const cloneElement = element.cloneNode(true);

      // 查找需要移除样式的 div 元素，并移除 max-height 和 overflow-y 样式
      const scrollableDiv = cloneElement.querySelector('div[style="max-height: 73vh; overflow-y: auto;"]');
      if (scrollableDiv) {
        scrollableDiv.style.maxHeight = '';  // 移除 max-height
        scrollableDiv.style.overflowY = '';  // 移除 overflow-y
      }

      // 确保所有图片的宽度不被截断
      const images = cloneElement.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';  // 确保图片不会超出容器宽度
        img.style.width = 'auto';     // 让图片宽度自适应
      });

      // 确保图片加载完成
      const promises = Array.from(images).map(img => new Promise(resolve => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      }));

      // 在所有图片加载完成后生成 PDF
      Promise.all(promises).then(() => {
        const filename = `${this.dialogVisibleRemarkData.indId + '备注'}.pdf`;
        // 配置 PDF 导出选项
        const options = {
          margin: 10,
          filename: filename,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 3}, // 增加缩放比例以提高图片质量
          jsPDF: {unit: 'mm', format: 'a4', orientation: 'landscape'} // 使用横向布局
        };

        // 使用克隆的元素来生成 PDF
        html2pdf().set(options).from(cloneElement).save();
      });
    },


    async ExportHtml() {
      // // 提取并去重 filteredData 中的 dataid 字段
      //   const dataidlist = [...new Set(this.filteredData.map(row => row.dataid))];  //remarkType
      //

      // 筛选出 remarkType 不为空的行，并提取 dataid，最后去重
      const dataidlist = [
        ...new Set(
            this.filteredData
                .filter(row => row.remarkType && row.remarkType.length > 0) // 筛选 remarkType 不为空的行
                .map(row => row.dataid) // 提取 dataid 字段
        )
      ];


      // 检查 dataidlist 是否为空
      if (dataidlist.length === 0) {
        // 使用 MessageBox 弹窗提示
        await MessageBox.alert('当前筛选的指标没有可导出的备注，请重新筛选！', '请重新筛选', {
          confirmButtonText: '确定',
          type: 'warning',
        });
        return; // 退出方法，不执行后续操作
      }

      this.ExportHtmlLoading = true;  // 启动加载状态
      this.$refs.exportHtmlComponent.exportHtml(dataidlist).finally(() => {
        // 延迟 5 秒后恢复按钮
        setTimeout(() => {
          this.ExportHtmlLoading = false;  // 恢复按钮状态
        }, 4000); // 5000 毫秒 = 5 秒
      });
    },

  checkversion() {
      this.$alert(
        '<strong>这是 <i>HTML</i> 片段</strong>',
        '版本有改动',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          callback: () => {
            // 判断用户是否为 admin
            if (this.user !== 'admin') {
              this.onConfirm();
            } else {
               this.checkversion()
            }
          },
        }
      );
    },
    onConfirm() {
      console.log("执行 onConfirm 方法");
      // 在这里编写点击确定后的逻辑
    },

  },
  computed: {
    // cities() {
    //   return ['主', '次', '未完成总值', '未完成明细', '无数据', '错误']; // 定义城市数组
    // },
    filteredData() {
      //   console.log(this.selectValue)
      this.currentPage = 1;//当前页 刷新后默认显示第一页
      this.pageSize = 24; //每一页显示的数据量 此处每页显示6条数据
      return this.tableData.filter(item => {
        const matchUpdateTime = this.search.updateTime === '' || (item.updateTime && item.updateTime.includes(this.search.updateTime));
        const matchdataid = this.search.dataid === '' || (item.dataid && item.dataid.includes(this.search.dataid));
        const matchSecondtarget = this.search.secondtarget === '' || (item.secondtarget && item.secondtarget.includes(this.search.secondtarget));
        const matchAuthor = this.search.author === '' || (item.author && item.author.includes(this.search.author));
        const matchName = this.search.thirdtarget === '' || (item.thirdtarget && item.thirdtarget.includes(this.search.thirdtarget));

        //    console.log(this.checkboxGroup1 + "this.checkboxGroup1")
        const matchActiveFilter = this.checkboxGroup1.length === 0 || this.checkboxGroup1.every(city => {

          if (city === '主') {

            return item.isMainMetrics === true;
          }
          if (city === '次') {

            return item.isMainMetrics === false;
          }
          if (city === '无数据') {

            return item.beValue === ''; // 过滤无数据
          }
          if (city === '错误') {

            return !item.isMainMetrics && (item.dmValue !== item.beValue || item.dmValue === ''); // 过滤错误
          }
          if (city === '未完成总值') {

            return item.sqlTotal === '' || !item.hasOwnProperty('sqlTotal');
          }

          if (city === '未完成明细') {

            return item.sqlDetail === '' || !item.hasOwnProperty('sqlDetail');
          }

        });
        // const selectValue = this.selectValue === '' || (item.remarkType && item.remarkType.includes(this.selectValue));

        //单选
        // const selectValue =
        //     this.selectValue === '' ||
        //     (this.selectValue === '未备注 && (item.remarkType === null || item.remarkType === '')) ||
        //     (item.remarkType && item.remarkType.includes(this.selectValue));
        // //    console.log("item.sqlT8888888888otal",  this.selectValue ,item.remarkType)


        //多选
        const selectValue =
            this.selectValue.length === 0 ||
            (this.selectValue.includes('未备注') && (item.remarkType === null || item.remarkType === '')) ||
            this.selectValue.some(value => item.remarkType && item.remarkType.includes(value));


        return matchUpdateTime && matchdataid && matchSecondtarget && matchAuthor && matchName && matchActiveFilter && selectValue;
      });
    },

    ...mapState({
      user: state => state.user.user
    })
  },
  mounted() {
  //  this.checkversion();
    this.getMetricsRemarkByIndId();
    this.getMetrcisDate().then(() => {
      if (this.dateInfo) {
        this.searchrMetrics(this.dateInfo); // 等到 dateInfo 获取后再执行 searchrMetrics
      }
    });
  },

}
</script>

<style scoped>
/* 设置表头背景色 */
::v-deep .el-table__header-wrapper th {
  background-color: #a0a1a3 !important;
  color: white;
}

::v-deep.el-table .row-expand-cover .el-table__expand-icon {
  display: none !important;
}

::v-deep .el-table .el-table__body-wrapper td {
  border: 1px solid #d3d7d4 !important;
  margin: 2px !important;
  padding: 2px !important;
}

::v-deep.el-table .row-main {
  font-weight: bolder;
  background-color: #dadada; /* 可选：也可同时更改背景色 */
}

/* 向右移动的样式 */
.shift-right {
  padding-left: 10px; /* 或者 margin-left: 20px; */
}


/* 使用 ::v-deep 深度选择器来确保样式覆盖 */
::v-deep .el-table__expanded-cell {
  padding: 0 !important;
  margin: 0 !important;
}

/* 使用 ::v-deep 确保嵌套的表格行样式生效 */
::v-deep .nested-row-bg {
  background-color: #d3d7d4 !important;
  color: black;
}

/* 设置嵌套表格的高度和滚动条样式 */
::v-deep .expanded-content .el-table__body-wrapper {
  max-height: 600px !important; /* 设置高度，内容超过时显示滚动条 */
  overflow-y: auto !important; /* 启用垂直滚动条 */
}


/* 不要嵌套表头biao题
::v-deep .expanded-content .el-table__header-wrapper {
  display: none !important;
}
*/
/* 使用 ::v-deep 确保嵌套表格的表头背景色生效 */
::v-deep .expanded-content .el-table__header-wrapper th {
  background-color: white !important;
  color: black !important; /* 您想要的文本颜色 */
  padding: 0 !important;
  border: 1px solid #a1a3a6 !important;

}

/* 设置表格行的边框颜色为黑色 */
::v-deep .expanded-content .el-table__body-wrapper td {
  border: 1px solid #a1a3a6 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 设置表格的外部边框为黑色 */
::v-deep .expanded-content .el-table {
  border: 2px solid #a1a3a6 !important;
}

/* 设置行之间的边框颜色 */
::v-deep .expanded-content .el-table__row {
}


.cell-content {
  display: flex;
  align-items: center;
}


/* 充满整个单元格的红色背景 */
::v-deep .red-background {
  background-color: #999d9c !important; /* 设置背景颜色 */
  color: white !important; /* 设置字体颜色 */
  width: 100%;
  height: 100%; /* 确保背景色填满单元格 */
}


.yellow-background {
  background-color: #d9d6c3 !important; /* 背景颜色为黄色 */
  height: 100%; /* 确保高度为100% */
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中内容 */
}

.date-input-wrapper {
  display: flex;

}

/* 覆盖表格和单元格边框颜色 */
::v-deep .el-input__inner::placeholder {
  font-weight: bold; /* 加粗 */
  color: black; /* 变为黑色 */
  text-align: center; /* 文本居中 */
}


.controls {
  display: flex;
  align-items: flex-end; /* 底部对齐 */
  gap: 100px; /* 控制按钮与 checkbox 之间的距离 */
}

::v-deep .el-checkbox-group {
  display: flex;
  align-items: flex-end; /* 确保 checkbox 底部对齐 */
  gap: 20px; /* 控制按钮之间的左右距离 */
}

::v-deep .custom-checkbox-button {
  margin: 0; /* 去掉按钮间的外边距 */
}

::v-deep .custom-checkbox-button .el-checkbox-button__inner {
  border: none;
  color: black;
  background-color: transparent;
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  padding: 8px;
}

::v-deep .custom-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: #a0a1a3 !important;
  color: white !important;
  border: none !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.city-content {
  display: flex;
  align-items: center; /* 确保两个元素在同一水平线上 */
}

.city-label {
  font-weight: bold;
  font-size: 13px;
  margin-right: 1px; /* 增加一些间距以分隔两个文本 */
}

.city-name {
  font-size: 13px;
  font-weight: bold;
  color: brown;

}

/* 新增的按钮组样式，确保其高度一致 */
.button-group {

  display: flex;
  align-items: center; /* 确保按钮垂直居中 */

}

.container {
  display: flex;


  margin-top: 0; /* 确保顶部没有额外的间距 */
  align-items: flex-end; /* 底部对齐 */
  justify-content: space-between; /* 将复选框和按钮组分散在两端 */
}


.underline {
  text-decoration: underline; /* 添加下划线样式 */
  cursor: pointer;
  font-size: 23px;
  font-weight: bolder;
  color: dimgrey;
}

.custom-dialog ::v-deep .el-dialog__header,
.custom-dialog ::v-deep .el-dialog__title {
  background-color: #eaebe6;
}

.custom-dialog ::v-deep .el-dialog__body {
  background-color: #eaebe6;
}


/* 修改 total 样式 */
::v-deep .el-pagination__total {

  color: #3574f0; /* 字体颜色 */
  font-size: 24px; /* 字体大小 */
  font-weight: bolder; /* 加粗 */


}
.versionitem {
  bottom: -5px;
  margin-right: 1px;
}

</style>
