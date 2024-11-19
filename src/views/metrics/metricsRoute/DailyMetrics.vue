<template>
  <el-table

    :data="tableData2"
    border

    style="width: 100%;"
  >
    <el-table-column
      prop="provid"
      label="科室"
      align="center"
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
</template>

<script>
export default {
  data() {
    return {
      tableData2: [
        {
          "provid": "全院",
          "1.2同期出院患者人次数": { APP: "8888", DM: "8888" },
          "1.1门诊患者人次数": { APP: "555", DM: "11" }
        },
        {
          "provid": "内科",
          "1.2同期出院患者人次数": { APP: "12", DM: "555" },
          "1.1门诊患者人次数": { APP: "11", DM: "75" }
        }
      ],
      tableData2dynamicColumns: []
    };
  },
  mounted() {
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
  methods: {
    // 控制表头单元格的合并
    objectSpanMethod({ rowIndex, columnIndex }) {
      // 如果是第一列（提供方），不合并
      if (columnIndex === 0) {
        return [1, 1];
      }
      // 如果是主表头的第一个层级，合并主表头跨两列
      if (columnIndex === 1) {
        return [1, 2]; // 合并列
      }
      // 默认不合并其他单元格
      return [1, 1];
    }
  }
};
</script>
