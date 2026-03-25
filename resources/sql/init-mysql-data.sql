-- 初始化数据脚本

INSERT INTO sys_user(`user_id`, `account`, `pwd`, `nickname`, `email`, `phone`, `creator_id`) VALUES
(1001, "admin", "207cf410532f92a47dee245ce9b11ff71f578ebd763eb3bbea44ebd043d018fb", "超级管理员", "yang995854654@outlook.com", "13826137494", 0);


INSERT INTO `sys_role` (`role_id`, `role_name`, `role_key`, `creator_id`) VALUES
(1001, "运营端用户", "admin", 0),
(1002, "微信用户(CRM)", "wechat_crm_user", 0);


INSERT INTO `crm_customer_entity` (`id`, `entity_name`, `entity_code`, `description`, `creator_id`) VALUES
(1, "猎猫客户信息表", "huntingcat_customer", "", 1001);


INSERT INTO `crm_customer_fields`(`id`, `entity_id`, `field_key`, `field_name`, `data_type`, `options`, `is_required`, `sort_order`, `creator_id`) VALUES
(1001, 1, "customer_name", "企业名称", "text", null, 1, 0, 1001),
(1002, 1, "remark", "备注", "textarea", null, 0, 0, 1001),
(1003, 1, "contract_name", "联系人", "text", null, 1, 1, 1001),
(1004, 1, "contract_phone", "联系电话", "text", null, 1, 2, 1001),
(1005, 1, "job_title", "职位", "text", null, 1, 3, 1001),
(1006, 1, "origin_addr", "籍贯", "text", null, 1, 4, 1001),
(1007, 1, "project_name", "主营项目", "text", null, 1, 5, 1001),
(1008, 1, "region", "区域地址", "region", null, 1, 6, 1001),
(1009, 1, "detail_addr", "详细地址", "text", null, 1, 7, 1001),
(1010, 1, "cooperate_type", "合作类型", "picker", '["成品厂", "配件厂", "贸易商", "代理商"]', 1, 8, 1001),
(1011, 1, "customer_type", "客户类型", "picker", '["杂志客户", "网络客户", "会员客户", "普通客户"]', 1, 9, 1001),
(1012, 1, "customer_category", "客户分类", "picker", '["3C数码", "电子烟"]', 1, 10, 1001),
(1013, 1, "customer_source", "客户来源", "picker", '["抖音", "微信", "小红书"]', 1, 11, 1001),
(1014, 1, "is_favorite", "是否收藏", "bool", null, 0, 12, 1001);
