import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from '../models'
import persistPlugin from "@rematch/persist";
import storage from '../utils/storage';

const persist_plugin = persistPlugin<RootModel, RootModel>({
  whitelist: [
    ],
    key: "store",
    storage,
  })

export const store = init({
    name:"global-redux-store",
	models,
    plugins:[persist_plugin]
})
 
export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>