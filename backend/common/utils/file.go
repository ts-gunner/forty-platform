package utils

import "os"

func FolderPathExists(path string) (bool, error) {

	stat, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return stat.IsDir(), nil
}
