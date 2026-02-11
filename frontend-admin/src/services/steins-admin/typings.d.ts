declare namespace API {
  type AddAigcAgentCategoryRequest = {
    /** 名称 */
    name: string;
    /** 业务唯一标识Key */
    key: string;
    /** 描述 */
    description?: string;
    /** 类型 */
    type: string;
    /** 排序权重 */
    sortOrder?: number;
  };

  type AddCmsArticleRequest = {
    /** 标题 */
    title: string;
    /** 摘要 */
    summary?: string;
    /** 封面图资源ID */
    resourceId?: string;
    /** 文章类型：1=原创, 2=转载 */
    articleType: number;
    /** 作者名 */
    authorName?: string;
    /** 是否置顶：0=否, 1=是 */
    isTop?: number;
    /** 状态：0=草稿, 1=已发布, 2=已下架, 3=定时未发布(还没有这个功能) */
    status: number;
    /** 文章内容 */
    content: string;
    /** 标签ID列表 */
    tagIds?: string[];
  };

  type AddCmsTagRequest = {
    /** 标签名称 */
    tagName: string;
  };

  type AddQuestionExampleRequest = {
    /** 问题 */
    question: string;
    /** 知识库类型 */
    agentKey: string;
    /** 状态 */
    status: number;
  };

  type AddSysPermissionRequest = {
    /** 权限名称 */
    permissionName: string;
    /** 类型：0=菜单(C)，1=按钮(F) */
    type: number;
    /** 权限标识 */
    perms: string;
  };

  type AddSysRoleRequest = {
    /** 角色名称 */
    roleName: string;
    /** 角色标识 */
    roleKey: string;
  };

  type AddSysUserRequest = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 昵称 */
    nickname: string;
    /** 是否为管理员 */
    isAdmin: boolean;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 状态 */
    status: number;
  };

  type AigcAgentCategory = {
    creator?: string;
    updater?: string;
    creatorId?: string;
    updaterId?: string;
    /** 逻辑删除 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 删除时间 */
    deleteTime?: string;
    id?: string;
    name?: string;
    key?: string;
    description?: string;
    type?: string;
    sortOrder?: number;
  };

  type AigcAgentCategoryVo = {
    id?: string;
    /** 名称 */
    name?: string;
    /** 业务唯一标识Key */
    key?: string;
    /** 描述 */
    description?: string;
    /** 类型 */
    type?: string;
    /** 排序 */
    sortOrder?: number;
  };

  type AigcAgentFilterTreeVo = {
    id?: string;
    categoryId?: string;
    pid?: string;
    /** 名称 */
    name?: string;
    /** 业务key */
    key?: string;
    /** 描述 */
    description?: string;
    /** 标签 */
    tag?: string;
    /** 子列表 (递归) */
    children?: AigcAgentFilterTreeVo[];
  };

  type AigcAgentTreeVo = {
    id?: string;
    /** 名称 */
    name?: string;
    /** 业务唯一标识Key */
    key?: string;
    /** 描述 */
    description?: string;
    /** 类型 */
    type?: string;
    /** 排序 */
    sortOrder?: number;
    /** 一级列表 */
    children?: AigcAgentFilterTreeVo[];
  };

  type AigcCreateFolderRequest = {
    kbId: string;
    /** 文件夹名称 */
    name: string;
    parentId: string;
  };

  type AigcFileManagerVo = {
    creator?: string;
    updater?: string;
    creatorId?: string;
    updaterId?: string;
    /** 逻辑删除 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 删除时间 */
    deleteTime?: string;
    fileManagerId?: string;
    /** 文件管理类型（文件夹1 资源文件2） */
    fileManagerType?: number;
    belongingFolderId?: string;
    kbId?: string;
    /** 名称（文件夹是name，资源文件是originalName） */
    name?: string;
    /** 在知识库中的路径（文件夹是kbPath，资源文件是businessPath） */
    kbPath?: string;
    /** 相对路径（文件夹是relPath ，资源文件是url） */
    relPath?: string;
    /** MIME类型（资源文件） */
    mimeType?: string;
    /** 文件后缀（资源文件） */
    fileSuffix?: string;
    fileSize?: string;
    userId?: string;
    /** 子文件夹数量（仅文件夹有效） */
    childFolderCount?: number;
    /** 子文件数量（仅文件夹有效） */
    childFileCount?: number;
    latestTaskStatus?: LatestTaskStatusVO;
  };

  type AigcGetFileManagerListRequest = {
    folderId: string;
    /** 文件管理类型（文件夹1 资源文件2，为空则全部） */
    fileManagerType?: number;
  };

  type AigcGetFileManagerListVo = {
    /** 文件夹列表 */
    fileManagerList?: AigcFileManagerVo[];
    /** 总数 */
    total?: number;
  };

  type AigcKnowledgeBaseAndDatabasePageVo = {
    kbId?: string;
    /** 知识库名称 */
    kbName?: string;
    /** 知识库描述 */
    kbDesc?: string;
    /** 业务唯一标识code */
    kbCode?: string;
    previewImgId?: string;
    /** 知识库封面图地址 */
    previewImgUrl?: string;
    /** 所属用户账号 */
    account?: string;
    /** 知识库创建时间 */
    createTime?: string;
    /** 知识库更新时间 */
    updateTime?: string;
    /** 用户昵称 */
    nickname?: string;
    /** 用户邮箱 */
    email?: string;
    /** 用户手机号码 */
    phone?: string;
    /** 用户是否为管理员 */
    isAdmin?: boolean;
    /** 用户账号状态 */
    status?: number;
    folderCount?: string;
    fileCount?: string;
    /** agentKey：知识库/数据库 */
    agentKey?: string;
    /** 知识库类型 */
    kbType?: "commercial" | "personal";
  };

  type AigcKnowledgeBasePageVo = {
    kbId?: string;
    categoryId?: string;
    /** agent分类key */
    categoryKey?: string;
    /** agent分类名称 */
    categoryName?: string;
    /** 知识库名称 */
    kbName?: string;
    /** 知识库描述 */
    kbDesc?: string;
    /** 知识库类型， 商用or个人 */
    kbType?: "commercial" | "personal";
    /** 业务标识code(partitionName) */
    kbCode?: string;
    previewImgId?: string;
    /** 预览图地址 */
    previewImgUrl?: string;
    rootFolderId?: string;
    userId?: string;
    /** 排序权重 */
    sortOrder?: number;
  };

  type AigcKnowledgeBaseVo = {
    kbId?: string;
    categoryId?: string;
    /** 名称 */
    name?: string;
    /** 描述 */
    description?: string;
    /** 类型，commercial/personal */
    kbType?: "commercial" | "personal";
    /** 业务唯一标识code(partitionName)，用来做分区用，如type=personal可为空 */
    code?: string;
    previewImgId?: string;
    rootFolderId?: string;
    userId?: string;
    /** 排序权重 (数字越小越靠前) */
    sortOrder?: number;
  };

  type AigcQuestionExampleVo = {
    questionId?: string;
    /** 问题示例内容 */
    question?: string;
    /** 知识库分类 */
    agentKey?: string;
    /** 状态，0：不可用， 1：可用 */
    status?: number;
  };

  type AigcReferFilterVo = {
    kbId?: string;
    /** 知识库名称 */
    kbName?: string;
    /** 根目录文件夹列表 */
    children?: SysFolderVo[];
  };

  type AigcSessionMessageRequest = {
    sessionId: string;
    messageId: string;
    /** 角色 */
    role: string;
    /** 需要持久化的内容 */
    content: string;
  };

  type AigcSessionMessageVo = {
    messageId?: string;
    sessionId?: string;
    userId?: string;
    /** 角色 */
    role?: string;
  };

  type AigcSessionRequest = {
    /** 对话内容 */
    content: string;
    /** 会话agent类型key，分为 knowledge/data */
    agentKey?: string;
  };

  type AigcSessionVo = {
    sessionId?: string;
    userId?: string;
    /** 会话标题 */
    title?: string;
    /** 会话描述（存第一次聊天内容的截取片段） */
    description?: string;
    /** 会话agent类型key，分为 knowledge/data */
    agentKey?: string;
    /** 上次对话时间 */
    lastChatTime?: string;
  };

  type ApiResultAigcGetFileManagerListVo = {
    code?: number;
    msg?: string;
    data?: AigcGetFileManagerListVo;
  };

  type ApiResultAigcKnowledgeBaseVo = {
    code?: number;
    msg?: string;
    data?: AigcKnowledgeBaseVo;
  };

  type ApiResultAigcQuestionExampleVo = {
    code?: number;
    msg?: string;
    data?: AigcQuestionExampleVo;
  };

  type ApiResultAigcSessionMessageVo = {
    code?: number;
    msg?: string;
    data?: AigcSessionMessageVo;
  };

  type ApiResultAigcSessionVo = {
    code?: number;
    msg?: string;
    data?: AigcSessionVo;
  };

  type ApiResultBoolean = {
    code?: number;
    msg?: string;
    data?: boolean;
  };

  type ApiResultCmsArticleDetailVo = {
    code?: number;
    msg?: string;
    data?: CmsArticleDetailVo;
  };

  type ApiResultCmsTagDetailVo = {
    code?: number;
    msg?: string;
    data?: CmsTagDetailVo;
  };

  type ApiResultCmsUploadFileVo = {
    code?: number;
    msg?: string;
    data?: CmsUploadFileVo;
  };

  type ApiResultListAigcAgentCategoryVo = {
    code?: number;
    msg?: string;
    data?: AigcAgentCategoryVo[];
  };

  type ApiResultListAigcAgentTreeVo = {
    code?: number;
    msg?: string;
    data?: AigcAgentTreeVo[];
  };

  type ApiResultListAigcQuestionExampleVo = {
    code?: number;
    msg?: string;
    data?: AigcQuestionExampleVo[];
  };

  type ApiResultListAigcReferFilterVo = {
    code?: number;
    msg?: string;
    data?: AigcReferFilterVo[];
  };

  type ApiResultListCmsFileVo = {
    code?: number;
    msg?: string;
    data?: CmsFileVo[];
  };

  type ApiResultListCmsTagVo = {
    code?: number;
    msg?: string;
    data?: CmsTagVo[];
  };

  type ApiResultListRolePermissionVo = {
    code?: number;
    msg?: string;
    data?: RolePermissionVo[];
  };

  type ApiResultListString = {
    code?: number;
    msg?: string;
    data?: string[];
  };

  type ApiResultListSysPermissionVo = {
    code?: number;
    msg?: string;
    data?: SysPermissionVo[];
  };

  type ApiResultListSysRoleVo = {
    code?: number;
    msg?: string;
    data?: SysRoleVo[];
  };

  type ApiResultListTaskStatusRecordVO = {
    code?: number;
    msg?: string;
    data?: TaskStatusRecordVO[];
  };

  type ApiResultLong = {
    code?: number;
    msg?: string;
    data?: string;
  };

  type ApiResultMapStringString = {
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type ApiResultPageAigcAgentCategoryVo = {
    code?: number;
    msg?: string;
    data?: PageAigcAgentCategoryVo;
  };

  type ApiResultPageAigcKnowledgeBaseAndDatabasePageVo = {
    code?: number;
    msg?: string;
    data?: PageAigcKnowledgeBaseAndDatabasePageVo;
  };

  type ApiResultPageAigcKnowledgeBasePageVo = {
    code?: number;
    msg?: string;
    data?: PageAigcKnowledgeBasePageVo;
  };

  type ApiResultPageAigcQuestionExampleVo = {
    code?: number;
    msg?: string;
    data?: PageAigcQuestionExampleVo;
  };

  type ApiResultPageAigcSessionVo = {
    code?: number;
    msg?: string;
    data?: PageAigcSessionVo;
  };

  type ApiResultPageCmsArticleClientVo = {
    code?: number;
    msg?: string;
    data?: PageCmsArticleClientVo;
  };

  type ApiResultPageCmsArticleVo = {
    code?: number;
    msg?: string;
    data?: PageCmsArticleVo;
  };

  type ApiResultPageCmsTagDetailVo = {
    code?: number;
    msg?: string;
    data?: PageCmsTagDetailVo;
  };

  type ApiResultPageCmsTagVo = {
    code?: number;
    msg?: string;
    data?: PageCmsTagVo;
  };

  type ApiResultPageSysPermissionVo = {
    code?: number;
    msg?: string;
    data?: PageSysPermissionVo;
  };

  type ApiResultPageSysResource = {
    code?: number;
    msg?: string;
    data?: PageSysResource;
  };

  type ApiResultPageSysRoleVo = {
    code?: number;
    msg?: string;
    data?: PageSysRoleVo;
  };

  type ApiResultPageSysUserEvent = {
    code?: number;
    msg?: string;
    data?: PageSysUserEvent;
  };

  type ApiResultPageSysUserVo = {
    code?: number;
    msg?: string;
    data?: PageSysUserVo;
  };

  type ApiResultPageUserConversationVo = {
    code?: number;
    msg?: string;
    data?: PageUserConversationVo;
  };

  type ApiResultString = {
    code?: number;
    msg?: string;
    data?: string;
  };

  type ApiResultSysFolderVo = {
    code?: number;
    msg?: string;
    data?: SysFolderVo;
  };

  type ApiResultSysResource = {
    code?: number;
    msg?: string;
    data?: SysResource;
  };

  type ApiResultSysResourceVo = {
    code?: number;
    msg?: string;
    data?: SysResourceVo;
  };

  type ApiResultUserDetailVo = {
    code?: number;
    msg?: string;
    data?: UserDetailVo;
  };

  type ApiResultUserLoginVo = {
    code?: number;
    msg?: string;
    data?: UserLoginVo;
  };

  type ApiResultVoid = {
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type ArticlePageRequest = {
    current: number;
    pageSize: number;
    /** 标题关键词 */
    keyword?: string;
    /** 文章类型：1=原创, 2=转载 */
    articleType?: number;
    /** 状态：0=草稿, 1=已发布, 2=已下架, 3=定时未发布 */
    status?: number;
    /** 标签ID */
    tagId?: string;
    /** 是否置顶：0=否, 1=是 */
    isTop?: number;
    /** 排序方式：1=最新发布, 2=热度最高, 3=浏览量最高, 4=点赞量最高 */
    sortType?: number;
  };

  type ArticleResourceVo = {
    /** 资源ID */
    resourceId?: string;
    /** 预览URL */
    previewUrl?: string;
    /** 原文件名 */
    originalName?: string;
    fileSize?: string;
    /** MIME类型 */
    mimeType?: string;
  };

  type CallAgentRequest = {
    /** 调用的agent标识 */
    agentKey: string;
    /** 会话ID */
    sessionId: string;
    /** 消息ID */
    messageId: string;
    /** 消息体 */
    message: string;
    /** 调用的过滤文件夹ids */
    filterFolderIdList?: string[];
    /** 调用的过滤tag标识 */
    filterTagList?: string[];
    /** 是否重试 */
    regenerate?: boolean;
  };

  type CategoryPageRequest = {
    records?: AigcAgentCategory[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcAgentCategory;
    searchCount?: PageAigcAgentCategory;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    /** 名称查询，模糊查询 */
    name?: string;
    /** Key查询，精确查询 */
    key?: string;
    pages?: string;
  };

  type CmsArticleClientVo = {
    /** 文章ID */
    articleId?: string;
    /** 标题 */
    title?: string;
    /** 摘要 */
    summary?: string;
    /** 封面图资源ID */
    resourceId?: string;
    /** 封面图预览URL */
    coverUrl?: string;
    /** 文章类型：1=原创, 2=转载 */
    articleType?: number;
    /** 作者名 */
    authorName?: string;
    /** 发布时间 */
    publishTime?: string;
    views?: string;
    likes?: string;
    /** 热度分值 */
    hotScore?: number;
    /** 标签列表 */
    tags?: CmsTagVo[];
  };

  type CmsArticleDetailVo = {
    /** 文章ID */
    articleId?: string;
    /** 标题 */
    title?: string;
    /** 摘要 */
    summary?: string;
    /** 封面图资源ID */
    resourceId?: string;
    /** 封面图预览URL */
    coverUrl?: string;
    /** 文章类型：1=原创, 2=转载 */
    articleType?: number;
    /** 作者名 */
    authorName?: string;
    /** 发布时间 */
    publishTime?: string;
    /** 是否置顶：0=否, 1=是 */
    isTop?: number;
    /** 状态：0=草稿, 1=已发布, 2=已下架, 3=定时未发布 */
    status?: number;
    views?: string;
    likes?: string;
    /** 热度分值 */
    hotScore?: number;
    /** 标签列表 */
    tags?: CmsTagVo[];
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 文章内容 */
    content?: string;
    /** 文章内容中的图片资源列表 */
    contentResources?: ArticleResourceVo[];
    /** 当前用户是否已点赞 */
    hasLiked?: boolean;
    /** 当前用户是否已浏览（7天内） */
    hasViewed?: boolean;
  };

  type CmsArticleVo = {
    /** 文章ID */
    articleId?: string;
    /** 标题 */
    title?: string;
    /** 摘要 */
    summary?: string;
    /** 封面图资源ID */
    resourceId?: string;
    /** 封面图预览URL */
    coverUrl?: string;
    /** 文章类型：1=原创, 2=转载 */
    articleType?: number;
    /** 作者名 */
    authorName?: string;
    /** 发布时间 */
    publishTime?: string;
    /** 是否置顶：0=否, 1=是 */
    isTop?: number;
    /** 状态：0=草稿, 1=已发布, 2=已下架, 3=定时未发布 */
    status?: number;
    views?: string;
    likes?: string;
    /** 热度分值 */
    hotScore?: number;
    /** 标签列表 */
    tags?: CmsTagVo[];
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  type CmsChangeStatusRequest = {
    /** 文章ID */
    articleId: string;
    /** 状态：1=已发布, 2=已下架 */
    status: number;
  };

  type CmsFileVo = {
    resourceId?: string;
    /** 预览URL */
    previewUrl?: string;
    /** 文件名 */
    fileName?: string;
  };

  type CmsTagDetailVo = {
    /** 标签ID */
    tagId?: string;
    /** 标签名称 */
    tagName?: string;
    articleCount?: string;
  };

  type CmsTagVo = {
    /** 标签ID */
    tagId?: string;
    /** 标签名称 */
    tagName?: string;
  };

  type CmsToggleTopRequest = {
    /** 文章ID */
    articleId: string;
    /** 是否置顶：0=否, 1=是 */
    isTop: number;
  };

  type CmsUploadFileVo = {
    /** 文件ID */
    resourceId?: string;
    /** 预览URL */
    previewUrl?: string;
    /** 文件名 */
    fileName?: string;
  };

  type countEventTracksParams = {
    module?: string;
    eventName?: string;
    actionGroup?: string;
  };

  type CreateKnowledgeRequest = {
    categoryId: string;
    /** 知识库名称 */
    kbName: string;
    /** 知识库描述 */
    kbDesc?: string;
    /** 知识库类型 */
    kbType: string;
    /** 知识库标识 */
    kbCode?: string;
    previewImgId?: string;
  };

  type CustomSplitConfig = {
    /** 分片字符列表 */
    split_characters?: string[];
    /** 文本长度 */
    text_len?: number;
  };

  type deleteArticleParams = {
    /** 文章ID */
    articleId: string;
  };

  type deleteCategoryParams = {
    id: string;
  };

  type deleteFolderParams = {
    folderId: string;
  };

  type deleteImageParams = {
    /** 资源ID */
    resourceId: string;
    /** 文章ID */
    articleId: string;
  };

  type deletePermissionParams = {
    permissionId: string;
  };

  type deleteRoleParams = {
    roleId: string;
  };

  type deleteSystemUserParams = {
    userId: string;
  };

  type deleteTagParams = {
    tagId: string;
  };

  type downloadParams = {
    resourceId: string;
  };

  type EventTrackPageRequest = {
    current: string;
    size: string;
    userId?: string;
    /** 事件名称 */
    eventName?: string;
    /** 所属模块 */
    module?: string;
    /** 行为组 */
    actionGroup?: string;
  };

  type EventTrackRecordRequest = {
    /** 事件名称 */
    eventName: string;
    /** 所属模块 */
    module: string;
    /** 页面名称/路径 */
    pageName?: string;
    /** 行为组 */
    actionGroup?: string;
    /** 埋点事件属性（JSON格式） */
    eventProperties?: Record<string, any>;
    /** 页面加载耗时（毫秒） */
    pageLoadTime?: number;
    /** 停留时长（毫秒） */
    stayDuration?: number;
    /** 请求ID */
    requestId?: string;
  };

  type FilePageRequest = {
    current: number;
    pageSize: number;
    /** 存储类型 */
    storageType?: number;
    /** 业务类型 */
    businessType?: number;
    businessId?: string;
    /** 文件类型(扩展名) */
    fileSuffix?: string;
    /** 媒体类型(IMAGE/VIDEO/AUDIO/DOC/OTHER) */
    mediaType?: number;
    /** 文件名(模糊搜索) */
    fileName?: string;
  };

  type forceLogoutParams = {
    userId: string;
  };

  type getArticleDetailParams = {
    /** 文章ID */
    articleId: string;
    /** 是否增加浏览量 */
    incrementView?: boolean;
  };

  type getArticleImagesParams = {
    /** 文章ID */
    articleId: string;
  };

  type getDownloadUrlParams = {
    resourceId: string;
  };

  type getInfoParams = {
    resourceId: string;
  };

  type GetKnowledgeBaseAndDatabasePageRequest = {
    current: number;
    pageSize: number;
    /** 用户昵称（模糊检索） */
    nickname?: string;
    /** 用户账号（模糊检索） */
    account?: string;
    /** 手机号（模糊检索） */
    phone?: string;
    /** 创建开始日期 */
    createTimeStart?: string;
    /** 创建结束日期 */
    createTimeEnd?: string;
    /** 更新开始日期 */
    updateTimeStart?: string;
    /** 更新结束日期 */
    updateTimeEnd?: string;
    /** 知识库名（模糊检索） */
    kbName?: string;
    /** Agent分类key（aigc_agent_category里面的key，不传则默认查全部） */
    agentKey?: string;
    /** 知识库类型 */
    kbType?: string;
  };

  type GetKnowledgeBasePageRequest = {
    current: number;
    pageSize: number;
    /** 搜索框内容 */
    searchContext?: string;
    /** 隐私类型，商用or个人,只有/getKnowledgeBasePage接口需要，其他接口废弃 */
    kbType: "commercial" | "personal";
    agentCategoryId?: string;
    /** agent分类标识key（knowledge | data），只有/getKnowledgeBasePage接口需要，其他接口废弃 */
    agentCategoryKey?: string;
  };

  type getMessageByIdParams = {
    messageId: string;
  };

  type getMessagesBySessionIdParams = {
    /** 会话ID */
    sessionId: string;
  };

  type GetPageQuestionExampleRequest = {
    current: number;
    pageSize: number;
    /** 问题内容 */
    question?: string;
  };

  type getPreviewUrl1Params = {
    /** 资源ID */
    resourceId: string;
  };

  type getPreviewUrlParams = {
    resourceId: string;
  };

  type getQuestionExampleParams = {
    agentKey: string;
  };

  type getRolePermissionListParams = {
    roleId: string;
  };

  type getRootFolderListByAgentKeyParams = {
    agentKey: string;
  };

  type GetSessionPageRequest = {
    current: number;
    pageSize: number;
    /** 搜索关键词 */
    keyword?: string;
    userId?: string;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
  };

  type getTagDetailParams = {
    tagId: string;
  };

  type GetUserConversationListRequest = {
    current: number;
    pageSize: number;
    /** 用户名（模糊查询） */
    username?: string;
    userId?: string;
    /** 对话开始时间 */
    startTime?: string;
    /** 对话结束时间 */
    endTime?: string;
  };

  type getUserPermissionsParams = {
    userId: string;
  };

  type getUserRolesParams = {
    userId: string;
  };

  type LatestTaskStatusVO = {
    resourceId?: string;
    taskId?: string;
    /** 任务状态：NOT_STARTED-未开始, PENDING-挂起, INPROGRESS-进行中, COMPLETED-完成, ERROR-出错, CANCELED-取消 */
    status?: string;
    /** 任务类型：VECTORIZATION-向量化, PREPROCESS-预处理, COMPRESS-压缩 */
    taskType?: string;
    /** 进度 (0-100) */
    progress?: number;
    /** 状态更新时间 */
    updateTime?: string;
  };

  type LikeArticleRequest = {
    /** 文章ID */
    articleId: string;
  };

  type manualCheckStatusParams = {
    /** 快慢轮询选择(1快2慢) */
    method?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageAigcAgentCategory = {
    records?: AigcAgentCategory[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcAgentCategory;
    searchCount?: PageAigcAgentCategory;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageAigcAgentCategoryVo = {
    records?: AigcAgentCategoryVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcAgentCategoryVo;
    searchCount?: PageAigcAgentCategoryVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageAigcKnowledgeBaseAndDatabasePageVo = {
    records?: AigcKnowledgeBaseAndDatabasePageVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcKnowledgeBaseAndDatabasePageVo;
    searchCount?: PageAigcKnowledgeBaseAndDatabasePageVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageAigcKnowledgeBasePageVo = {
    records?: AigcKnowledgeBasePageVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcKnowledgeBasePageVo;
    searchCount?: PageAigcKnowledgeBasePageVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageAigcQuestionExampleVo = {
    records?: AigcQuestionExampleVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcQuestionExampleVo;
    searchCount?: PageAigcQuestionExampleVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageAigcSessionVo = {
    records?: AigcSessionVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageAigcSessionVo;
    searchCount?: PageAigcSessionVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type pageArticleClientParams = {
    request: ArticlePageRequest;
  };

  type pageArticleParams = {
    request: ArticlePageRequest;
  };

  type pageCategoriesParams = {
    request: CategoryPageRequest;
  };

  type PageCmsArticleClientVo = {
    records?: CmsArticleClientVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageCmsArticleClientVo;
    searchCount?: PageCmsArticleClientVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageCmsArticleVo = {
    records?: CmsArticleVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageCmsArticleVo;
    searchCount?: PageCmsArticleVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageCmsTagDetailVo = {
    records?: CmsTagDetailVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageCmsTagDetailVo;
    searchCount?: PageCmsTagDetailVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageCmsTagVo = {
    records?: CmsTagVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageCmsTagVo;
    searchCount?: PageCmsTagVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageObject = {
    records?: Record<string, any>[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageObject;
    searchCount?: PageObject;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type pageParams = {
    request: FilePageRequest;
  };

  type pagePermissionsParams = {
    request: PermissionPageRequest;
  };

  type pageRolesParams = {
    request: RolePageRequest;
  };

  type PageSysPermissionVo = {
    records?: SysPermissionVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageSysPermissionVo;
    searchCount?: PageSysPermissionVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageSysResource = {
    records?: SysResource[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageSysResource;
    searchCount?: PageSysResource;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageSysRoleVo = {
    records?: SysRoleVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageSysRoleVo;
    searchCount?: PageSysRoleVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageSysUserEvent = {
    records?: SysUserEvent[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageSysUserEvent;
    searchCount?: PageSysUserEvent;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageSysUserVo = {
    records?: SysUserVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageSysUserVo;
    searchCount?: PageSysUserVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type pageTagsParams = {
    request: TagPageRequest;
  };

  type pageTagsWithCountParams = {
    request: TagPageRequest;
  };

  type PageUserConversationVo = {
    records?: UserConversationVo[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserConversationVo;
    searchCount?: PageUserConversationVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PermissionPageRequest = {
    records?: Record<string, any>[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageObject;
    searchCount?: PageObject;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    /** 权限名称（模糊搜索） */
    permissionName?: string;
    /** 权限标识（模糊搜索） */
    perms?: string;
    /** 类型：0=菜单(C)，1=按钮(F) */
    type?: number;
    pages?: string;
  };

  type personalKBParams = {
    request: GetKnowledgeBaseAndDatabasePageRequest;
  };

  type PredataFileRequest = {
    folderId?: string;
  };

  type previewParams = {
    resourceId: string;
  };

  type removeChatSessionParams = {
    /** 会话ID */
    sessionId: string;
  };

  type removeKnowledgeBaseParams = {
    knowledgeBaseId: string;
  };

  type removeParams = {
    resourceId: string;
  };

  type removeQuestionExampleParams = {
    questionId: string;
  };

  type ResetUserPasswordRequest = {
    /** 密码 */
    pwd?: string;
    /** 二次密码 */
    doublePwd?: string;
  };

  type RolePageRequest = {
    records?: Record<string, any>[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageObject;
    searchCount?: PageObject;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    /** 角色名称（模糊搜索） */
    roleName?: string;
    /** 角色标识（模糊搜索） */
    roleKey?: string;
    pages?: string;
  };

  type RolePermissionBindRequest = {
    /** 角色ID */
    roleId: string;
    /** 权限ID列表 */
    permissionIds: string[];
  };

  type RolePermissionUnbindRequest = {
    /** 角色ID */
    roleId: string;
    /** 权限ID列表 */
    permissionIds: string[];
  };

  type RolePermissionVo = {
    permissionId?: string;
    /** 权限标识 */
    perms?: string;
  };

  type ServerSentEventString = true;

  type SplitConfig = {
    /** 分片类型 */
    split_type?: "DEFAULT" | "CUSTOM" | "WHOLE" | "IMAGE";
    custom_split_config?: CustomSplitConfig;
  };

  type SysFolderVo = {
    creator?: string;
    updater?: string;
    creatorId?: string;
    updaterId?: string;
    /** 逻辑删除 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 删除时间 */
    deleteTime?: string;
    folderId?: string;
    parentId?: string;
    /** 业务类型: 1=AIGC，2=CMS */
    businessType?: number;
    businessId?: string;
    /** 文件夹名称 */
    name?: string;
    /** 在知识库中的路径 */
    kbPath?: string;
    /** 相对路径；如果是知识库类型，则为[knowledge_base.path]/folder_name; 如type=personal，则根folder_name=[account]_[kbname] */
    relPath?: string;
    userId?: string;
  };

  type SysPermissionVo = {
    permissionId?: string;
    /** 权限名称 */
    permissionName?: string;
    /** 类型：0=菜单(C)，1=按钮(F) */
    type?: number;
    /** 权限标识 */
    perms?: string;
  };

  type SysResource = {
    creator?: string;
    updater?: string;
    creatorId?: string;
    updaterId?: string;
    /** 逻辑删除 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 删除时间 */
    deleteTime?: string;
    resourceId?: string;
    folderId?: string;
    storageType?: number;
    url?: string;
    originalName?: string;
    fileName?: string;
    businessType?: number;
    businessId?: string;
    businessPath?: string;
    mediaType?: number;
    mimeType?: string;
    fileSuffix?: string;
    fileMagic?: string;
    fileSize?: string;
    userId?: string;
  };

  type SysResourceVo = {
    creator?: string;
    updater?: string;
    creatorId?: string;
    updaterId?: string;
    /** 逻辑删除 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 删除时间 */
    deleteTime?: string;
    resourceId?: string;
    folderId?: string;
    /** 存储类型: 1=本地, 2=OSS, 3=minio */
    storageType?: number;
    /** 文件存储的相对路径 */
    url?: string;
    /** 原文件名 */
    originalName?: string;
    /** 文件名 */
    fileName?: string;
    /** 业务类型: 1=AIGC，2=CMS */
    businessType?: number;
    businessId?: string;
    /** 业务方面的相对路径 */
    businessPath?: string;
    /** 媒体类型: 1=图片, 2=视频, 3=音频, 4=文档 */
    mediaType?: number;
    /** MIME类型 */
    mimeType?: string;
    /** 文件后缀 */
    fileSuffix?: string;
    /** 文件魔术值 */
    fileMagic?: string;
    fileSize?: string;
    userId?: string;
  };

  type SysRoleVo = {
    roleId?: string;
    /** 角色名称 */
    roleName?: string;
    /** 角色标识 */
    roleKey?: string;
  };

  type SysUserEvent = {
    creator?: string;
    updater?: string;
    creatorId?: string;
    updaterId?: string;
    /** 逻辑删除 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 删除时间 */
    deleteTime?: string;
    eventId?: string;
    userId?: string;
    /** 用户信息（JSON格式） */
    userInfo?: string;
    /** 事件名称 */
    eventName?: string;
    /** 所属模块 */
    module?: string;
    /** 页面名称/路径 */
    pageName?: string;
    /** 行为组 */
    actionGroup?: string;
    /** 埋点事件属性（JSON格式） */
    eventProperties?: string;
    /** 客户端IP地址 */
    ipAddress?: string;
    /** 请求ID */
    requestId?: string;
    /** 响应ID */
    responseId?: string;
    /** 页面加载耗时（毫秒） */
    pageLoadTime?: number;
    /** 停留时长（毫秒） */
    stayDuration?: number;
  };

  type SysUserVo = {
    userId?: string;
    /** 用户账号 */
    account?: string;
    /** 用户昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    phone?: string;
    /** 账号状态, 0: 停用, 1:正常 */
    status?: number;
    /** 是否是管理员账号 */
    isAdmin?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  type TagPageRequest = {
    current: number;
    pageSize: number;
    /** 标签名称 */
    tagName?: string;
  };

  type TaskSelectRequest = {
    /** 任务ID列表 */
    taskIds?: string[];
  };

  type TaskStatusRecordVO = {
    recordId?: string;
    resourceId?: string;
    /** 任务ID */
    taskId?: string;
    /** 任务类型 */
    taskType?: string;
    /** 任务的入参 */
    taskParams?: string;
    /** 任务状态 */
    status?: string;
    /** 进度（保留字段） */
    progress?: number;
    /** 轮询返回信息 */
    msg?: string;
    /** 算法调用时间 */
    algoCallTime?: string;
    /** 最后轮询时间 */
    lastPollTime?: string;
    /** 向量状态更新时间 */
    vectorStatusUpdateTime?: string;
  };

  type UpdateAigcAgentCategoryRequest = {
    id: string;
    /** 名称 */
    name: string;
    /** 业务唯一标识Key */
    key: string;
    /** 描述 */
    description?: string;
    /** 类型 */
    type: string;
    /** 排序权重 */
    sortOrder?: number;
  };

  type UpdateCmsArticleRequest = {
    /** 文章ID */
    articleId: string;
    /** 标题 */
    title?: string;
    /** 摘要 */
    summary?: string;
    /** 封面图资源ID（传空字符串表示删除封面图） */
    resourceId?: string;
    /** 文章类型：1=原创, 2=转载 */
    articleType?: number;
    /** 作者名 */
    authorName?: string;
    /** 发布时间（定时发布用） */
    publishTime?: string;
    /** 是否置顶：0=否, 1=是 */
    isTop?: number;
    /** 状态：0=草稿, 1=已发布, 2=已下架, 3=定时未发布 */
    status?: number;
    /** 文章内容 */
    content?: string;
    /** 标签ID列表（传空列表清除所有标签） */
    tagIds?: string[];
  };

  type UpdateCmsTagRequest = {
    /** 标签ID */
    tagId: string;
    /** 标签名称 */
    tagName?: string;
  };

  type updateCoverParams = {
    /** 文章ID */
    articleId: string;
  };

  type UpdateKnowledgeBaseRequest = {
    kbId: string;
    /** 知识库名称 */
    kbName?: string;
    /** 知识库描述 */
    kbDesc?: string;
    previewImgId?: string;
  };

  type UpdateQuestionExampleRequest = {
    questionId: string;
    /** 问题内容 */
    question?: string;
    /** 知识库分类类型 */
    agentKey?: string;
    /** 状态 */
    status?: number;
  };

  type UpdateSysPermissionRequest = {
    /** 权限ID */
    permissionId: string;
    /** 权限名称 */
    permissionName?: string;
    /** 类型：0=菜单(C)，1=按钮(F) */
    type?: number;
    /** 权限标识 */
    perms?: string;
  };

  type UpdateSysRoleRequest = {
    /** 角色ID */
    roleId: string;
    /** 角色名称 */
    roleName?: string;
    /** 角色标识 */
    roleKey?: string;
    /** 备注 */
    remark?: string;
  };

  type UpdateSysUserRequest = {
    /** 用户ID */
    userId: string;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** 昵称 */
    nickname?: string;
    /** 是否为管理员 */
    isAdmin?: boolean;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 状态 */
    status?: number;
  };

  type uploadCoverParams = {
    /** 文章ID */
    articleId: string;
  };

  type uploadFileParams = {
    /** 文章ID */
    articleId: string;
  };

  type UserConversationVo = {
    userId?: string;
    /** 用户名 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 上次对话时间 */
    lastChatTime?: string;
    sessionCount?: string;
  };

  type UserDetailVo = {
    userId?: string;
    /** 用户账号 */
    account?: string;
    /** 用户昵称 */
    nickname?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    phone?: string;
  };

  type UserLoginRequest = {
    username: string;
    password: string;
  };

  type UserLoginVo = {
    userId?: string;
    account?: string;
    nickName?: string;
    token?: string;
    isAdmin?: boolean;
    roleList?: string[];
    permissionList?: string[];
  };

  type UserPageRequest = {
    current: number;
    pageSize: number;
    /** 用户账号（模糊搜索） */
    account?: string;
    /** 用户昵称（模糊搜索） */
    nickname?: string;
    /** 邮箱（模糊搜索） */
    email?: string;
    /** 手机号（模糊搜索） */
    phone?: string;
    /** 账号状态, 0: 停用, 1:正常 */
    status?: number;
    /** 是否是管理员账号 */
    isAdmin?: boolean;
  };

  type UserRoleBindRequest = {
    /** 用户ID */
    userId: string;
    /** 角色ID列表 */
    roleIds: string[];
  };

  type UserRoleUnbindRequest = {
    /** 用户ID */
    userId: string;
    /** 角色ID列表 */
    roleIds: string[];
  };

  type VectorizeFileRequest = {
    folderId?: string;
    splitConfig?: SplitConfig;
  };
}
