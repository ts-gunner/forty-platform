import { Models } from "@rematch/core";
import { authModel } from "./auth";
import { routerModel } from "./router";
import { crmModel } from "./crm";
import { notificationModel } from "./notification";

export interface RootModel extends Models<RootModel> {
  authModel: typeof authModel;
  routerModel: typeof routerModel;
  crmModel: typeof crmModel;
  notificationModel: typeof notificationModel;
}

export const models: RootModel = {
  authModel,
  routerModel,
  crmModel,
  notificationModel,
};
