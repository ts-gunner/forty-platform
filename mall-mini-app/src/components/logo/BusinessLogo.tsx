import { cn } from '@/utils/common'
import { View } from '@tarojs/components'
type BusinessLogoProps = { title: string; className?: string; textClassName?: string }
export default function BusinessLogo({ title, className, textClassName }: BusinessLogoProps) {
    return (
        <View className={cn('flex items-center justify-center gap-2', className)}>
            <View className={cn("font-bold tracking-[0.25em]", textClassName)}>{title}</View>
        </View>
    )
}
