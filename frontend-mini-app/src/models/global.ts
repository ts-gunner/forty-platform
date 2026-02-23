import { createModel } from "@rematch/core";
import type { RootModel } from '../models'


type GlobalType = {
}
const initState: GlobalType = {
}

export const globalModel = createModel<RootModel>()({
    state: initState,
    reducers: {
    
    
    },
    effects: (dispatch) => ({

    })
})