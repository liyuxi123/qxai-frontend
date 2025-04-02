import Mock from 'mockjs'

export default {
    getMenu: config => {
        const {userid, password} = JSON.parse(config.body)
        // 先判断用户是否存在
        // 判断账号和密码是否对应
        if (userid === 'admin' && password === 'admin') {
            return {
                code: 200,
                data: {
                    username:"超级管理员",
                    menu: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                        //    icon: 's-home',
                            url: 'Home.vue',
                        },

                           {
                            path: '/introduction',
                            name: 'introduction',
                            label: '平台简介',
                            // icon: 'location',
                            url: 'Introduction.vue',
                        },

                        {
                            label: '病人数据',
                         //   icon: 'location',
                            children: [
                                {
                                    path: '/zhuyuanpatient',
                                    name: 'zhuyuanpatient',
                                    label: '住院病人',
                            //        icon: 'setting',
                                    url: 'patient/ZhuYuanMain.vue',

                                },

                                  {
                                    path: '/menzhenpatient',
                                    name: 'menzhenpatient',
                                    label: '门诊病人',
                             //       icon: 'setting',
                                    url: 'patient/MenZhenMain.vue',

                                },
                            ]
                        },

                            {
                            label: '大模型管理',
                            children: [
                                {
                                    path: '/Prompt',
                                    name: 'Prompt',
                                    label: 'prompt管理',
                                    url: 'ai/Prompt.vue',
                                },
                            ]
                        },

                        {
                            path: '/mall',
                            name: 'mall',
                            label: '商品管理1',
                         //   icon: 'video-play',
                            url: 'Mall.vue',

                        },
                        {
                            path: '/user',
                            name: 'user',
                            label: '用户管理',
                        //    icon: 'user',
                            url: 'User.vue',
                        },
                        {
                            label: '其他',
                         //   icon: 'location',
                            children: [
                                {
                                    path: '/page1',
                                    name: 'page1',
                                    label: '页fadfsdaf面1',
                                 //   icon: 'setting',
                                    url: 'PageOne.vue',

                                },
                                {
                                    path: '/page2',
                                    name: 'page2',
                                    label: '页面2',
                              //      icon: 'setting',
                                    url: 'PageTwo.vue',

                                }
                            ]
                        },

                        {
                            label: '指标管理',
                       //     icon: 'location',
                            children: [
                                {
                                    path: '/MetricsManger',
                                    name: 'MetricsManger',
                                    label: '指标编辑',
                               //     icon: 'setting',
                                    url: 'metrics/MetricsManger.vue',

                                },
                                {
                                    path: '/NationMetrics',
                                    name: 'NationMetrics',
                                    label: '国考绩效',
                                 //   icon: 'setting',
                                    url: 'metrics/metricsRoute/NationMetrics.vue'
                                },
                                {
                                    path: '/KplMetrics',
                                    name: 'KplMetrics',
                                    label: '重点指标',
                               //     icon: 'setting',
                                    url: 'metrics/metricsRoute/KplMetrics.vue',

                                },
                                {
                                    path: '/ThridMetrics',
                                    name: 'ThridMetrics',
                                    label: '三甲指标',
                                 //   icon: 'setting',
                                    url: 'metrics/metricsRoute/ThridMetrics.vue',

                                },
                                {
                                    path: '/DailyMetrics',
                                    name: 'DailyMetrics',
                                    label: '运营指标',
                               //     icon: 'setting',
                                    url: 'metrics/metricsRoute/DailyMetrics.vue'
                                },
                                {
                                    path: '/NurseMetrics',
                                    name: 'NurseMetrics',
                                    label: '护理指标',
                              //      icon: 'setting',
                                    url: 'metrics/metricsRoute/NurseMetrics.vue'
                                },
                                {
                                    path: '/OthersMetrics',
                                    name: 'OthersMetrics',
                                    label: '其他指标',
                                 //   icon: 'setting',
                                    url: 'metrics/metricsRoute/OthersMetrics.vue',

                                },
                                {
                                    path: '/TestMetrics',
                                    name: 'TestMetrics',
                                    label: '测试指标',
                                //    icon: 'setting',
                                    url: 'metrics/metricsRoute/TestMetrics.vue',

                                },


                            ]
                        },
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        } else if (userid === 'xiaoxiao' && password === 'xiaoxiao') {
            return {
                code: 200,
                data: {
                    username:"普通用户",
                    menu: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 's-home',
                            url: 'Home.vue'
                        },


                           {
                            path: '/introduction',
                            name: 'introduction',
                            label: '平台简介',
                            icon: 'location',
                            url: 'Introduction.vue',
                        },
                        {
                            path: '/video',
                            name: 'video',
                            label: '商品管理',
                            icon: 'video-play',
                            url: 'Mall.vue'
                        }
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        } else {
            return {
                code: -999,
                data: {
                    message: '密码错误'
                }
            }
        }

    }
}