declare namespace API {
  type AdminLoginUserVo = {
    account?: string;
    avatar?: string;
    email?: string;
    nickName?: string;
    phone?: string;
    userId?: string;
  };

  type ApiResultAny = {
    code?: number;
    data?: any;
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

  type ApiResultSystemAdminLoginUserVo = {
    code?: number;
    data?: AdminLoginUserVo;
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
    roleKey?: string;
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

  type UserCreateRequest = {
    account: string;
    avatarId?: string;
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
    avatarId?: string;
    createTime?: string;
    email?: string;
    nickName?: string;
    phone?: string;
    status?: number;
    updateTime?: string;
    userId?: string;
  };

  type UserWithRoleVo = {
    account?: string;
    nickName?: string;
    userId?: string;
  };
}
