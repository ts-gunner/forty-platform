-- 初始化数据脚本

INSERT INTO sys_user(`user_id`, `account`, `pwd`, `nickname`, `email`, `phone`, `creator_id`) VALUES
(1001, "admin", "207cf410532f92a47dee245ce9b11ff71f578ebd763eb3bbea44ebd043d018fb", "超级管理员", "yang995854654@outlook.com", "13826137494", 0);


INSERT INTO `sys_role` (`role_id`, `role_name`, `role_key`, `creator_id`) VALUES
(1001, "运营端用户", "admin", 0),
(1002, "微信用户(CRM)", "wechat_crm_user", 0);
