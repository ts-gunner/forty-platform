import { View, Image, Text } from "@tarojs/components"
import React from "react"


type CartType = {
    title: string
    img: string
    children?: React.PropsWithChildren<any>

}
export default function Card({ title, img }: CartType) {

    return (
        <View style={{
            width: "4rem",
            gap: 5,
        }}>
            <View style={{
                display: "flex",
                flexDirection: "column"
            }}>
                <Image src={img} style={{
                    width: "5rem",
                    height: "3rem",
                    borderRadius: "0.5rem"
                }} />
                <Text style={{ fontWeight: 600, textAlign: "left", textWrap: "wrap" }}>{title}</Text>

            </View>

        </View>
    )
}
