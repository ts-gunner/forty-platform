import { Models } from "@rematch/core"
import { authModel } from "./auth"
import { routerModel } from "./router"

export interface RootModel extends Models<RootModel>{
    authModel: typeof authModel,
    routerModel: typeof routerModel,
}


export const models: RootModel = {
    authModel,routerModel,
}