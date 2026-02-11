import { BoxCubeIcon, CalenderIcon, GridIcon, GroupIcon, ListIcon, PageIcon, PieChartIcon, PlugInIcon, TableIcon, UserCircleIcon } from "../icons";
import { BookCopy, LayoutGrid } from "lucide-react";

const SIDER_MENUS: Record<string, Sider.NavItem[]> = {
  
  Menu: [
    {
      icon: <GridIcon />,
      name: "dashboard",
      path: "/",
    },
    {
      icon: <GroupIcon />,
      name: "userManagement",
      path: "/user-management",
    },
     {
        icon: <LayoutGrid />,
        name: "aigc",
        subItems: [
          { name: "问题示例管理", path: "/question/example" },
        ],
    },
    {
        icon: <BookCopy />,
        name: "knowledge",
        subItems: [
          { name: "知识库", path: "/knowledge/personal" },
          { name: "数据库", path: "/knowledge/database" },
        ],
    },
    // {
    //   icon: <CalenderIcon />,
    //   name: "Calendar",
    //   path: "/calendar",
    // },
    // {
    //   icon: <UserCircleIcon />,
    //   name: "User Profile",
    //   path: "/profile",
    // },
    // {
    //   name: "Forms",
    //   icon: <ListIcon />,
    //   subItems: [{ name: "Form Elements", path: "/form-elements",  }],
    // },
    // {
    //   name: "Tables",
    //   icon: <TableIcon />,
    //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
    // },
    // {
    //   name: "Pages",
    //   icon: <PageIcon />,
    //   subItems: [
    //     { name: "Blank Page", path: "/blank", pro: false },
    //     { name: "404 Error", path: "/error-404", pro: false },
    //   ],
    // },
  ],
  // Others: [
  //   {
  //     icon: <PieChartIcon />,
  //     name: "Charts",
  //     subItems: [
  //       { name: "Line Chart", path: "/line-chart", pro: false },
  //       { name: "Bar Chart", path: "/bar-chart", pro: false },
  //     ],
  //   },
  //   {
  //     icon: <BoxCubeIcon />,
  //     name: "UI Elements",
  //     subItems: [
  //       { name: "Alerts", path: "/alerts", pro: false },
  //       { name: "Avatar", path: "/avatars", pro: false },
  //       { name: "Badge", path: "/badge", pro: false },
  //       { name: "Buttons", path: "/buttons", pro: false },
  //       { name: "Images", path: "/images", pro: false },
  //       { name: "Videos", path: "/videos", pro: false },
  //     ],
  //   },
  //   {
  //     icon: <PlugInIcon />,
  //     name: "Authentication",
  //     subItems: [
  //       { name: "Sign In", path: "/signin", pro: false },
  //       { name: "Sign Up", path: "/signup", pro: false },
  //     ],
  //   },
  // ],
};

export default SIDER_MENUS;
