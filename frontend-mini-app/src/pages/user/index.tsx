import { login } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../store";
import NavHeaderBar from "../../components/nav-header/NavHeaderBar";

export default function UserPage() {
  const dispatch = useDispatch<Dispatch>();
  const isAuth = useSelector((state: RootState) => state.authModel.isAuth);
  const authLoading = useSelector(
    (state: RootState) => state.authModel.authLoading,
  );
  const userInfo = useSelector((state: RootState) => state.authModel.userInfo);
  const userLogin = () => {
    login({
      success: (res: any) => {
        if (res.code) {
          dispatch.authModel.userLogin(res.code);
        }
      },
    });
  };
  return (
    <>
    <NavHeaderBar >

      ss
    </NavHeaderBar>
   
      <View className='h-screen'>hello</View>
    </>
  );
}
