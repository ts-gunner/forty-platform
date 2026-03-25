import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { ReduxModel } from "@/typing";
import {
  getFieldsByEntityId,
  getFieldsByEntityKey,
} from "@/services/steins-admin/crmEntityFieldController";
import { CRM_TABLE_CODE, DEFAULT_PAGE_SIZE } from "@/constant/global";
import { handleResponse, Notify } from "@/utils/common";
import { getEntityByKey } from "@/services/steins-admin/crmEntityController";
import { getEntityValueList, getEntityValueListBySelf } from "@/services/steins-admin/crmEntityValueController";

const initState: ReduxModel.CrmModelType = {
  entityVo: undefined,
  tableFields: undefined,
  selectedEntityValue: undefined,
  filterParams: {},
  myCustomerData: [],
  allCustomerData: [],
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
    setTableFields: (state, payload: API.CrmEntityFieldVo[]) => ({
      ...state,
      tableFields: payload,
    }),
    setSelectedEntityValue: (state, payload: API.CrmEntityValueVo) => ({
      ...state,
      selectedEntityValue: payload,
    }),
    setMyCustomerData: (state, payload: API.CrmEntityValueVo[]) => ({
      ...state,
      myCustomerData: payload,
    }),
    setAllCustomerData: (state, payload: API.CrmEntityValueVo[]) => ({
      ...state,
      allCustomerData: payload,
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

    getEntityValues: async (payload: {
      mode: "mine" | "all";
      pageNum?: number
      pageSize?: number
    }, state) => {
      Notify.loading("数据加载中....");
      let resp: API.ApiResultCrmCrmEntityValueObjectVo;
      if (payload.mode === "mine") {
        resp = await getEntityValueListBySelf({
          pageNum: payload.pageNum || 1,
          pageSize: payload.pageSize || DEFAULT_PAGE_SIZE,
          entityKey: CRM_TABLE_CODE,
          filterParams: state.crmModel.filterParams,
        });
      } else {
        resp = await getEntityValueList({
          pageNum: payload.pageNum || 1,
          pageSize: payload.pageSize || DEFAULT_PAGE_SIZE,
          entityKey: CRM_TABLE_CODE,
          filterParams: state.crmModel.filterParams,
        });
      }
      handleResponse({
        resp,
        onSuccess: (data) => {
          if (data.entityValue.list.length === 0) {
            dispatch.crmModel.updateCustomerDataState({
              mode: payload.mode,
              list: data.entityValue.list
            })
            Notify.ok("没有更多数据了");
          } else {
            dispatch.crmModel.updateCustomerDataState({
              mode: payload.mode,
              list: data.entityValue.list
            })
            Notify.clear();
          }
        },
        onError: () => {
          Notify.fail("获取客户数据失败:" + resp.msg);
        },
      })
    },
    handleSearchData: async (payload: {
      mode: "mine" | "all"
      text: string
    }, state) => {
      dispatch.crmModel.setFilterParams({
        ...state.crmModel.filterParams,
        "customer_name": payload.text,
      })

      await dispatch.crmModel.getEntityValues({ mode: payload.mode })
    },
    updateCustomerDataState: (payload: {
      mode: "mine" | "all",
      list: API.CrmEntityValueVo[]
    }) => {
      if (payload.mode === "mine") {
        dispatch.crmModel.setMyCustomerData(payload.list)
      } else {
        dispatch.crmModel.setAllCustomerData(payload.list)
      }
    }
  }),
});
