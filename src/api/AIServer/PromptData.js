// src/mock.js
const promptdata = {
  "code": 200,
  "message": "success",
  "data": {
    "result": null,
    "rows": [
      {
        "id": 1,
        "paramName": "医院名称",
        "paramKey": "hospital_name",
        "paramValue": "全息未来医院",
        "paramModule": "hospital_info",
        "paramType": "String",
        "description": "医院名称",
        "addTime": "2025-04-01T14:02:30"
      },
      {
        "id": 2,
        "paramName": "门诊病历生成大模型",
        "paramKey": "llm_outpatient_emr_generate",
        "paramValue": "deepseek-v3",
        "paramModule": "llm_select",
        "paramType": "String",
        "description": "标识门诊病历生成的大模型",
        "addTime": "2025-04-01T14:04:17"
      },
      {
        "id": 3,
        "paramName": "门诊病历生成提示词",
        "paramKey": "prompt_outpatient_emr_generate",
        "paramValue": "根据以下现有患者的病历的内容，以及补充问诊的内容，重新生成新的病历，要求如下：\r\n①，补充问诊为医生与患者的对话交流转文字可能存在干扰，可能存在一些干扰信号或者转文字的错误，去除与诊疗无关的干扰内容，纠正转文字可能存在的错误。按照现病史，既往史，个人史，手术史，麻醉史，用药史，过敏史等生成补充文件整理。要求内容详细完整，无遗漏。\r\n②，包含现有病历与补充问诊整理的所有内容，内容完整不遗漏；\r\n③，现有病历与补充问诊整理有矛盾的部分，以补充问诊整理为准。",
        "paramModule": "llm_prompt",
        "paramType": "String",
        "description": "门诊病历生成提示词",
        "addTime": "2025-04-01T14:05:02"
      },
      {
        "id": 4,
        "paramName": "入院记录生成提示词",
        "paramKey": "prompt_admission_record",
        "paramValue": "生成标准化入院记录病历：基于问诊病历及检验检查报告，严格按国家电子病历规范生成平面化数据结构\r\n【格式强制】\r\n- 所有字段值必须为纯文本字符串\r\n- 禁止JSON嵌套（原现病史子结构转为字符串描述）\r\n【返回结构】\r\n- 严格按照提供的基准字段返回\r\n- 严禁出现基准字段以外的其他字段\r\n- 基准字段包括：主诉、现病史、既往史、个人史、家族史、婚育史、过敏史、体格检查、辅助检查、专科检查、诊断\r\n返回严格平面化的JSON结构，确保值字段均为字符串类型，不允许返回除JSON结构以外任何内容",
        "paramModule": "llm_prompt",
        "paramType": "String",
        "description": "入院记录生成提示词",
        "addTime": "2025-04-01T14:06:11"
      },
      {
        "id": 5,
        "paramName": "门诊病历生成提示词返回结构",
        "paramKey": "prompt_generate_return",
        "paramValue": "【返回结构】\r\n- 严格按照提供的基准字段返回\r\n- 严禁出现基准字段以外的其他字段\r\n- 基准字段包括：诊断、主诉、现病史、既往史、个人史、家族史、体格检查、辅助检查、诊疗计划\r\n返回严格平面化的JSON结构，确保值字段均为字符串类型，不允许返回除JSON结构以外任何内",
        "paramModule": "prompt_return",
        "paramType": "String",
        "description": "门诊病历生成提示词返回结构",
        "addTime": "2025-04-01T15:55:17"
      }
    ],
    "count": 5
  }
};

// 获取模型数据的函数，支持分页
const getPromptdata = () => {
 //  // 计算分页的起始和结束位置
 //  const start = (currentPage - 1) * pageSize;
 //  const end = start + pageSize;
 //
 //  // 获取当前页的数据
 // const list = promptdata.list.slice(start, end);


  return promptdata;
};

export default {
  getPromptdata
};
