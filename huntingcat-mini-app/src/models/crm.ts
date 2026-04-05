import { createModel } from "@rematch/core";
import type { RootModel } from "../models";
import { Crm, ReduxModel } from "@/typing";
import { getFieldsByEntityKey } from "@/services/steins-admin/crmEntityFieldController";
import {
  CRM_TABLE_CODE,
  DEFAULT_CUSTOMER_DATA,
  DEFAULT_PAGE_SIZE,
} from "@/constant/global";
import { handleResponse, Notify } from "@/utils/common";
import { getEntityByKey } from "@/services/steins-admin/crmEntityController";
import {
  getCrmValueCount,
  getEntityValueList,
  getEntityValueListBySelf,
  updateEntityValue,
} from "@/services/steins-admin/crmEntityValueController";
import { addCustomerFavorite, removeCustomerFavorite } from "@/services/steins-admin/crmCustomerFavoriteController";

const initState: ReduxModel.CrmModelType = {
  entityVo: undefined,
  tableFields: undefined,
  selectedEntityValue: undefined,
  filterParams: {},
  myCustomerData: DEFAULT_CUSTOMER_DATA,
  allCustomerData: DEFAULT_CUSTOMER_DATA,
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
    setMyCustomerData: (state, payload: Crm.CustomerData) => ({
      ...state,
      myCustomerData: payload,
    }),
    setAllCustomerData: (state, payload: Crm.CustomerData) => ({
      ...state,
      allCustomerData: payload,
    }),
    initMyCustomerData: (state) => ({
      ...state,
      myCustomerData: DEFAULT_CUSTOMER_DATA,
    }),
    initAllCustomerData: (state) => ({
      ...state,
      allCustomerData: DEFAULT_CUSTOMER_DATA,
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

    getEntityValues: async (
      payload: {
        mode: "mine" | "all";
      },
      state,
    ) => {
      Notify.loading("数据加载中....");
      let resp: API.ApiResultCrmCrmEntityValueObjectVo;
      if (payload.mode === "mine") {
        resp = await getEntityValueListBySelf({
          pageNum: state.crmModel.myCustomerData.current,
          pageSize: state.crmModel.myCustomerData.pageSize,
          entityKey: CRM_TABLE_CODE,
          filterParams: state.crmModel.filterParams || {},
        });
      } else {
        resp = await getEntityValueList({
          pageNum: state.crmModel.allCustomerData.current,
          pageSize: state.crmModel.allCustomerData.pageSize,
          entityKey: CRM_TABLE_CODE,
          filterParams: state.crmModel.filterParams || {},
          userId: state.crmModel.filterParams?.["business_worker"] || "0"
        });
      }
      handleResponse({
        resp,
        onSuccess: (data) => {
          if (data.entityValue.list.length === 0) {
            dispatch.crmModel.updateCustomerDataState({
              mode: payload.mode,
              list: data.entityValue.list,
            });
            Notify.ok("没有更多数据了");
          } else {
            dispatch.crmModel.updateCustomerDataState({
              mode: payload.mode,
              list: data.entityValue.list,
            });
            Notify.clear();
          }
        },
        onError: () => {
          Notify.fail("获取客户数据失败:" + resp.msg);
        },
      });
    },
    handleSearchData: async (
      payload: {
        mode: "mine" | "all";
        text: string;
      },
      state,
    ) => {
      dispatch.crmModel.setFilterParams({
        ...state.crmModel.filterParams,
        customer_name: payload.text,
      });

      await dispatch.crmModel.getEntityValues({ mode: payload.mode });
    },
    countValue: async (_, state) => {
      Notify.loading("加载数据中...")
      const resp = await getCrmValueCount({
        entityId: state.crmModel.entityVo.entityId
      })
      let vo:API.CrmValueCountVo
      handleResponse({
        resp,
        onSuccess: (data) => {
          vo = data
          Notify.clear()
        },
        onError: () => {
          Notify.fail("统计数据异常")
        },
        onFinish: () => {

        }
      })
      return vo
    },
    updateCustomerDataState: (
      payload: {
        mode: "mine" | "all";
        list: API.CrmEntityValueVo[];
      },
      state,
    ) => {
      const { myCustomerData, allCustomerData } = state.crmModel;
      if (payload.mode === "mine") {
        dispatch.crmModel.setMyCustomerData({
          ...myCustomerData,
          data: {
            ...myCustomerData.data,
            [myCustomerData.current]: payload.list,
          },
        });
      } else {
        dispatch.crmModel.setAllCustomerData({
          ...allCustomerData,
          data: {
            ...allCustomerData.data,
            [allCustomerData.current]: payload.list,
          },
        });
      }
    },
    handleChangeFavorite: async (payload: {
      mode: "mine" | "all"
      isFavorite: boolean
      entityId: string
      valueId: string
    }) => {
      if (payload.isFavorite) {
        // 取消收藏
        const resp = await removeCustomerFavorite({
          entityId: payload.entityId,
          valueId: payload.valueId,
        });
        handleResponse({
          resp,
          onSuccess: () => {
            dispatch.crmModel.getEntityValues({mode: payload.mode})
          },
          onError: () => {
            Notify.fail("取消收藏失败");
          },
        });
      } else {
        // 添加收藏
        const resp = await addCustomerFavorite({
          entityId: payload.entityId,
          valueId: payload.valueId,
        });
        handleResponse({
          resp,
          onSuccess: () => {
             dispatch.crmModel.getEntityValues({mode: payload.mode})
          },
          onError: () => {
            Notify.fail("收藏失败");
          },
        });
      }
    },
  }),
});
