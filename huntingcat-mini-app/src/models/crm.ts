import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";
import { getFieldsByEntityKey } from "@/services/steins-admin/crmEntityFieldController";
import { CRM_TABLE_CODE } from "@/constant/global";
import { handleResponse, Notify } from "@/utils/common";

const initState: ReduxModel.CrmModelType = {
  tableFields: undefined,
  selectedEntityValue: undefined,
};

export const crmModel = createModel<RootModel>()({
  state: initState,
  reducers: {
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
    getFieldName: (fieldKey:string, state) => {
      const {tableFields} = state.crmModel
      if (!tableFields) {
        return "-"
      }
      let idx = tableFields.findIndex(it => it.fieldKey === fieldKey)
      if (idx !== -1) {
        return tableFields[idx].fieldName
      }
      return "未知"
    },
  
  }),
});
