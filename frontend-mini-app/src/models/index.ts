import { Models } from "@rematch/core"
import { globalModel } from "./global"
import { chatModel } from "./chat"
import { authModel } from "./auth"

export interface RootModel extends Models<RootModel>{
    globalModel: typeof globalModel,
    chatModel: typeof chatModel,
    authModel: typeof authModel,
}


export const models: RootModel = {
    globalModel,
    chatModel,
    authModel,
}