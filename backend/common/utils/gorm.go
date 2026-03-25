package utils

func GetCurrentPage(current int) int {
	if current <= 0 {
		return 1
	}
	return current
}

func GetPageSize(pageSize int) int {
	if pageSize <= 0 {
		return 20
	}
	return pageSize
}
