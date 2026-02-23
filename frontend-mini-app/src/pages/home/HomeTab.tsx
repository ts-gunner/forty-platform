import { View, Text, Image } from '@tarojs/components'
import { ICONS } from '../../constant/resource'
const fileTabs = [
    {
        label: "基本健康信息",
        icon: ICONS.base_health
    },
    {
        label: "健康档案",
        icon: ICONS.health_file
    },
    {
        label: "近期体检报告",
        icon: ICONS.medical_record
    },
    {
        label: "过敏信息记录",
        icon: ICONS.tablet_record
    },


]
const serviceTabs = [
   
    {
        label: "养老照护",
        icon: ICONS.older_care
    },
    {
        label: "母婴护理",
        icon: ICONS.baby_care
    },
    {
        label: "中医理疗",
        icon: ICONS.zyll
    },
    {
        label: "干眼护理",
        icon: ICONS.eye_care
    },
    {
        label: "陪诊服务",
        icon: ICONS.help_care
    },
    {
        label: "护工入驻",
        icon: ICONS.professor_server
    },
]

const aigcTabs = [
    {
        label: "AI问答",
        icon: ICONS.AI_robot
    },
    {
        label: "AI中医",
        icon: ICONS.AI_doctor
    },
    {
        label: "健康评测",
        icon: ICONS.health_test
    },
    {
        label: "饮食管理",
        icon: ICONS.food_manage
    },
    {
        label: "运动管理",
        icon: ICONS.sport_manage
    },

]
const serverSubscribeTabs = [
    {
        title: "便捷预约通道",
        description: "轻松点一点，专业医护人员按时上门为您服务！"
    },
    {
        title: "上门服务预约",
        description: "轻松点一点，专业医护人员按时上门为您服务！"
    },

]

export default function HomeTab() {
    return (
        <View>

            <View>
                <View className='font-bold mt-5 ml-2 mb-4'>健康档案总览</View>
            </View>
            <View className='grid grid-cols-4 gap-2 place-items-center'>
                {
                    fileTabs.map((item, index) => (
                        <View key={index} className='flex flex-col gap-2 items-center justify-center'>
                            <Image src={item.icon} className='w-6 h-6' />
                            <Text className='text-xs'>{item.label}</Text>
                        </View>
                    ))
                }
            </View>
            <View>
                <View className='font-bold mt-5 ml-2 mb-4'>健康服务</View>
            </View>
            <View className='grid grid-cols-4 gap-2 place-items-center'>
                {
                    serviceTabs.map((item, index) => (
                        <View key={index} className='flex flex-col gap-2 items-center justify-center'>
                            <Image src={item.icon} className='w-6 h-6' />
                            <Text className='text-xs'>{item.label}</Text>
                        </View>
                    ))
                }
            </View>
            <View>
                <View className='font-bold mt-5 ml-2 mb-4'>AI健康</View>
            </View>
            <View className='grid grid-cols-5 gap-2 place-items-center'>
                {
                    aigcTabs.map((item, index) => (
                        <View key={index} className='flex flex-col gap-2 items-center justify-center'>
                            <Image src={item.icon} className='w-6 h-6' />
                            <Text className='text-xs'>{item.label}</Text>
                        </View>
                    ))
                }
            </View>
            <View>
                <View className='font-bold mt-5 ml-2 mb-4'>上门服务预约</View>
            </View>
            <View className='grid grid-cols-2 gap-5 place-items-center mx-2'>
                {
                    serverSubscribeTabs.map((item, index) => (
                        <View className='w-full bg-[#f4f6f9] p-3 rounded-xl flex flex-col gap-2' key={index}>

                            <View className='font-bold text-sm'>{item.title}</View>
                            <View className='text-xs text-black/50'>{item.description}</View>

                            <View className='flex'>
                                <View className='text-white bg-[#1684fc] py-1 px-4 rounded-xl font-bold text-xs'>查看详情</View>

                            </View>
                        </View>
                    ))
                }

            </View>
        </View>
    )
}
