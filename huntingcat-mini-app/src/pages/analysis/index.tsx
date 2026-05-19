import { withGlobalLayout } from "@/components/AppLayout"
import { ROUTERS } from "@/constant/menus";
import { getCustomerTrendChart } from "@/services/steins-admin/analysisController";
import { RootState } from "@/store";
import { handleResponse } from "@/utils/common";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { View } from "@tarojs/components";
const CURRENT_PAGE = ROUTERS.customerAnalysis;
function AnalysisWithBizPage() {
    const [chartData, setChartData] = useState<API.CustomerTrendChart[]>([]);
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
        const resp = await getCustomerTrendChart();
        handleResponse({
            resp,
            onSuccess: (data) => {
                setChartData(data || []);
            },
        });
    }

    return (
        <HeaderBodyFooterLayout title="客源增量">
            <View style={{ width: '100%', height: '600rpx', position: 'relative' }}>
              暂未实现
            </View>
        </HeaderBodyFooterLayout>
    )
}


export default withGlobalLayout(AnalysisWithBizPage)