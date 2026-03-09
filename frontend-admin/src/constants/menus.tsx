import { UserCog, Shield, Key, UserCheck, Lock, Database } from "lucide-react";
const SIDER_MENUS: Record<string, Sider.NavItem[]> = {
  
  Menu: [

    {
      icon: <UserCog />,
      name: "userManagement",
      path: "/user_manage",
    },
    {
      icon: <Shield />,
      name: "roleManagement",
      path: "/role_manage",
    },
    {
      icon: <Key />,
      name: "permissionManagement",
      path: "/permission_manage",
    },
    {
      icon: <UserCheck />,
      name: "userAuthorization",
      path: "/user_authorization",
    },
    {
      icon: <Lock />,
      name: "roleAuthorization",
      path: "/role_authorization",
    },
    {
      icon: <Database />,
      name: "crmEntityManagement",
      path: "/crm_entity",
    },
    
  ],
 
};

export default SIDER_MENUS;
