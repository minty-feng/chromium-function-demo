#ifndef BLOCKED_REQUEST_DB_H_
#define BLOCKED_REQUEST_DB_H_

#include <string>
#include <vector>
#include <memory>
#include <sqlite3.h>

// 拦截请求的数据结构
struct BlockedRequest {
  int64_t id;                    // 主键ID
  std::string url;               // 被拦截的URL
  std::string host;              // 主机名
  std::string reason;            // 拦截原因
  int64_t timestamp;             // 拦截时间戳
  bool reported;                 // 是否已上报
  std::string browser_id;        // 标识店铺
  int64_t tab_id;                // 标签页ID
};

// SQLite数据库管理类
class BlockedRequestDB {
 public:
  BlockedRequestDB();
  ~BlockedRequestDB();

  // 初始化数据库
  bool Initialize(const std::string& db_path);
  
  // 关闭数据库
  void Close();

  // 添加拦截记录
  bool AddBlockedRequest(const BlockedRequest& request);
  
  // 批量添加拦截记录
  bool AddBlockedRequests(const std::vector<BlockedRequest>& requests);
  
  // 获取未上报的记录
  std::vector<BlockedRequest> GetUnreportedRequests(int limit = 100);
  
  // 获取所有记录
  std::vector<BlockedRequest> GetAllRequests(int limit = 1000);
  
  // 标记记录为已上报
  bool MarkAsReported(int64_t request_id, int status_code, const std::string& response);
  
  // 删除已上报的记录（可选，用于清理）
  bool DeleteReportedRequests(int days_old = 7);
  
  // 获取统计信息
  struct Statistics {
    int64_t total_requests;
    int64_t unreported_requests;
    int64_t reported_requests;
    int64_t failed_reports;
  };
  Statistics GetStatistics();

  // 检查数据库是否可用
  bool IsValid() const { return db_ != nullptr; }

 private:
  // 创建表结构
  bool CreateTables();
  
  // 准备SQL语句
  bool PrepareStatements();
  
  // 清理SQL语句
  void CleanupStatements();
  
  // 从查询结果构建BlockedRequest对象
  BlockedRequest BuildRequestFromRow(sqlite3_stmt* stmt);

  sqlite3* db_;
  sqlite3_stmt* insert_stmt_;
  sqlite3_stmt* select_unreported_stmt_;
  sqlite3_stmt* select_all_stmt_;
  sqlite3_stmt* update_reported_stmt_;
  sqlite3_stmt* delete_old_stmt_;
  sqlite3_stmt* count_stmt_;
  
  bool initialized_;
};

#endif  // BLOCKED_REQUEST_DB_H_
