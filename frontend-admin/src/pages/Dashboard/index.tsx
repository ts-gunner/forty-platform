import EcommerceMetrics from "@/components/dashboard/EcommerceMetrics";
import MonthlyCustomersChart from "@/components/dashboard/MonthlyCustomersChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "@/components/common/PageMeta";
import MetricTable from "@/components/dashboard/MetricTable";
import UserDailyCrmChart from "@/components/dashboard/UserDailyCrmChart";
import config from "@/constants/config";

export default function Home() {
  return (
    <div>
      <PageMeta title={`${config.title} | 数据看板`} description="" />
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-8 space-y-6">
          <EcommerceMetrics />
          <UserDailyCrmChart />
        </div>

        <div className="col-span-4 relative">
          <div className="absolute inset-0">
            <MetricTable />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <MonthlyCustomersChart />
      </div>
    </div>
  );
}
