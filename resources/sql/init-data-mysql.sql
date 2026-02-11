-- ***************************************************************************
-- sys 组织架构相关表
-- ***************************************************************************

-- 权限
INSERT INTO sys_permission
(`permission_id`, `permission_name`, `type`, `perms`, `creator`, `updater`, `creator_id`, `updater_id`)
VALUES (3001, '超管权限', 0, '*', 'sysadmin', 'sysadmin', 1001, 1001),
       (3002, '管理端', 0, 'admin:*', 'sysadmin', 'sysadmin', 1001, 1001),
       (3003, '用户端', 0, 'app:*', 'sysadmin', 'sysadmin', 1001, 1001);


-- 角色
INSERT INTO sys_role
(`role_id`, `role_name`, `role_key`, `creator`, `updater`, `creator_id`, `updater_id`)
VALUES (2001, '超管', 'super-admin', 'sysadmin', 'sysadmin', 1001, 1001),
       (2002, '管理员', 'admin', 'sysadmin', 'sysadmin', 1001, 1001),
       (2003, '普通用户', 'user', 'sysadmin', 'sysadmin', 1001, 1001),
       (2004, '运营人员', 'operator', 'sysadmin', 'sysadmin', 1001, 1001);


-- 角色权限关联
INSERT INTO sys_role_permission_rel
    (`role_id`, `permission_id`)
VALUES (2001, 3001),
       (2002, 3002),
       (2002, 3003),
       (2003, 3003),
       (2004, 3002);


-- 用户
INSERT INTO sys_user
(`user_id`, `account`, `pwd`, `nickname`, `is_admin`, `creator`, `updater`, `creator_id`, `updater_id`)
VALUES (1001, 'sysadmin', 'afd84507f0394b705272e2434e5ec8f7f46967609ff772cdeba6d5543fff3aea', '超级管理员', 1,
        '超级管理员', '超级管理员', 1001, 1001),
       (1002, 'admin', 'afd84507f0394b705272e2434e5ec8f7f46967609ff772cdeba6d5543fff3aea', '管理员', 0, 'sysadmin',
        'sysadmin', 1001, 1001),
       (1003, 'user-001', 'afd84507f0394b705272e2434e5ec8f7f46967609ff772cdeba6d5543fff3aea', '普通用户', 0, 'sysadmin',
        'sysadmin', 1001, 1001),
       (1004, 'test-001', 'afd84507f0394b705272e2434e5ec8f7f46967609ff772cdeba6d5543fff3aea', '测试用户', 0, 'sysadmin',
        'sysadmin', 1001, 1001),
       (1005, 'operator-001', 'afd84507f0394b705272e2434e5ec8f7f46967609ff772cdeba6d5543fff3aea', '运营用户', 0,
        'sysadmin', 'sysadmin', 1001, 1001);


-- 用户角色关联
INSERT INTO sys_user_role_rel
    (`user_id`, `role_id`)
VALUES (1001, 2001),
       (1001, 2002),
       (1002, 2002),
       (1003, 2003),
       (1004, 2003),
       (1005, 2004);



-- ***************************************************************************
-- AIGC 模块相关表
-- ***************************************************************************

-- Agent分类表 aigc_agent_category
INSERT INTO aigc_agent_category
(`id`, `name`, `key`, `description`, `type`, `sort_order`, `creator`, `creator_id`, `is_delete`)
VALUES (1, '知识库', 'knowledge', '知识库', 'knowledge', 0, 'sysadmin', 1001, 0),
       (2, '数据库', 'data', '数据库', 'data', 1, 'sysadmin', 1001, 0);


--  aigc_knowledge_base
INSERT INTO aigc_knowledge_base
(kb_id, category_id, name, description, `kb_type`, `code`, user_id, creator, creator_id)
VALUES (101, 1, '海洋', '海洋知识库', 'commercial', 'ocean', 0, '0', 0),
       (102, 1, '流通', '流通知识库', 'commercial', 'distribution', 0, '0', 0),
       (103, 1, '食品加工', '食品加工知识库', 'commercial', 'processing', 0, '0', 0),

--       (201, 2, '海洋', '海洋数据库', 'commercial', 'ocean', 0, '0', 0),
--       (202, 2, '流通', '流通数据库', 'commercial', 'distribution', 0, '0', 0),
       (203, 2, '食品加工', '食品加工数据库', 'commercial', 'processing', 0, '0', 0),

#        (201, 2, '气味化合物','甲壳类/头足类共1688种气味化合物分子，涵盖多物种、加工方式、组织部位;部分内容包括形成机制、异味抑制方法化合物包括:阈值、浓度、检测仪器、气味特征',
#         'commercial', 'odour_compound', 0, '0', 0),
#        (202, 2, '呈味化合物','游离氨基酸、呈味核苷酸、呈味肽和无机离子共276篇，涵盖多物种、加工方式、组织部位;化合物包括浓度含量',
#         'commercial', 'flavour_compound', 0, '0', 0),
#        (203, 2, '营养素', '营养素组成与功能活性成分验证参考文献数量668篇，涵盖多物种、组织部位;营养素成分包括浓度含量',
#         'commercial', 'nutrient', 0, '0', 0),
       (901, 1, '个人知识库', '个人知识库', 'personal', NULL, 1003, 'user-001', 1003);

-- ***************************************************************************
-- 资源管理模块相关表
-- ***************************************************************************


--  sys_folder
INSERT INTO sys_folder
(folder_id, parent_id, business_type, business_id, name, `kb_path`, `rel_path`, user_id, creator, creator_id)
VALUES (101, 0, 1, 101, '海洋', '/', 'aigc/knowledge/commercial/ocean', 0, '0', 0),
       (102, 0, 1, 102, '流通', '/', 'aigc/knowledge/commercial/distribution', 0, '0', 0),
       (103, 0, 1, 103, '食品加工', '/', 'aigc/knowledge/commercial/processing', 0, '0', 0),

       (103001, 103, 1, 103, '渔业年鉴', '/fishery_yearbook', 'aigc/knowledge/commercial/processing/fishery_yearbook', 0, '0', 0),
       (103002, 103, 1, 103, '法规', '/regulation', 'aigc/knowledge/commercial/processing/regulation', 0, '0', 0),
       (103003, 103, 1, 103, '学位论文', '/degree_dissertation', 'aigc/knowledge/commercial/processing/degree_dissertation', 0, '0', 0),
       (103004, 103, 1, 103, '学术论文', '/academic_paper', 'aigc/knowledge/commercial/processing/academic_paper', 0, '0',0),
       (103005, 103, 1, 103, '外文文献', '/foreign_literature', 'aigc/knowledge/commercial/processing/foreign_literature', 0,'0', 0),
       (103006, 103, 1, 103, '国际出版物', '/international_publication','aigc/knowledge/commercial/processing/international_publication', 0, '0', 0),
       (103007, 103, 1, 103, '专利', '/patent', 'aigc/knowledge/commercial/processing/patent', 0, '0', 0),
       (103008, 103, 1, 103, '标准', '/standard', 'aigc/knowledge/commercial/processing/standard', 0, '0', 0),


       (201, 0, 1, 201, '海洋', '/', 'aigc/data/commercial/ocean', 0, '0', 0),
       (202, 0, 1, 202, '流通', '/', 'aigc/data/commercial/distribution', 0, '0', 0),
       (203, 0, 1, 203, '食品加工', '/', 'aigc/data/commercial/processing', 0, '0', 0),

       (203001, 203, 1, 203, '气味化合物', '/odour_compound', 'aigc/data/commercial/processing/odour_compound', 0, '0', 0),
       (203002, 203, 1, 203, '呈味化合物', '/flavour_compound', 'aigc/data/commercial/processing/flavour_compound', 0, '0', 0),
--       (203003, 203, 1, 203, '营养素', '/nutrient', 'aigc/data/commercial/processing/nutrient', 0, '0', 0),


       (901, 0, 1, 901, '个人知识库', '/', 'aigc/knowledge/personal/user-001_个人知识库', 1003, 'user-001', 1003),
       (901001, 901, 1, 901, '个人文件夹', '/个人文件夹', 'aigc/knowledge/personal/user-001_个人知识库/个人文件夹',
        1003, 'user-001', 1003)
;

-- ***************************************************************************
-- xxxx 模块相关表
-- ***************************************************************************




