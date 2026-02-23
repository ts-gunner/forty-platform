import { View,Text } from "@tarojs/components"

type TagProperty = {
    tagName: string
    customStyle?: object

}
export default function Tag({tagName, customStyle}: TagProperty) {
  return (
      <View style={{
          ...customStyle,
          border: "0.05rem solid #508AB2",
          padding: "0.2rem 0.2rem"
      }}>{ tagName }</View>
  )
}
