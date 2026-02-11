interface ApiResult<T> {
  code?: number;
  msg?: string;
  data?: T;
}


declare namespace ReduxModel {
  interface GlobalType {
    lang: LocaleLang;
    theme: "light" | "dark";
    toastRef: React.MutableRefObject<ToasterRef | undefined> | null;
  }

  interface AuthType {
    userInfo: API.UserLoginVo;
  }
}

declare namespace Sider {
  interface NavItem {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  }
}

declare namespace Knowledge {
  type FileNodeVo = {
    nodeId?: string;
    id?: number;
    nodeName?: string;
    nodeType?: string;
    nodeDescription?: string | null;
    nodeRelPath?: string | null;
    nodeRelIdPath?: string | null;
    fileStatus?: number | null;
    fileType?: string | null;
    fileVectorRemark?: string | null;
    fileSize?: string | null;
    fileRemark?: string | null;
    uploader?: string | null;
    userId?: string | null;
    updateTime?: string | null;
  };
}
