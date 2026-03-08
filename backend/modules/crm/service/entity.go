package service

import (
	request "github.com/ts-gunner/forty-platform/common/request/crm"
	"github.com/ts-gunner/forty-platform/common/response"
	crmResponse "github.com/ts-gunner/forty-platform/common/response/crm"
)

type EntityService struct{}

func (EntityService) GetCrmEntityList(req request.GetEntityListRequest) (*response.PageResult[crmResponse.CrmEntityVo], error) {
	return nil, nil
}
