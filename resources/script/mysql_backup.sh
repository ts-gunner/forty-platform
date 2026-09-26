#!/bin/bash
#=============================================================
# MySQL 每日自动备份脚本
# 功能：每天备份 MySQL 数据库，并删除 N 天前的旧备份
#=============================================================

#======================= 可配置变量 ==========================
# MySQL 连接配置
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_USER="root"
DB_PASS="DB_PASSWORD"
DB_NAME="DB_NAME"        # 若要备份所有库，可改成 --all-databases

# 备份相关配置
BACKUP_DIR="/workspace/backup/mysql"     # 备份文件存放目录
RETENTION_DAYS=3                    # 保留天数（超过此天数的备份将被删除）
DATE=$(date +%Y%m%d)         # 时间戳
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup.log" # 日志文件
#=============================================================

# 确保备份目录存在
mkdir -p "${BACKUP_DIR}"

# 写日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

log "========== 开始备份数据库 ${DB_NAME} =========="

if ! type mysqldump >/dev/null 2>&1; then
    log "错误：未找到 mysqldump 命令，请先安装 mysql-client"
    exit 1
fi
# 执行备份（gzip 压缩，节省磁盘空间）
mysqldump \
    -h"${DB_HOST}" \
    -P"${DB_PORT}" \
    -u"${DB_USER}" \
    -p"${DB_PASS}" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --set-gtid-purged=OFF \
    "${DB_NAME}" 2>>"${LOG_FILE}" | gzip > "${BACKUP_FILE}"

# 检查备份是否成功（检查管道退出状态用 PIPESTATUS）
if [ ${PIPESTATUS[0]} -eq 0 ] && [ -s "${BACKUP_FILE}" ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    log "备份成功：${BACKUP_FILE} (大小: ${SIZE})"
else
    log "备份失败！请检查数据库连接或权限。"
    # 删除不完整的备份文件
    rm -f "${BACKUP_FILE}"
    exit 1
fi

#======================== 清理旧备份 =========================
log "开始清理 ${RETENTION_DAYS} 天前的旧备份..."

# 方法一：按文件修改时间删除（推荐）
DELETED_COUNT=$(find "${BACKUP_DIR}" -maxdepth 1 -type f -name "*.sql.gz" \
    -mtime +${RETENTION_DAYS} -print -delete | wc -l)

log "已删除 ${DELETED_COUNT} 个超过 ${RETENTION_DAYS} 天的备份文件。"

# 若要保留前 N 天的备份（含今天），可用下面这种写法：
# ls -t ${BACKUP_DIR}/*.sql.gz 2>/dev/null | tail -n +$((RETENTION_DAYS + 1)) | xargs -r rm -f

log "========== 备份任务结束 =========="
echo "" >> "${LOG_FILE}"

exit 0