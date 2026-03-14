import { Models } from "@rematch/core";
import { authModel } from "./auth";
import { routerModel } from "./router";
import { crmModel } from "./crm";
import { globalModel } from "./global";

export interface RootModel extends Models<RootModel> {
  authModel: typeof authModel;
  routerModel: typeof routerModel;
  crmModel: typeof crmModel;
  globalModel: typeof globalModel;
}

export const models: RootModel = {
  authModel,
  routerModel,
  crmModel,
  globalModel,
};
