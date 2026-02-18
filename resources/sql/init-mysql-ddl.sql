-- ***************************************************************************
-- sys 组织架构相关表
-- ***************************************************************************
DROP TABLE IF EXISTS sys_user;

CREATE TABLE IF NOT EXISTS `sys_user` (
  `user_id` BIGINT UNSIGNED PRIMARY KEY COMMENT '用户ID',
  `account` VARCHAR(32) NOT NULL COMMENT '用户账号',
  `pwd` VARCHAR(100) NOT NULL COMMENT '用户密码',
  `openid` VARCHAR(100) NULL COMMENT '微信小程序唯一标识id',
  `unionid` VARCHAR(100) NULL COMMENT '微信开放平台id',
  `nickname` VARCHAR(255) NOT NULL COMMENT '用户昵称',
  `avatar_id` VARCHAR(255) NULL COMMENT '头像url地址',
  `email` VARCHAR(255) NULL COMMENT '邮箱',
  `phone` VARCHAR(255) NULL COMMENT '手机号码',
  `status` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '账号状态, 0: 停用, 1:正常',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  UNIQUE INDEX `account` (`account`) USING BTREE
) ENGINE = InnoDB DEFAULT charset = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT '用户信息表';

DROP TABLE IF EXISTS sys_role;

CREATE TABLE IF NOT EXISTS sys_role (
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `role_name` VARCHAR(100) NOT NULL COMMENT '角色名称',
  `role_key` VARCHAR(50) NOT NULL COMMENT '角色标识',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`role_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色表';

DROP TABLE IF EXISTS sys_permission;

CREATE TABLE IF NOT EXISTS sys_permission (
  `permission_id` BIGINT NOT NULL COMMENT '权限ID',
  `permission_name` VARCHAR(50) NOT NULL COMMENT '权限名称',
  `type` TINYINT(1) DEFAULT 0 COMMENT '类型：0=菜单(C)，1=按钮(F)',
  `perms` VARCHAR(100) DEFAULT NULL COMMENT '权限标识（如：user:list, user:add）',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`permission_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '权限表';



DROP TABLE IF EXISTS sys_user_role_rel;

CREATE TABLE IF NOT EXISTS sys_user_role_rel (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  UNIQUE KEY `idx_user_role` (`user_id`, `role_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户角色关联表';

DROP TABLE IF EXISTS sys_role_permission_rel;

CREATE TABLE IF NOT EXISTS sys_role_permission_rel (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT NOT NULL COMMENT '权限ID',
  UNIQUE KEY `idx_role_permission` (`role_id`, `permission_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '角色权限关联表';

-- ***************************************************************************
-- AIGC 模块相关表
-- ***************************************************************************
-- Agent分类表
DROP TABLE IF EXISTS aigc_agent_category;

CREATE TABLE IF NOT EXISTS aigc_agent_category (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT '名称',
  `key` VARCHAR(64) NOT NULL COMMENT '业务唯一标识Key',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `type` VARCHAR(100) NOT NULL COMMENT '类型',
  `sort_order` INT(11) DEFAULT '0' COMMENT '排序权重 (数字越小越靠前)',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Agent分类表';

-- KB知识库
DROP TABLE IF EXISTS aigc_knowledge_base;

CREATE TABLE IF NOT EXISTS aigc_knowledge_base (
  `kb_id` BIGINT NOT NULL COMMENT '知识库ID',
  `category_id` BIGINT NOT NULL COMMENT 'Agent分类表ID',
  `name` VARCHAR(100) NOT NULL COMMENT '名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `kb_type` VARCHAR(64) NOT NULL COMMENT '类型，commercial/personal，也用做区分集合',
  `code` VARCHAR(64) COMMENT '业务唯一标识code，用来做分区用，如type=personal可为空',
  `preview_img_id` BIGINT NULL COMMENT '预览图id/资源表id',
  `user_id` BIGINT NOT NULL COMMENT '所属用户ID',
  `sort_order` INT(11) DEFAULT '0' COMMENT '排序权重 (数字越小越靠前)',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`kb_id`),
  KEY `idx_category_id` (`category_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '知识库表';

-- 对话记录表
DROP TABLE IF EXISTS aigc_session;

CREATE TABLE aigc_session (
  `session_id` BIGINT NOT NULL PRIMARY KEY,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `title` VARCHAR(255) NOT NULL COMMENT '会话标题',
  `description` VARCHAR(500) COMMENT '会话描述（存第一次聊天内容的截取片段）',
  `agent_key` VARCHAR(50) NOT NULL COMMENT '会话agent类型key，分为 knowledge/data',
  `last_chat_time` TIMESTAMP NOT NULL COMMENT '上次对话时间',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  KEY `idx_user_id` (`user_id`, `last_chat_time`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '对话记录表';

-- 对话消息记录表
DROP TABLE IF EXISTS aigc_session_message;

CREATE TABLE aigc_session_message (
  `message_id` BIGINT NOT NULL PRIMARY KEY,
  `session_id` BIGINT NOT NULL COMMENT '会话ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `role` VARCHAR(255) COMMENT '角色',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  KEY `idx_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '对话消息记录表';

-- 问题示例
DROP TABLE IF EXISTS aigc_question_example;

CREATE TABLE aigc_question_example (
  `question_id` BIGINT NOT NULL PRIMARY KEY,
  `question` VARCHAR(255) NOT NULL COMMENT '问题',
  `agent_key` VARCHAR(255) NOT NULL COMMENT '知识库分类， 知识库 | 数据库',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态，0:不可用， 1:可用',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '问题示例表';

-- 入库算法调用记录表
DROP TABLE IF EXISTS aigc_task_status_record;

CREATE TABLE IF NOT EXISTS aigc_task_status_record (
  `record_id` BIGINT NOT NULL COMMENT '记录ID',
  `resource_id` BIGINT NOT NULL COMMENT '文件ID',
  `task_id` VARCHAR(64) DEFAULT NULL COMMENT '任务ID',
  `task_type` TINYINT NOT NULL COMMENT '任务类型：1-VECTORIZATION-向量化, 2-PREPROCESS-预处理, 3-COMPRESS-压缩',
  `task_params` TEXT DEFAULT NULL COMMENT '入参',
  `status` TINYINT NOT NULL DEFAULT '1' COMMENT '状态：1-NOT_STARTED-未开始, 2-PENDING-挂起, 3-INPROGRESS-进行中, 4-COMPLETED-完成, 5-ERROR-出错, 6-CANCELED-取消',
  `progress` TINYINT(3) UNSIGNED DEFAULT 0 COMMENT '进度 (0-100)',
  `msg` TEXT COMMENT '返回信息',
  `algo_call_time` TIMESTAMP DEFAULT NULL COMMENT '调用入库算法时间',
  `last_poll_time` TIMESTAMP DEFAULT NULL COMMENT '最后一次轮询时间',
  `vector_status_update_time` TIMESTAMP DEFAULT NULL COMMENT '状态更新时间',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`record_id`),
  KEY `idx_resource_id` (`resource_id`) COMMENT '文件ID索引',
  KEY `idx_task_id` (`task_id`) COMMENT '任务ID索引',
  KEY `idx_status` (`status`) COMMENT '状态索引'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '入库算法调用记录表';

-- ***************************************************************************
-- CMS 模块相关表
-- ***************************************************************************
-- 内容分类表
-- DROP TABLE IF EXISTS cms_category;
-- CREATE TABLE IF NOT EXISTS cms_category (
--     `category_id` bigint NOT NULL COMMENT '分类ID',
--     `parent_id` bigint DEFAULT '0' COMMENT '父级ID',
--     `category_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
--     `sort` int DEFAULT '0' COMMENT '排序',
--     `creator`         varchar(255) NOT NULL COMMENT '创建者',
--     `updater`         varchar(255) COMMENT '更新者',
--     `creator_id`      BIGINT       NOT NULL COMMENT '创建者id',
--     `updater_id`      BIGINT COMMENT '更新者id',
--     `is_delete`       TINYINT           DEFAULT 0 COMMENT '逻辑删除',
--     `create_time`     TIMESTAMP         DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
--     `update_time`     TIMESTAMP         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--     `delete_time`     TIMESTAMP    NULL DEFAULT NULL COMMENT '删除时间',
--     PRIMARY KEY (`category_id`),
--     KEY `idx_parent_id` (`parent_id`)
-- ) ENGINE=InnoDB
--   DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容分类表';
-- 标签表
DROP TABLE IF EXISTS cms_tag;

CREATE TABLE IF NOT EXISTS cms_tag (
  `tag_id` BIGINT NOT NULL COMMENT '标签ID',
  `tag_name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`tag_id`),
  KEY `idx_tag_name` (`tag_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '标签表';

-- 文章主表
DROP TABLE IF EXISTS cms_article;

CREATE TABLE IF NOT EXISTS cms_article (
  `article_id` BIGINT NOT NULL COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '摘要',
  `resource_id` BIGINT COMMENT '资源ID(封面图)',
  `article_type` TINYINT DEFAULT '1' COMMENT '类型：1=原创, 2=转载',
  `author_name` VARCHAR(50) DEFAULT NULL COMMENT '作者名',
  `publish_time` timestamp NULL DEFAULT NULL COMMENT '发布时间',
  `is_top` TINYINT DEFAULT '0' COMMENT '是否置顶：0=否, 1=是',
  `status` TINYINT DEFAULT '0' COMMENT '状态：0=草稿, 1=已发布, 2=已下架, 3=定时未发布',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`article_id`),
  KEY `idx_title` (`title`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文章主表';

-- 文章详情表
DROP TABLE IF EXISTS cms_article_content;

CREATE TABLE IF NOT EXISTS cms_article_content (
  `article_id` BIGINT NOT NULL COMMENT '文章ID',
  `content` LONGTEXT COMMENT '详情内容',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`article_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文章详情表';

-- 文章统计表
DROP TABLE IF EXISTS cms_article_stats;

CREATE TABLE IF NOT EXISTS cms_article_stats (
  `article_id` BIGINT NOT NULL COMMENT '文章ID',
  `views` BIGINT DEFAULT '0' COMMENT '浏览量',
  `likes` BIGINT DEFAULT '0' COMMENT '点赞数',
  `hot_score` DOUBLE DEFAULT '0' COMMENT '热度分值',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`article_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文章统计表';

-- 文章标签关联表
DROP TABLE IF EXISTS cms_article_tag_rel;

CREATE TABLE IF NOT EXISTS cms_article_tag_rel (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT NOT NULL COMMENT '文章ID',
  `tag_id` BIGINT NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_article_tag` (`article_id`, `tag_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文章标签关联表';

-- ***************************************************************************
-- 资源管理模块相关表
-- ***************************************************************************
-- folder 文件夹
DROP TABLE IF EXISTS sys_folder;

CREATE TABLE IF NOT EXISTS sys_folder (
  `folder_id` BIGINT NOT NULL COMMENT '文件夹ID',
  `parent_id` BIGINT COMMENT '父文件夹ID',
  `business_type` TINYINT DEFAULT '0' COMMENT '业务类型: 1=AIGC，2=CMS',
  `business_id` BIGINT DEFAULT '0' COMMENT '业务ID，如果business_type=1，则为kb_id',
  `name` VARCHAR(100) NOT NULL COMMENT '文件夹名称',
  `kb_path` VARCHAR(255) NOT NULL COMMENT '在知识库中的路径',
  `rel_path` VARCHAR(255) NOT NULL COMMENT '相对路径；如果是知识库类型，则为[knowledge_base.path]/folder_name; 如type=personal，则根folder_name=[account]_[kbname]',
  `user_id` BIGINT NOT NULL COMMENT '所属用户ID',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`folder_id`),
  KEY `sys_folder_business_id_kb_path_IDX` (`business_id`, `kb_path`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文件夹管理表';

-- 资源/素材表
DROP TABLE IF EXISTS sys_resource;

CREATE TABLE IF NOT EXISTS sys_resource (
  `resource_id` BIGINT NOT NULL COMMENT '资源ID',
  `folder_id` BIGINT COMMENT '所属文件夹ID，可为空',
  `storage_type` TINYINT DEFAULT '1' COMMENT '存储类型: 1=本地, 2=OSS, 3=minio',
  `url` VARCHAR(500) NOT NULL COMMENT '文件存储的相对路径',
  `original_name` VARCHAR(255) DEFAULT NULL COMMENT '原文件名',
  `file_name` VARCHAR(255) DEFAULT NULL COMMENT '文件名',
  `business_type` TINYINT DEFAULT '0' COMMENT '业务类型: 1=AIGC（kb_id），2=CMS',
  `business_id` BIGINT DEFAULT '0' COMMENT '业务ID，如果business_type=1，则为kb_id',
  `business_path` VARCHAR(500) COMMENT '业务方面的相对路径',
  `media_type` TINYINT DEFAULT '1' COMMENT '媒体类型: 1=图片, 2=视频, 3=音频, 4=文档',
  `mime_type` VARCHAR(100) DEFAULT NULL COMMENT 'MIME类型',
  `file_suffix` VARCHAR(20) DEFAULT NULL COMMENT '文件后缀',
  `file_magic` VARCHAR(50) DEFAULT NULL COMMENT '文件魔术值',
  `file_size` BIGINT NOT NULL DEFAULT '0' COMMENT '文件大小(单位: B)',
  `user_id` BIGINT DEFAULT '0' COMMENT '所属用户ID',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`resource_id`),
  KEY `sys_resource_business_path_IDX` (`business_path`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '资源素材表';

-- ***************************************************************************
-- common模块相关表
-- ***************************************************************************
-- 审计表
DROP TABLE IF EXISTS sys_audit_log;

CREATE TABLE IF NOT EXISTS sys_audit_log (
  `audit_log_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '审计日志ID',
  `user_id` BIGINT NOT NULL COMMENT '操作用户ID',
  `user_info` JSON DEFAULT NULL COMMENT '用户信息（UserLoginVO的JSON格式：包含account、token、isAdmin、roleList等）',
  `ip_address` VARCHAR(64) NOT NULL COMMENT '客户端IP地址',
  `trace_id` VARCHAR(64) DEFAULT NULL COMMENT '链路追踪ID',
  `module` VARCHAR(20) NOT NULL COMMENT '所属模块：AIGC、USER、CMS',
  `operation` VARCHAR(100) NOT NULL COMMENT '操作标识：如"高危操作"',
  `operation_desc` VARCHAR(500) DEFAULT NULL COMMENT '操作描述：详细说明操作内容',
  `request` TEXT DEFAULT NULL COMMENT '请求参数',
  `response` TEXT DEFAULT NULL COMMENT '响应结果',
  `is_success` TINYINT(1) DEFAULT 1 COMMENT '是否成功：0-失败，1-成功',
  `error` TEXT DEFAULT NULL COMMENT '错误信息（异常信息）',
  `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建者',
  `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新者',
  `creator_id` BIGINT DEFAULT NULL COMMENT '创建者id',
  `updater_id` BIGINT DEFAULT NULL COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`audit_log_id`),
  KEY `idx_user_id` (`user_id`) COMMENT '按用户查询',
  KEY `idx_trace_id` (`trace_id`) COMMENT '按链路追踪ID查询',
  KEY `idx_module` (`module`) COMMENT '按模块查询'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '审计表';

-- 埋点表
-- ***************************************************************************
-- 用户行为埋点表
-- 用途：记录用户行为数据，用于行为分析和产品优化
-- ***************************************************************************
DROP TABLE IF EXISTS sys_user_event;

CREATE TABLE IF NOT EXISTS sys_user_event (
  `event_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '埋点日志ID（主键）',
  `user_id` BIGINT DEFAULT NULL COMMENT '用户ID（可为空，用于匿名用户埋点）',
  `user_info` JSON DEFAULT NULL COMMENT '用户信息（UserLoginVo的JSON格式：包含account、token、isAdmin、roleList、permissionList等）',
  `event_name` VARCHAR(100) NOT NULL COMMENT '事件名称（如：article_detail_click、page_view、button_click等）',
  `module` VARCHAR(50) NOT NULL COMMENT '所属模块（如：AIGC、CMS、USER、FILE、SYSTEM）',
  `page_name` VARCHAR(255) DEFAULT NULL COMMENT '页面名称/路径（如：/article/detail、/user/profile）',
  `action_group` VARCHAR(100) DEFAULT NULL COMMENT '行为组（用于分组统计）',
  `event_properties` JSON DEFAULT NULL COMMENT '埋点事件属性（存储事件的扩展属性）',
  `ip_address` VARCHAR(64) DEFAULT NULL COMMENT '客户端IP地址',
  `request_id` VARCHAR(64) DEFAULT NULL COMMENT '请求ID',
  `response_id` VARCHAR(64) DEFAULT NULL COMMENT '响应ID',
  `page_load_time` INT DEFAULT NULL COMMENT '页面加载耗时（单位：毫秒）',
  `stay_duration` INT DEFAULT NULL COMMENT '停留时长（单位：毫秒）',
  `creator` VARCHAR(255) NOT NULL COMMENT '创建者',
  `updater` VARCHAR(255) COMMENT '更新者',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`event_id`),
  KEY `idx_user_id` (`user_id`) COMMENT '按用户查询',
  KEY `idx_event_name` (`event_name`) COMMENT '按事件名称查询',
  KEY `idx_module` (`module`) COMMENT '按模块查询',
  KEY `idx_action_group` (`action_group`) COMMENT '按行为组查询'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户行为埋点表';
