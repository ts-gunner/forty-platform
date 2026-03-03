import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";
import menus from "../constant/menus";

const initState: ReduxModel.RouterModelType = {
    routerIndex: 0,
    tabList: menus
}

export const routerModel = createModel<RootModel>()({

    state: initState,
    reducers: {
        setRouteIndex: (state, payload: number) => ({
            ...state,
            routerIndex: payload
        })
    },
    effects: (dispatch) => ({


    })
})