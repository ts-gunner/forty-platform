import { createModel } from "@rematch/core";
import type { RootModel } from '../models'

type UserInfoType = {
    nickname: string
    avatar?: string

} 
type AuthType = {
    isAuth: boolean
    userInfo: UserInfoType
    authLoading: boolean
}
const initState: AuthType = {
    isAuth: false,
    userInfo: {
        nickname: "微信用户",
    },
    authLoading: false
}

export const authModel = createModel<RootModel>()({
    state: initState,
    reducers: {
        setIsAuth: (state: AuthType, payload: boolean) => {
            return {
                ...state,
                isAuth: payload
            }
        },
        setUserInfo: (state: AuthType, payload: UserInfoType) => {
            return {
                ...state,
                userInfo: payload
            }
        },
        setAuthLoading: (state:AuthType, payload: boolean) => {
            return {
                ...state,
                authLoading: payload
            }
        }

    },
    effects: (dispatch) => ({
        userLogin: (code: string) => {
            dispatch.authModel.setAuthLoading(true)
            console.log("code", code)
           

            setTimeout(() => {
                dispatch.authModel.setUserInfo({
                    nickname: "大聪明",
                })
                dispatch.authModel.setIsAuth(true)

                dispatch.authModel.setAuthLoading(false)
            }, 3000)
           
        }
    })
})