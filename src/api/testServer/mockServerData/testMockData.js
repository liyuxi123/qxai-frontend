const mockData = {
  "code": 200,
  "message": "success",
  "data": [
    {
            "科室编号": "0371",
            "科室名称": "眼五科(眼底病)"
        },
        {
            "科室编号": "0372",
            "科室名称": "眼六科(玻切)"
        },
        {
            "科室编号": "0369",
            "科室名称": "眼二科(白内障)"
        },
        {
            "科室编号": "0035",
            "科室名称": "神经一科"
        },
        {
            "科室编号": "0033",
            "科室名称": "内分泌科"
        },
        {
            "科室编号": "0040",
            "科室名称": "普外二科"
        },
        {
            "科室编号": "0023",
            "科室名称": "老年病科"
        },
        {
            "科室编号": "0329",
            "科室名称": "心血管内科二组"
        },
        {
            "科室编号": "0022",
            "科室名称": "呼吸内科"
        },
        {
            "科室编号": "0051",
            "科室名称": "泌尿外科"
        },
        {
            "科室编号": "0027",
            "科室名称": "肿瘤血液职业病科"
        },
        {
            "科室编号": "0032",
            "科室名称": "肾内科"
        },
        {
            "科室编号": "0042",
            "科室名称": "神经外科"
        },
        {
            "科室编号": "0036",
            "科室名称": "神经二科"
        },
        {
            "科室编号": "0368",
            "科室名称": "眼一科(白内障)"
        },
        {
            "科室编号": "0045",
            "科室名称": "妇科"
        },
        {
            "科室编号": "0279",
            "科室名称": "耳鼻咽喉科"
        },
        {
            "科室编号": "0370",
            "科室名称": "眼三科(青光眼)"
        },
        {
            "科室编号": "0345",
            "科室名称": "介入放射科"
        },
        {
            "科室编号": "0053",
            "科室名称": "ICU"
        },
        {
            "科室编号": "0030",
            "科室名称": "儿科"
        },
        {
            "科室编号": "0364",
            "科室名称": "心血管内科三组"
        },
        {
            "科室编号": "0025",
            "科室名称": "消化内科"
        },
        {
            "科室编号": "0039",
            "科室名称": "普外一科"
        },
        {
            "科室编号": "0019",
            "科室名称": "康复医学科"
        },
        {
            "科室编号": "0020",
            "科室名称": "心血管内科一组"
        },
        {
            "科室编号": "0041",
            "科室名称": "骨科"
        },
        {
            "科室编号": "000000",
            "科室名称": "全院"
        }
  ]
};

// 获取科室列表（支持分页，POST 请求）
const getDeptListByPost = (options) => {
  const { body } = options;
  const { page = 1, pageSize = 10 } = JSON.parse(body); // 从请求体解析分页参数

  const { data } = mockData;
  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const pagedData = data.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      total,
      page,
      pageSize,
      list: pagedData
    }
  };
};

// 获取科室列表（支持分页，GET 请求）
const getDeptListByGet = (options) => {
  const { url } = options;
  const params = new URLSearchParams(url.split('?')[1]); // 从 URL 参数中解析分页参数

  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 10;

  const { data } = mockData;
  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const pagedData = data.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      total,
      page,
      pageSize,
      list: pagedData
    }
  };
};

// 新增科室
const addDept = (options) => {
  const { body } = options;
  const newDept = JSON.parse(body); // 解析请求体
  const { data } = mockData;

  // 检查是否已存在相同科室编号
  const exists = data.some(dept => dept['科室编号'] === newDept['科室编号']);
  if (exists) {
    return { code: 400, message: '科室编号已存在' };
  }

  // 添加新的科室
  data.push(newDept);
  return { code: 200, message: '新增成功', data: newDept };
};

// 删除科室
const deleteDept = (options) => {
  const { body } = options;
  const { deptId } = JSON.parse(body); // 解析请求体
  const { data } = mockData;

  // 查找科室并删除
  const index = data.findIndex(dept => dept['科室编号'] === deptId);
  if (index === -1) {
    return { code: 404, message: '科室未找到' };
  }

  data.splice(index, 1);
  return { code: 200, message: '删除成功' };
};

// 根据科室编号获取信息
const getDeptById = (options) => {
  const { body } = options;
  const { deptId } = JSON.parse(body); // 解析请求体
  const { data } = mockData;

  // 查找科室
  const dept = data.find(dept => dept['科室编号'] === deptId);
  if (!dept) {
    return { code: 404, message: '科室未找到' };
  }

  return { code: 200, message: '成功', data: dept };
};

export default {
  getDeptListByPost,
  getDeptListByGet,
  addDept,
  deleteDept,
  getDeptById
};
