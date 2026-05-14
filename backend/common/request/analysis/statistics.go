package analysis

type GetUserCrmTrendRequest struct {
	UserId int64 `form:"userId,string" binding:"required"`
}
