#ifndef SMART_BATCH_MANAGER_H_
#define SMART_BATCH_MANAGER_H_

#include "blocked_request_db.h"
#include <vector>
#include <mutex>
#include <thread>
#include <atomic>
#include <chrono>

// 智能批量管理器
// 实现数量触发 + 时间触发的双重机制
class SmartBatchManager {
public:
    // 配置参数
    struct Config {
        size_t batch_size = 10;              // 批量大小
        int flush_interval_minutes = 1;      // 刷新间隔（分钟）
        bool enable_immediate_flush = true;  // 是否启用立即刷新
        bool enable_timer_flush = true;      // 是否启用定时刷新
    };

    explicit SmartBatchManager(const std::string& db_path);
    ~SmartBatchManager();

    // 初始化管理器
    bool Initialize();

    // 添加拦截请求
    void AddRequest(const BlockedRequest& request);

    // 强制刷新缓冲区
    void FlushBatch();

    // 启动/停止服务
    void Start();
    void Stop();

    // 获取统计信息
    struct Stats {
        int64_t total_requests;           // 总请求数
        int64_t buffered_requests;        // 缓冲区中的请求数
        int64_t flushed_requests;         // 已刷新的请求数
        int64_t flush_operations;         // 刷新操作次数
        int64_t timer_flushes;            // 定时刷新次数
        int64_t size_flushes;             // 数量触发刷新次数
        int64_t last_flush_time;          // 最后刷新时间
        bool is_running;                  // 是否正在运行
    };
    Stats GetStats() const;

    // 设置配置
    void SetConfig(const Config& config);

    // 获取数据库实例
    BlockedRequestDB* GetDatabase() { return &db_; }

    // 等待所有数据刷新完成
    void WaitForFlushComplete();

private:
    // 定时刷新线程
    void TimerLoop();

    // 执行批量写入
    void ExecuteBatchWrite(const std::vector<BlockedRequest>& batch);

    // 更新统计信息
    void UpdateStats(bool is_timer_flush, size_t batch_size);

    // 成员变量
    BlockedRequestDB db_;
    std::string db_path_;
    Config config_;
    
    // 请求缓冲区
    std::vector<BlockedRequest> request_batch_;
    mutable std::mutex batch_mutex_;
    
    // 统计信息
    mutable std::mutex stats_mutex_;
    Stats stats_;
    
    // 控制线程
    std::thread timer_thread_;
    std::atomic<bool> running_{false};
    
    // 最后刷新时间
    std::chrono::steady_clock::time_point last_flush_time_;
};

#endif  // SMART_BATCH_MANAGER_H_
