import { cn } from '@/utils/common'
import { ICON_MAP } from '@/constant/global'
import { Image, Text, View } from '@tarojs/components'
type BusinessLogoProps = { title: string; className?: string; textClassName?: string }
export default function BusinessLogo({ title, className, textClassName }: BusinessLogoProps) {
    return (
        <View className={cn('flex items-center justify-center gap-2', className)}>

            <Image src={ICON_MAP.searchLogo} mode="heightFix" className='h-12'/>
            <View className={cn("font-bold tracking-[0.25em]", textClassName)}>{title}</View>
        </View>
    )
}
