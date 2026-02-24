import { View, Text, Image } from '@tarojs/components'

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
