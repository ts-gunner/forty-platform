package utils

import "github.com/casbin/casbin/v3"

/*
*
同步用户角色的绑定
*/
func SyncUserRoleBind(e *casbin.Enforcer, userId string, roleKeys []string) error {
	_, err := e.RemoveFilteredGroupingPolicy(0, userId)
	if err != nil {
		return err
	}
	// 2. 批量添加新的角色关联
	if len(roleKeys) > 0 {
		var rules [][]string
		for _, roleKey := range roleKeys {
			rules = append(rules, []string{userId, roleKey})
		}
		_, err = e.AddGroupingPolicies(rules)
	}

	return e.SavePolicy()
}
