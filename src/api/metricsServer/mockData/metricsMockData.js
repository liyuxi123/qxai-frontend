const mockData = {
    "data": [
        {
            "sid": 1,
            "indId": 'c1',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user where date between {D1} and {D2}',
            "sqlDetail": 'select * from user where date between {D1} and {D2}',
            "updateTime": '2024-09-29 19:00:12',
            "author": '超级管理员',
        },
        {
            "sid": 2,
            "indId": 'b',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2024-09-29 19:00:12',
            "author": '超级管理员',
        },
        {
            "sid": 3,
            "indId": 'a1',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 4,
            "indId": 'c5',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 5,
            "indId": 'c6',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 6,
            "indId": 'bc1',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],
            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 7,
            "indId": 'a1c2',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 8,
            "indId": 'c5c3',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 9,
            "indId": 'c6c4',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 10,
            "indId": 'bd1',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 11,
            "indId": 'a1d2',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],
            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 12,
            "indId": 'c5d3',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
        {
            "sid": 13,
            "indId": 'c6d4',
            "indName": '出院人数指标',
            "modelName": ['国考绩效', '测试'],

            "sqlTotal": 'select count(1) from user',
            "sqlDetail": 'select * from user',
            "updateTime": '2016-05-03 12:12:12',
            "author": '超级管理员',
        },
    ]
};


const resultSqlData = {
    "data": [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        }, {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        }, {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        }, {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        }, {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        }, {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        }, {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },
        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },

        {
            id: 1,
            name: 'John Doe',
            email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com',
            id2: 2,
            name2: 'Jane Doe',
            email2: 'jane@example.com',
            id3: 2,
            name3: 'Jane Doe',
            email3: 'jane@example.com',
            id4: 2,
            name4: 'Jane Doe',
            email4: 'jane@example.com',
            id5: 2,
            name5: 'Jane Doe',
            email5: 'jane@example.com',
            id6: 2,
            name6: 'Jane Doe',
            email6: 'jane@example.com'
        },


        // 添加更多数据
    ]


};
//查找指标列表
const searchMetrics = (options) => {
    const {body} = options;
    const {currentPage = 1, pageSize = 10, searchQuery = ''} = JSON.parse(body); // 从请求体解析分页参数
    const {data} = mockData;

    // 根据 searchQuery 过滤数据，如果 searchQuery 不为空，返回匹配的结果
    const filteredData = searchQuery
        ? data.filter(metricsData => metricsData['indId'].includes(searchQuery))  // 支持模糊匹配
        : data;
    const total = filteredData.length; // 使用过滤后的数据长度作为总数
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    // 分页操作：从过滤后的数据中截取当前页数据
    const pagedData = filteredData.slice(start, end);

    return {
        code: 200,
        message: 'success',
        data: {
            total,      // 总条数
            currentPage,  // 当前页码
            pageSize,   // 每页大小
            list: pagedData  // 当前页的数据
        }
    };
};

//获取指标类型（后端从菜单中获取）

export const metricsTypeData = () => {
    return {
        code: 200,
        message: 'success',
        data: ['国考绩效',
            '三甲指标',
            '重点指标',
            '运营指标',
            '护理指标',
            '其他指标',
            '其他ceshi',
            '测试']

    };
};

//保存指标数据（编辑和新增）
// 逻辑解释：
// indId 已存在但 sid 不存在时：
//
// 首先查找 indId 是否存在。
// 如果 sid 不存在但 indId 存在，程序会继续更新该 indId 对应的记录，并保留原来的 sid。
// 在返回的消息中会提示 indId 已存在，但继续更新了对应的数据。
// 正常更新或新增：
//
// 如果 sid 存在，正常更新。
// 如果 sid 和 indId 都不存在，进行新增操作。
// 这样你就能提示用户 indId 已存在，但依旧可以进行更新操作。
const updateMetric = (options) => {
    // 假设传入的 options 结构为 { body: JSON.stringify({...}) }
    const {body} = options;
    const {metricData, sqlType} = JSON.parse(body); // 从请求体解析数据和 sqlType
    const {sid, indId} = metricData; // 获取要更新的指标的 sid 和 indId

    // 默认字段，确保所有字段都存在
    const defaultFields = {
        sid: null,
        indId: '',
        indName: '',
        modelName: '',
        sqlTotal: '',
        sqlDetail: '',
        updateTime: '',
        author: '',
    };

    // 查找是否存在相同的 indId
    const indIdIndex = mockData.data.findIndex(metric => metric.indId === indId);

    // 查找 sid 对应的数据
    let dataIndex = mockData.data.findIndex(metric => metric.sid === sid);

    if (dataIndex !== -1) {
        // 更新对象
        mockData.data[dataIndex] = {
            ...defaultFields, // 保证所有字段都有默认值
            ...mockData.data[dataIndex],
            ...metricData // 直接使用 metricData 进行更新
        };

        return {
            code: 200,
            message: `${indId} 更新成功`,
            data: {
                data: mockData.data[dataIndex], // 返回更新后的数据
                msg: "更新成功"
            }
        };
    } else if (indIdIndex !== -1) {
        //  当 sid 不存在，但 indId 已存在时，提示用户 indId 已存在，但继续更新 indId 对应的数据
        mockData.data[indIdIndex] = {
            ...defaultFields, // 保证所有字段都有默认值
            ...mockData.data[indIdIndex],
            ...metricData,
            sid: mockData.data[indIdIndex].sid // 保留原有 sid
        };

        return {
            code: 200,
            message: ` ${indId} 已存在，数据已经被覆盖！`,
            data: {
                data: mockData.data[indIdIndex],// 返回更新后的数据
                msg: "已存在，数据已经被覆盖！"

            }
        };
    } else {
        // 当 sid 和 indId 都不存在时，进行新增操作
        const newSid = Math.max(...mockData.data.map(metric => metric.sid)) + 1; // 自增 sid
        const newMetric = {
            ...defaultFields, // 保证所有字段都有默认值
            ...metricData,
            sid: newSid // 创建新对象并赋予新 sid
        };
        mockData.data.push(newMetric); // 插入新数据

        return {
            code: 200,
            message: `  ${indId} 新增成功`,
            data:
                {
                    data: newMetric,
                    msg: '新增成功'
                }
        };
    }
};


const deleteMetric = (options) => {
    const {body} = options;
    const {sid} = JSON.parse(body); // 从请求体解析要删除的 sid

    let dataIndex = mockData.data.findIndex(metric => metric.sid === sid);

    if (dataIndex !== -1) {
        mockData.data.splice(dataIndex, 1); // 删除对应数据
        return {
            code: 200,
            data: '删除成功',
            message: '',
        };
    } else {
        return {
            code: 202,
            data: null,
            message: '编号不存在',
        };
    }
};


const getMetricByIndId = (options) => {
    const {body} = options;
    const {indId} = JSON.parse(body); // 从请求体解析要查找的 sid

    const metric = mockData.data.find(metric => metric.indId === indId); // 查找对应的 indId

    if (metric) {
        return {
            code: 200,
            message: '查询成功',
            data: metric, // 返回找到的数据
        };
    } else {
        return {
            code: 202,
            message: '数据不存在',
        };
    }
};


const runSql = (options) => {
    const {data} = resultSqlData;
    return {
        code: 200,
        message: 'success',
        data: {
            total: 40,      // 总条数
            currentPage: 1,  // 当前页码
            pageSize: 10,   // 每页大小
            list: data  // 当前页的数据
        }
    }
}

//获取指标备注
export const getMetricsRemarkByIndId =  (options) =>  {
    const {indId} = options; //
    return {
        code: 200,
        message: 'success',
        data: {
            updateTime:'String类型时间2024-01-01 34:99:00',
            indId: indId, // 为空也要传indId回
            indName: '',
            remark:'备注nei内容kasjdfhashdf455',
            remarkType:
                   ['缺表/字段',
                    '逻辑不明',
                    ],
            remarkTypeALL:[
                    '缺表/字段',
                    '数据库设计缺陷',
                    '编号错误（不对应/缺失等）',
                    '逻辑不明',
                    '技术型（过于复杂/sql语言无法统计）',
                    '需NPL处理（AI）',

                    '医院未提供接口数据',
                    '医院无该业务',
                    '医院特定逻辑',

                    '其他'

            ]
        },
    };
};

//更新或者插入指标备注

export const updateMetricsRemark = (options) => {

     console.log("updateMetricsRemark参数:", options);  // 查看传入的 options 参数

    const { remarkType, indId, indName, remark,author } = options;  // 获取字段
    return {
        code: 200,
        message: 'success',
        data: {
            indId: indId,
            remarkType: remarkType,
            indName: indName,
            remark: remark,
            author:author,
        },
    };
};


//删除指标备注
export const deleteRemarkByIndId = (options) => {

     const {indId} = options; //
    return {
        code: 200,
        message: 'success',
        data: {
            indId: indId, //  chu传回indId
        },
    };
};









export default {
    searchMetrics,
    updateMetric,
    deleteMetric,
    getMetricByIndId,  // 新增的查找方法
    metricsTypeData,
    runSql,
    getMetricsRemarkByIndId,
    updateMetricsRemark,
    deleteRemarkByIndId,
}