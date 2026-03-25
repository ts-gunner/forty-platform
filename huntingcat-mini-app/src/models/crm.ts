import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";
import {
  getFieldsByEntityId,
  getFieldsByEntityKey,
} from "@/services/steins-admin/crmEntityFieldController";
import { CRM_TABLE_CODE } from "@/constant/global";
import { handleResponse, Notify } from "@/utils/common";
import { getEntityByKey } from "@/services/steins-admin/crmEntityController";

const initState: ReduxModel.CrmModelType = {
  entityVo: undefined,
  tableFields: undefined,
  selectedEntityValue: undefined,
  filterParams: {},
  searchText: "",
};

export const crmModel = createModel<RootModel>()({
  state: initState,
  reducers: {
    setEntityVo: (state, payload: API.CrmEntityVo) => ({
      ...state,
      entityVo: payload,
    }),
    setFilterParams: (state, payload: Record<string, any>) => ({
      ...state,
      filterParams: payload,
    }),
    setSearchText: (state, payload: string) => ({
      ...state,
      searchText: payload,
    }),
    setTableFields: (state, payload: API.CrmEntityFieldVo[]) => ({
      ...state,
      tableFields: payload,
    }),
    setSelectedEntityValue: (state, payload: API.CrmEntityValueVo) => ({
      ...state,
      selectedEntityValue: payload,
    }),
  },
  effects: (dispatch) => ({
    getEntityObject: async () => {
      const resp = await getEntityByKey({
        entityKey: CRM_TABLE_CODE,
      });
      handleResponse({
        resp,
        onSuccess: (data) => {
          dispatch.crmModel.setEntityVo(data);
        },
        onError: () => {
          Notify.fail("获取实体失败:" + resp.msg);
        },
      });
    },
    // 获取CRM字段信息
    getCrmFields: async () => {
      const resp = await getFieldsByEntityKey({
        entityKey: CRM_TABLE_CODE,
      });
      handleResponse({
        resp,
        onSuccess: (data) => {
          dispatch.crmModel.setTableFields(data);
        },
        onError: () => {
          Notify.fail("获取客户字段失败:" + resp.msg);
        },
      });
    },
    getFieldName: (fieldKey: string, state) => {
      const { tableFields } = state.crmModel;
      if (!tableFields) {
        return "-";
      }
      let idx = tableFields.findIndex((it) => it.fieldKey === fieldKey);
      if (idx !== -1) {
        return tableFields[idx].fieldName;
      }
      return "未知";
    },
  }),
});
