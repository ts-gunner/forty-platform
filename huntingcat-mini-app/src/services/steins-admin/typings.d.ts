declare namespace API {
  type AddCustomerFavoriteRequest = {
    entityId: string;
    valueId: string;
  };

  type AdminGetCrmEntityValueListRequest = {
    entityId: string;
    filterParams?: Record<string, any>;
    isDelete?: number;
    pageNum?: number;
    pageSize?: number;
    userId?: string;
  };

  type ApiResultAny = {
    code?: number;
    data?: any;
    msg?: string;
  };

  type ApiResultArrayCrmCrmEntityFieldVo = {
    code?: number;
    data?: CrmEntityFieldVo[];
    msg?: string;
  };

  type ApiResultArraySystemRolePermissionRelVo = {
    code?: number;
    data?: RolePermissionRelVo[];
    msg?: string;
  };

  type ApiResultArraySystemRoleWithPermissionVo = {
    code?: number;
    data?: RoleWithPermissionVo[];
    msg?: string;
  };

  type ApiResultArraySystemUserRoleRelVo = {
    code?: number;
    data?: UserRoleRelVo[];
    msg?: string;
  };

  type ApiResultArraySystemUserWithRoleVo = {
    code?: number;
    data?: UserWithRoleVo[];
    msg?: string;
  };

  type ApiResultBool = {
    code?: number;
    data?: boolean;
    msg?: string;
  };

  type ApiResultCrmCrmEntityValueObjectVo = {
    code?: number;
    data?: CrmEntityValueObjectVo;
    msg?: string;
  };

  type ApiResultCrmCrmEntityValueVo = {
    code?: number;
    data?: CrmEntityValueVo;
    msg?: string;
  };

  type ApiResultCrmCrmEntityVo = {
    code?: number;
    data?: CrmEntityVo;
    msg?: string;
  };

  type ApiResultCrmCrmValueCountVo = {
    code?: number;
    data?: CrmValueCountVo;
    msg?: string;
  };

  type ApiResultResponsePageResultAuditAuditAccessRecordVo = {
    code?: number;
    data?: PageResultAuditAuditAccessRecordVo;
    msg?: string;
  };

  type ApiResultResponsePageResultCrmCrmCustomerFavoriteVo = {
    code?: number;
    data?: PageResultCrmCrmCustomerFavoriteVo;
    msg?: string;
  };

  type ApiResultResponsePageResultCrmCrmEntityVo = {
    code?: number;
    data?: PageResultCrmCrmEntityVo;
    msg?: string;
  };

  type ApiResultResponsePageResultSystemPermissionVo = {
    code?: number;
    data?: PageResultSystemPermissionVo;
    msg?: string;
  };

  type ApiResultResponsePageResultSystemRoleVo = {
    code?: number;
    data?: PageResultSystemRoleVo;
    msg?: string;
  };

  type ApiResultResponsePageResultSystemUserVo = {
    code?: number;
    data?: PageResultSystemUserVo;
    msg?: string;
  };

  type ApiResultString = {
    code?: number;
    data?: string;
    msg?: string;
  };

  type ApiResultSystemLoginUserVo = {
    code?: number;
    data?: LoginUserVo;
    msg?: string;
  };

  type ApiResultSystemPermissionVo = {
    code?: number;
    data?: PermissionVo;
    msg?: string;
  };

  type ApiResultSystemRoleVo = {
    code?: number;
    data?: RoleVo;
    msg?: string;
  };

  type ApiResultSystemUserVo = {
    code?: number;
    data?: UserVo;
    msg?: string;
  };

  type ApprovalWechatAccessRequest = {
    /** 提交审核的随机码 */
    auditCode: string;
    /** 申请人名称 */
    auditName: string;
    /** 申请人填写的备注 */
    auditRemark?: string;
    /** 微信登录的code */
    loginCode: string;
  };

  type AuditAccessRecordVo = {
    /** 申请人备注 */
    applyRemark?: string;
    /** 申请人名称 */
    applyUser?: string;
    /** 审核代码 */
    auditCode?: string;
    /** 业务描述 */
    bizDesc?: string;
    /** 业务类型 */
    bizType?: string;
    createTime?: string;
    id?: string;
    /** 审核备注 */
    remark?: string;
    /** 审核状态 0-待审核 1-通过 2-驳回 */
    status?: number;
  };

  type checkCustomerFavoriteParams = {
    /** 实体表id */
    entityId: string;
    /** 数据id */
    valueId: string;
  };

  type CrmCustomerFavoriteVo = {
    createTime?: string;
    customerName?: string;
    entityId?: string;
    entityName?: string;
    id?: string;
    remark?: string;
    valueId?: string;
    values?: string;
  };

  type CrmEntityField = {
    dataType: string;
    fieldKey: string;
    fieldName: string;
    id?: string;
    isRequired: boolean;
    options?: string;
    sortOrder: number;
  };

  type CrmEntityFieldVo = {
    dataType?: string;
    entityId?: string;
    fieldKey?: string;
    fieldName?: string;
    id?: string;
    isRequired?: boolean;
    options?: string;
    sortOrder?: number;
  };

  type CrmEntityValueData = {
    customerName: string;
    remark?: string;
    values?: string;
  };

  type CrmEntityValueObjectVo = {
    entityValue?: PageResultCrmCrmEntityValueVo;
  };

  type CrmEntityValueVo = {
    createTime?: string;
    customerName?: string;
    entityId?: string;
    id?: string;
    isDelete?: number;
    isFavorite?: number;
    remark?: string;
    userId?: string;
    userName?: string;
    values?: string;
  };

  type CrmEntityVo = {
    createTime?: string;
    description?: string;
    entityCode?: string;
    entityId?: string;
    entityName?: string;
    updateTime?: string;
  };

  type CrmValueCountVo = {
    /** 所有客户数据总数 */
    allValueCount?: number;
    /** 我的客户数据总数 */
    mineValueCount?: number;
  };

  type DeleteCrmEntityValueRequest = {
    id: string;
  };

  type EntityCreateRequest = {
    description?: string;
    entityCode: string;
    entityName: string;
  };

  type EntityDeleteRequest = {
    entityId: string;
  };

  type EntityUpdateRequest = {
    description?: string;
    entityCode?: string;
    entityId: string;
    entityName?: string;
  };

  type getAuditListParams = {
    /** 业务类型 */
    bizType?: string;
    /** 状态 */
    status?: number;
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
  };

  type GetCrmEntityValueListRequest = {
    entityKey: string;
    filterParams?: Record<string, any>;
    pageNum?: number;
    pageSize?: number;
    userId?: string;
  };

  type getCrmValueCountParams = {
    /** 实体id */
    entityId: string;
  };

  type getCustomerFavoriteListParams = {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 实体表id */
    entityId?: string;
  };

  type getDeletedFieldsByEntityIdParams = {
    /** 实体表id */
    entityId?: string;
  };

  type getEntityByKeyParams = {
    /** 实体标识 */
    entityKey?: string;
  };

  type getEntityDetailParams = {
    /** 实体ID */
    entityId: number;
  };

  type getEntityListParams = {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 实体名称 */
    entityName?: string;
    /** 实体标识 */
    entityCode?: string;
  };

  type getEntityValueDetailParams = {
    /** 实体数据id */
    entityValueId: string;
  };

  type getFieldsByEntityIdParams = {
    /** 实体表id */
    entityId: string;
  };

  type getFieldsByEntityKeyParams = {
    /** 实体表key */
    entityKey: string;
  };

  type getPermissionDetailParams = {
    /** 权限ID */
    permissionId: string;
  };

  type getPermissionListParams = {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 权限名称 */
    permissionName?: string;
    /** 类型 */
    type?: number;
    /** 权限标识 */
    perms?: string;
  };

  type getPermissionsByRoleIdParams = {
    /** 角色ID */
    roleId: string;
  };

  type getRoleDetailParams = {
    /** 角色ID */
    roleId: string;
  };

  type getRoleListParams = {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 角色名称 */
    roleName?: string;
    /** 角色标识 */
    roleKey?: string;
  };

  type getRolesByPermissionIdParams = {
    /** 权限ID */
    permissionId: string;
  };

  type getRolesByUserIdParams = {
    /** 用户ID */
    userId: string;
  };

  type getUserDetailParams = {
    /** 用户ID */
    userId: string;
  };

  type GetUserListByRoleKeyRequest = {
    pageNum?: number;
    pageSize?: number;
    roleKey: string;
  };

  type getUserListParams = {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 账号 */
    account?: string;
    /** 昵称 */
    nickName?: string;
    /** 手机号 */
    phone?: string;
    /** 状态 */
    status?: number;
  };

  type getUsersByRoleIdParams = {
    /** 角色ID */
    roleId: string;
  };

  type InsertCrmEntityValueRequest = {
    data: CrmEntityValueData[];
    entityId: string;
  };

  type LoginUserVo = {
    account?: string;
    avatar?: string;
    email?: string;
    nickName?: string;
    phone?: string;
    userId?: string;
  };

  type PageResultAuditAuditAccessRecordVo = {
    list?: AuditAccessRecordVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PageResultCrmCrmCustomerFavoriteVo = {
    list?: CrmCustomerFavoriteVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PageResultCrmCrmEntityValueVo = {
    list?: CrmEntityValueVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PageResultCrmCrmEntityVo = {
    list?: CrmEntityVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PageResultSystemPermissionVo = {
    list?: PermissionVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PageResultSystemRoleVo = {
    list?: RoleVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PageResultSystemUserVo = {
    list?: UserVo[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };

  type PermissionCreateRequest = {
    permissionName: string;
    perms?: string;
    type?: number;
  };

  type PermissionDeleteRequest = {
    permissionId: string;
  };

  type PermissionUpdateRequest = {
    permissionId: string;
    permissionName?: string;
    perms?: string;
    type?: number;
  };

  type PermissionVo = {
    createTime?: string;
    permissionId?: string;
    permissionName?: string;
    perms?: string;
    type?: number;
    updateTime?: string;
  };

  type PwdLoginRequest = {
    password?: string;
    username?: string;
  };

  type RemoveCustomerFavoriteRequest = {
    entityId: string;
    valueId: string;
  };

  type RestoreCrmEntityFieldRequest = {
    fieldId: string;
  };

  type RoleCreateRequest = {
    roleKey: string;
    roleName: string;
  };

  type RoleDeleteRequest = {
    roleId: string;
  };

  type RolePermissionRelAssignRequest = {
    permissionIds: number[];
    roleId: string;
  };

  type RolePermissionRelRemoveRequest = {
    permissionId: string;
    roleId: string;
  };

  type RolePermissionRelVo = {
    permissionId?: string;
    permissionName?: string;
    perms?: string;
    type?: number;
  };

  type RoleUpdateRequest = {
    roleId: string;
    roleName?: string;
  };

  type RoleVo = {
    createTime?: string;
    roleId?: string;
    roleKey?: string;
    roleName?: string;
    updateTime?: string;
  };

  type RoleWithPermissionVo = {
    roleId?: string;
    roleKey?: string;
    roleName?: string;
  };

  type UpdateAuditRequest = {
    id: string;
    remark?: string;
    status: number;
  };

  type UpdateCrmEntityValueRequest = {
    customerName: string;
    id: string;
    remark?: string;
    values?: string;
  };

  type UpsertCrmEntityFieldRequest = {
    entityId: string;
    fields: CrmEntityField[];
  };

  type UserCreateRequest = {
    account: string;
    email?: string;
    nickName: string;
    password: string;
    phone?: string;
    status?: number;
  };

  type UserDeleteRequest = {
    userId: string;
  };

  type UserResetPwdRequest = {
    newPassword: string;
    userId: string;
  };

  type UserRoleRelAssignRequest = {
    roleIds: number[];
    userId: string;
  };

  type UserRoleRelRemoveRequest = {
    roleId: string;
    userId: string;
  };

  type UserRoleRelVo = {
    roleId?: string;
    roleKey?: string;
    roleName?: string;
  };

  type UserUpdateRequest = {
    avatarId?: string;
    email?: string;
    nickName?: string;
    phone?: string;
    status?: number;
    userId: string;
  };

  type UserVo = {
    account?: string;
    avatar?: string;
    createTime?: string;
    email?: string;
    nickName?: string;
    openId?: string;
    phone?: string;
    /** 角色列表， 逗号相隔 */
    roleNames?: string;
    status?: number;
    updateTime?: string;
    userId?: string;
  };

  type UserWithRoleVo = {
    account?: string;
    nickName?: string;
    userId?: string;
  };

  type WechatCodeLoginRequest = {
    code?: string;
  };
}
