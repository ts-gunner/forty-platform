
import { View, Image, Text } from "@tarojs/components"
import { ATTACHMENT } from '../../constant/resource'
import { useDispatch, useSelector } from "react-redux"
import { Dispatch, RootState } from "../../store"
import { login } from "@tarojs/taro"
import { AtToast } from "taro-ui"

export default function UserPage() {
  const dispatch = useDispatch<Dispatch>()
  const isAuth = useSelector((state: RootState) => state.authModel.isAuth)
  const authLoading = useSelector((state: RootState) => state.authModel.authLoading)
  const userInfo = useSelector((state: RootState) => state.authModel.userInfo)
  const userLogin = () => {
    login({
      success: (res: any) => {
        if (res.code) {
          dispatch.authModel.userLogin(res.code)
        }

      }
    })
  }
  return (
    <View>
      <Image src={ATTACHMENT.mine_bg} className="w-full" mode="aspectFit"></Image>
    </View>
 
  )
}