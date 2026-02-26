import { Image } from "@tarojs/components";
import { ICON_MAP } from "./global";

export const MY_ORDER_ICONS = [
  {
    key: "0",
    title: "全部",
    icon: <Image src={ICON_MAP.order.all} className="h-6 w-6" />,
  },
  {
    key: "1",
    title: "待支付", // 问诊、体检、预约、购药、服务下单未付款
    icon: <Image src={ICON_MAP.order.waitPayment} className="h-6 w-6" />,
  },
  {
    key: "3",
    title: "待服务", // 已接诊未结束、体检进行中、配送中药品在路上
    icon: <Image src={ICON_MAP.order.waitService} className="h-6 w-6" />,
  },
  {
    key: "5",
    title: "退款",
    icon: <Image src={ICON_MAP.order.refund} className="h-6 w-6" />,
  },
];

export const MY_SERVICE_ICONS = [
  {
    key: "1",
    title: "我的报告",
    icon: <Image src={ICON_MAP.service.myReport} className="h-6 w-6" />,
  },

  {
    key: "2",
    title: "专属健管",
    icon: <Image src={ICON_MAP.service.health} className="h-6 w-6" />,
  },
  {
    key: "3",
    title: "AI助手",
    icon: <Image src={ICON_MAP.service.aiAssistant} className="h-6 w-6" />,
  },
  {
    key: "4",
    title: "体检数据",
    icon: <Image src={ICON_MAP.service.medicalData} className="h-6 w-6" />,
  },
];



export const MORE_FUNCTION_ICONS = [
  {
    key: "1",
    title: "入驻护士",
    icon: <Image src={ICON_MAP.moreFunction.joinUs} className="h-6 w-6" />
  },
  {
    key: "2",
    title: "关于我们",
    icon: <Image src={ICON_MAP.moreFunction.aboutUs} className="h-6 w-6" />
  },
  {
    key: "3",
    title: "联系客服",
    icon: <Image src={ICON_MAP.moreFunction.contactUs} className="h-6 w-6" />
  },
  {
    key: "4",
    title: "意见反馈",
    icon: <Image src={ICON_MAP.moreFunction.questionFeedback} className="h-6 w-6" />
  },
  {
    key: "5",
    title: "兑换码",
    icon: <Image src={ICON_MAP.moreFunction.redeptionCode} className="h-6 w-6" />
  },
]