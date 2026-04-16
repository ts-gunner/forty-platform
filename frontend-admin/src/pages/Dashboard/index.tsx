import EcommerceMetrics from "@/components/dashboard/EcommerceMetrics";
import MonthlyCustomersChart from "@/components/dashboard/MonthlyCustomersChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "@/components/common/PageMeta";
import config from "@/constants/config";

export default function Home() {
  return (
    <div>
      <PageMeta title={`${config.title} | 数据看板`} description="" />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <EcommerceMetrics />
          </div>

          {/* 

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
        </div>
        <div className="w-full">
          <MonthlyCustomersChart />
        </div>
      </div>
    </div>
  );
}
