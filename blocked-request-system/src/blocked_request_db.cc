#include "blocked_request_db.h"

#include <chrono>
#include <sstream>
#include <iomanip>

namespace {
const char kCreateTableSQL[] = R"(
  CREATE TABLE IF NOT EXISTS blocked_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    host TEXT NOT NULL,
    reason TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    reported INTEGER DEFAULT 0,
    browser_id TEXT DEFAULT '',
    tab_id INTEGER DEFAULT 0
  );
  
  CREATE INDEX IF NOT EXISTS idx_timestamp ON blocked_requests(timestamp);
  CREATE INDEX IF NOT EXISTS idx_reported ON blocked_requests(reported);
  CREATE INDEX IF NOT EXISTS idx_host ON blocked_requests(host);
  CREATE INDEX IF NOT EXISTS idx_browser_id ON blocked_requests(browser_id);
  CREATE INDEX IF NOT EXISTS idx_tab_id ON blocked_requests(tab_id);
)";

const char kInsertSQL[] = 
    "INSERT INTO blocked_requests (url, host, reason, timestamp, browser_id, tab_id) "
    "VALUES (?, ?, ?, ?, ?, ?)";

const char kSelectUnreportedSQL[] = 
    "SELECT id, url, host, reason, timestamp, reported, browser_id, tab_id "
    "FROM blocked_requests WHERE reported = 0 ORDER BY timestamp ASC LIMIT ?";

const char kSelectAllSQL[] = 
    "SELECT id, url, host, reason, timestamp, reported, browser_id, tab_id "
    "FROM blocked_requests ORDER BY timestamp DESC LIMIT ?";

const char kUpdateReportedSQL[] = 
    "UPDATE blocked_requests SET reported = 1 WHERE id = ?";

const char kDeleteOldSQL[] = 
    "DELETE FROM blocked_requests WHERE reported = 1 AND timestamp < ?";

const char kCountSQL[] = 
    "SELECT COUNT(*), SUM(CASE WHEN reported = 0 THEN 1 ELSE 0 END), "
    "SUM(CASE WHEN reported = 1 THEN 1 ELSE 0 END), 0 "
    "FROM blocked_requests";
}

BlockedRequestDB::BlockedRequestDB()
    : db_(nullptr),
      insert_stmt_(nullptr),
      select_unreported_stmt_(nullptr),
      select_all_stmt_(nullptr),
      update_reported_stmt_(nullptr),
      delete_old_stmt_(nullptr),
      count_stmt_(nullptr),
      initialized_(false) {
}

BlockedRequestDB::~BlockedRequestDB() {
  Close();
}

bool BlockedRequestDB::Initialize(const std::string& db_path) {
  if (initialized_) {
    return true;
  }

  // 打开数据库
  int result = sqlite3_open_v2(db_path.c_str(), &db_,
                               SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE,
                               nullptr);
  if (result != SQLITE_OK) {
    return false;
  }

  // 启用WAL模式以提高并发性能
  sqlite3_exec(db_, "PRAGMA journal_mode=WAL;", nullptr, nullptr, nullptr);
  
  // 设置超时和锁模式
  sqlite3_exec(db_, "PRAGMA busy_timeout=5000;", nullptr, nullptr, nullptr);
  sqlite3_exec(db_, "PRAGMA synchronous=NORMAL;", nullptr, nullptr, nullptr);

  // 创建表
  if (!CreateTables()) {
    Close();
    return false;
  }

  // 准备SQL语句
  if (!PrepareStatements()) {
    Close();
    return false;
  }

  initialized_ = true;
  return true;
}

void BlockedRequestDB::Close() {
  if (!initialized_) {
    return;
  }

  CleanupStatements();
  
  if (db_) {
    sqlite3_close(db_);
    db_ = nullptr;
  }
  
  initialized_ = false;
}

bool BlockedRequestDB::CreateTables() {
  char* error_msg = nullptr;
  int result = sqlite3_exec(db_, kCreateTableSQL, nullptr, nullptr, &error_msg);
  
  if (result != SQLITE_OK) {
    if (error_msg) {
      sqlite3_free(error_msg);
    }
    return false;
  }
  
  return true;
}

bool BlockedRequestDB::PrepareStatements() {
  // 准备插入语句
  if (sqlite3_prepare_v2(db_, kInsertSQL, -1, &insert_stmt_, nullptr) != SQLITE_OK) {
    return false;
  }

  // 准备查询未上报记录的语句
  if (sqlite3_prepare_v2(db_, kSelectUnreportedSQL, -1, &select_unreported_stmt_, nullptr) != SQLITE_OK) {
    return false;
  }

  // 准备查询所有记录的语句
  if (sqlite3_prepare_v2(db_, kSelectAllSQL, -1, &select_all_stmt_, nullptr) != SQLITE_OK) {
    return false;
  }

  // 准备更新上报状态的语句
  if (sqlite3_prepare_v2(db_, kUpdateReportedSQL, -1, &update_reported_stmt_, nullptr) != SQLITE_OK) {
    return false;
  }

  // 准备删除旧记录的语句
  if (sqlite3_prepare_v2(db_, kDeleteOldSQL, -1, &delete_old_stmt_, nullptr) != SQLITE_OK) {
    return false;
  }

  // 准备统计查询语句
  if (sqlite3_prepare_v2(db_, kCountSQL, -1, &count_stmt_, nullptr) != SQLITE_OK) {
    return false;
  }

  return true;
}

void BlockedRequestDB::CleanupStatements() {
  if (insert_stmt_) {
    sqlite3_finalize(insert_stmt_);
    insert_stmt_ = nullptr;
  }
  if (select_unreported_stmt_) {
    sqlite3_finalize(select_unreported_stmt_);
    select_unreported_stmt_ = nullptr;
  }
  if (select_all_stmt_) {
    sqlite3_finalize(select_all_stmt_);
    select_all_stmt_ = nullptr;
  }
  if (update_reported_stmt_) {
    sqlite3_finalize(update_reported_stmt_);
    update_reported_stmt_ = nullptr;
  }
  if (delete_old_stmt_) {
    sqlite3_finalize(delete_old_stmt_);
    delete_old_stmt_ = nullptr;
  }
  if (count_stmt_) {
    sqlite3_finalize(count_stmt_);
    count_stmt_ = nullptr;
  }
}

bool BlockedRequestDB::AddBlockedRequest(const BlockedRequest& request) {
  if (!initialized_ || !insert_stmt_) {
    return false;
  }

  // 重置语句
  sqlite3_reset(insert_stmt_);
  
  // 绑定参数
  int param_index = 1;
  sqlite3_bind_text(insert_stmt_, param_index++, request.url.c_str(), -1, SQLITE_STATIC);
  sqlite3_bind_text(insert_stmt_, param_index++, request.host.c_str(), -1, SQLITE_STATIC);
  sqlite3_bind_text(insert_stmt_, param_index++, request.reason.c_str(), -1, SQLITE_STATIC);
  sqlite3_bind_int64(insert_stmt_, param_index++, request.timestamp);
  sqlite3_bind_text(insert_stmt_, param_index++, request.browser_id.c_str(), -1, SQLITE_STATIC);
  sqlite3_bind_int64(insert_stmt_, param_index++, request.tab_id);

  // 执行插入
  int result = sqlite3_step(insert_stmt_);
  return result == SQLITE_DONE;
}

bool BlockedRequestDB::AddBlockedRequests(const std::vector<BlockedRequest>& requests) {
  if (!initialized_ || requests.empty()) {
    return false;
  }

  // 开始事务
  if (sqlite3_exec(db_, "BEGIN TRANSACTION", nullptr, nullptr, nullptr) != SQLITE_OK) {
    return false;
  }

  bool success = true;
  for (const auto& request : requests) {
    if (!AddBlockedRequest(request)) {
      success = false;
      break;
    }
  }

  // 提交或回滚事务
  if (success) {
    sqlite3_exec(db_, "COMMIT", nullptr, nullptr, nullptr);
  } else {
    sqlite3_exec(db_, "ROLLBACK", nullptr, nullptr, nullptr);
  }

  return success;
}

std::vector<BlockedRequest> BlockedRequestDB::GetUnreportedRequests(int limit) {
  std::vector<BlockedRequest> requests;
  
  if (!initialized_ || !select_unreported_stmt_) {
    return requests;
  }

  // 重置语句
  sqlite3_reset(select_unreported_stmt_);
  
  // 绑定limit参数
  sqlite3_bind_int(select_unreported_stmt_, 1, limit);

  // 执行查询
  while (sqlite3_step(select_unreported_stmt_) == SQLITE_ROW) {
    requests.push_back(BuildRequestFromRow(select_unreported_stmt_));
  }

  return requests;
}

std::vector<BlockedRequest> BlockedRequestDB::GetAllRequests(int limit) {
  std::vector<BlockedRequest> requests;
  
  if (!initialized_ || !select_all_stmt_) {
    return requests;
  }

  // 重置语句
  sqlite3_reset(select_all_stmt_);
  
  // 重置语句
  sqlite3_reset(select_all_stmt_);
  
  // 绑定limit参数
  sqlite3_bind_int(select_all_stmt_, 1, limit);

  // 执行查询
  while (sqlite3_step(select_all_stmt_) == SQLITE_ROW) {
    requests.push_back(BuildRequestFromRow(select_all_stmt_));
  }

  return requests;
}

bool BlockedRequestDB::MarkAsReported(int64_t request_id, int status_code, 
                                     const std::string& response) {
  if (!initialized_ || !update_reported_stmt_) {
    return false;
  }

  // 标记参数为已使用，避免编译器警告
  (void)status_code;
  (void)response;

  // 重置语句
  sqlite3_reset(update_reported_stmt_);
  
  // 绑定参数
  int param_index = 1;
  sqlite3_bind_int64(update_reported_stmt_, param_index++, request_id);

  // 执行更新
  int result = sqlite3_step(update_reported_stmt_);
  return result == SQLITE_DONE;
}

bool BlockedRequestDB::DeleteReportedRequests(int days_old) {
  if (!initialized_ || !delete_old_stmt_) {
    return false;
  }

  // 计算时间戳
  auto cutoff_time = std::chrono::duration_cast<std::chrono::milliseconds>(
      std::chrono::system_clock::now().time_since_epoch()).count() - 
      (days_old * 24 * 60 * 60 * 1000LL);

  // 重置语句
  sqlite3_reset(delete_old_stmt_);
  
  // 绑定参数
  sqlite3_bind_int64(delete_old_stmt_, 1, cutoff_time);

  // 执行删除
  int result = sqlite3_step(delete_old_stmt_);
  return result == SQLITE_DONE;
}

BlockedRequestDB::Statistics BlockedRequestDB::GetStatistics() {
  Statistics stats = {0, 0, 0, 0};
  
  if (!initialized_ || !count_stmt_) {
    return stats;
  }

  // 重置语句
  sqlite3_reset(count_stmt_);

  // 执行查询
  if (sqlite3_step(count_stmt_) == SQLITE_ROW) {
    stats.total_requests = sqlite3_column_int64(count_stmt_, 0);
    stats.unreported_requests = sqlite3_column_int64(count_stmt_, 1);
    stats.reported_requests = sqlite3_column_int64(count_stmt_, 2);
    stats.failed_reports = sqlite3_column_int64(count_stmt_, 3);
  }

  return stats;
}

BlockedRequest BlockedRequestDB::BuildRequestFromRow(sqlite3_stmt* stmt) {
  BlockedRequest request;
  
  request.id = sqlite3_column_int64(stmt, 0);
  request.url = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
  request.host = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
  request.reason = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
  request.timestamp = sqlite3_column_int64(stmt, 4);
  request.reported = sqlite3_column_int(stmt, 5) != 0;
  request.browser_id = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 6));
  request.tab_id = sqlite3_column_int64(stmt, 7);
  
  return request;
}
