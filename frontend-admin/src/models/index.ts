import { Models } from "@rematch/core";
import { authModel } from "./auth";
import { globalModel } from "./global";

export interface RootModel extends Models<RootModel> {
  globalModel: typeof globalModel;
  authModel: typeof authModel;
}

export const models: RootModel = {
  globalModel,
  authModel,
};


