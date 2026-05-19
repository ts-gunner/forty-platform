import { withGlobalLayout } from "@/components/AppLayout"
import { ROUTERS } from "@/constant/menus";
import { RootState } from "@/store";
import { View } from "@tarojs/components"
import { useEffect } from "react";
import { useSelector } from "react-redux";
const CURRENT_PAGE = ROUTERS.customerAnalysisWithBiz;
function AnalysisWithBizPage() {
 const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  useEffect(() => {
    if (!activeRoute) {
      return;
    }
    if (CURRENT_PAGE === activeRoute) {
      getPageData()
    } else {

    }
  }, [activeRoute]);
  const getPageData = async () => {
    
  }
  return (
    <View>AnalysisPage</View>
  )
}


export default withGlobalLayout(AnalysisWithBizPage)