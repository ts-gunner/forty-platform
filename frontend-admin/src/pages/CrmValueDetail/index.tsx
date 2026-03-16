import { getEntityList } from "@/services/steins-admin/crmEntityController";
import { getFieldsByEntityId } from "@/services/steins-admin/crmEntityFieldController";
import { getEntityValueDetail } from "@/services/steins-admin/crmEntityValueController";
import { handleResponse, Notify } from "@/utils/common";
import { handleCrmValueByField } from "@/utils/crm";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Divider, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { history, useParams } from "umi";

export default function CrmValueDetailPage() {
  const { valueId } = useParams();
  const [detailData, setDetailData] = useState<any>({});
  const [entityFields, setEntityFields] = useState<API.CrmEntityFieldVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (valueId) {
      getDetail();
    }
  }, [valueId]);

  const getDetail = async () => {
    setLoading(true);
    // 获取实体数据详情
    const resp = await getEntityValueDetail({
      entityValueId: valueId as string,
    });

    handleResponse({
      resp,
      onSuccess: async (data) => {
        try {
          let valueJson = JSON.parse(data.values || "")
          setDetailData(valueJson);
        } catch {
          Notify.fail("实体数据详情解析失败")
          return
        }
        await getFields(data.entityId as string)
      },
      onError: () => {
        Notify.fail(resp.msg || "获取实体数据详情失败");
      },
      onFinish: () => {
        setLoading(false);
      }
    });

  };

  const getFields = async (entityId: string) => {
    const resp = await getFieldsByEntityId({
      entityId
    })
    handleResponse({
      resp,
      onSuccess: (data) => {
        setEntityFields(data)
      }
    })
  }

  const handleBack = () => {
    history.back();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回
          </Button>
          <h2>{detailData["customer_name"]} - 数据详情</h2>
        </div>
      </div>

      <Spin spinning={loading} description="加载中...">
        <Card>
          <Descriptions column={2} bordered>

            {/* 动态字段 */}
            {entityFields.map((field) => (
              <Descriptions.Item key={field.fieldKey} label={field.fieldName}>
                {handleCrmValueByField(field, detailData)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      </Spin>
    </div>
  );
}
