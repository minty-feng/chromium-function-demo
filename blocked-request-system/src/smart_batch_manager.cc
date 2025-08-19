#include "smart_batch_manager.h"
#include <iostream>

SmartBatchManager::SmartBatchManager(const std::string& db_path)
    : db_path_(db_path) {
    stats_ = {0, 0, 0, 0, 0, 0, 0, false};
    last_flush_time_ = std::chrono::steady_clock::now();
}

SmartBatchManager::~SmartBatchManager() {
    Stop();
}

bool SmartBatchManager::Initialize() {
    return db_.Initialize(db_path_);
}

void SmartBatchManager::AddRequest(const BlockedRequest& request) {
    {
        std::lock_guard<std::mutex> lock(stats_mutex_);
        stats_.total_requests++;
    }
    
    {
        std::lock_guard<std::mutex> lock(batch_mutex_);
        request_batch_.push_back(request);
        stats_.buffered_requests = request_batch_.size();
        FlushBatch();

        if (config_.enable_immediate_flush && 
            request_batch_.size() >= config_.batch_size) {
            FlushBatch();
        }
    }
}

void SmartBatchManager::FlushBatch() {
    std::vector<BlockedRequest> batch;
    
    {
        std::lock_guard<std::mutex> lock(batch_mutex_);
        if (request_batch_.empty()) return;
        
        batch.swap(request_batch_);
        stats_.buffered_requests = 0;
    }
    
    if (!batch.empty()) {
        ExecuteBatchWrite(batch);
    }
}

void SmartBatchManager::ExecuteBatchWrite(const std::vector<BlockedRequest>& batch) {
    bool success = db_.AddBlockedRequests(batch);
    
    if (success) {
        std::cout << "批量写入成功: " << batch.size() << " 条记录" << std::endl;
    } else {
        std::cerr << "批量写入失败: " << batch.size() << " 条记录" << std::endl;
    }
    
    last_flush_time_ = std::chrono::steady_clock::now();
}

void SmartBatchManager::UpdateStats(bool is_timer_flush, size_t batch_size) {
    std::lock_guard<std::mutex> lock(stats_mutex_);
    
    stats_.flushed_requests += batch_size;
    stats_.flush_operations++;
    stats_.last_flush_time = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()).count();
    
    if (is_timer_flush) {
        stats_.timer_flushes++;
    } else {
        stats_.size_flushes++;
    }
}

SmartBatchManager::Stats SmartBatchManager::GetStats() const {
    std::lock_guard<std::mutex> lock(stats_mutex_);
    return stats_;
}

void SmartBatchManager::SetConfig(const Config& config) {
    config_ = config;
}

void SmartBatchManager::Start() {
    if (running_.load()) return;
    
    running_.store(true);
    stats_.is_running = true;
    
    if (config_.enable_timer_flush) {
        timer_thread_ = std::thread(&SmartBatchManager::TimerLoop, this);
    }
    
    std::cout << "智能批量管理器已启动" << std::endl;
}

void SmartBatchManager::Stop() {
    if (!running_.load()) return;
    
    running_.store(false);
    stats_.is_running = false;
    
    if (timer_thread_.joinable()) {
        timer_thread_.join();
    }
    
    FlushBatch();
    std::cout << "智能批量管理器已停止" << std::endl;
}

void SmartBatchManager::TimerLoop() {
    while (running_.load()) {
        std::this_thread::sleep_for(std::chrono::minutes(config_.flush_interval_minutes));
        
        if (running_.load()) {
            FlushBatch();
            
            {
                std::lock_guard<std::mutex> lock(batch_mutex_);
                if (!request_batch_.empty()) {
                    UpdateStats(true, request_batch_.size());
                }
            }
        }
    }
}

void SmartBatchManager::WaitForFlushComplete() {
    while (true) {
        {
            std::lock_guard<std::mutex> lock(batch_mutex_);
            if (request_batch_.empty()) break;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}
