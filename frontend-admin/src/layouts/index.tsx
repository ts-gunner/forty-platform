import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import { handleResponse } from "@/utils/common";
import SIDER_MENUS from "@/constants/menus";
import { Dispatch } from "@/store";
import {useDispatch} from "react-redux"
import { SIGN_IN } from "@/constants/config";
import { getCurrentUser } from "@/services/steins-admin/authController";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar siderMenus={SIDER_MENUS}/>
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"} ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<Dispatch>()
  useEffect(() => {
    if (location.pathname !== SIGN_IN) {
      getUserLoginInfo()
    }
  }, []);
  const getUserLoginInfo = async () => {
    const resp = await getCurrentUser();
    handleResponse<API.AdminLoginUserVo>({
      resp,
      onSuccess: (res) => {
        dispatch.authModel.setUserInfo(res)
      }
    })
  };
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
