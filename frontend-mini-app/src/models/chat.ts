import { createModel } from "@rematch/core";
import type { RootModel } from '../models'

type ChatType = {


}
const initState: ChatType = {

}

export const chatModel = createModel<RootModel>()({
    state: initState,
    reducers: {
      

    },
    effects: (dispatch) => ({
     
    })
})