# ubuntu定时备份

1. `crontab -e`
2. 每天早上8点，执行脚本： `0 8 * * * /bin/bash /workspace/mysql_backup.sh >/dev/null 2>&1`
3. 查看是否配置成功：`crontab -l`