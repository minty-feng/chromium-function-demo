#include "smart_batch_manager.h"
#include <iostream>
#include <chrono>
#include <thread>
#include <random>
#include <vector>
#include <iomanip>

// 模拟浏览器拦截程序
// 随机生成拦截请求，测试双重触发机制

class BrowserSimulator {
private:
    SmartBatchManager manager_;
    std::atomic<bool> running_{false};
    std::thread simulation_thread_;
    
    // 模拟数据
    std::vector<std::string> test_hosts_ = {
        "ads.example.com", "analytics.example.com", "tracking.example.com",
        "pixel.example.com", "beacon.example.com", "collector.example.com",
        "spy.example.com", "monitor.example.com", "logger.example.com"
    };
    
    std::vector<std::string> test_paths_ = {
        "/track", "/collect", "/pixel", "/beacon", "/log", "/analytics",
        "/monitor", "/spy", "/collector", "/logger"
    };
    
    std::vector<std::string> test_reasons_ = {
        "广告追踪", "分析收集", "用户行为", "性能监控", "安全检测",
        "内容推荐", "个性化", "统计信息", "调试日志"
    };

public:
    BrowserSimulator(const std::string& db_path) : manager_(db_path) {}
    
    ~BrowserSimulator() {
        Stop();
    }
    
    bool Initialize() {
        if (!manager_.Initialize()) {
            std::cerr << "管理器初始化失败" << std::endl;
            return false;
        }
        
        // 配置参数
        SmartBatchManager::Config config;
        config.batch_size = 10;              // 10条触发刷新
        config.flush_interval_minutes = 1;   // 1分钟定时刷新
        config.enable_immediate_flush = true;
        config.enable_timer_flush = true;
        
        manager_.SetConfig(config);
        return true;
    }
    
    void Start() {
        if (running_.load()) return;
        
        running_.store(true);
        
        // 启动管理器
        manager_.Start();
        
        // 启动模拟线程
        simulation_thread_ = std::thread(&BrowserSimulator::SimulationLoop, this);
        
        std::cout << "浏览器模拟器已启动" << std::endl;
    }
    
    void Stop() {
        if (!running_.load()) return;
        
        running_.store(false);
        
        // 等待模拟线程结束
        if (simulation_thread_.joinable()) {
            simulation_thread_.join();
        }
        
        // 停止管理器
        manager_.Stop();
        
        std::cout << "浏览器模拟器已停止" << std::endl;
    }
    
    void PrintStats() {
        auto stats = manager_.GetStats();
        
        std::cout << "\n=== 浏览器模拟器统计 ===" << std::endl;
        std::cout << "总请求数: " << stats.total_requests << std::endl;
        std::cout << "缓冲区请求: " << stats.buffered_requests << std::endl;
        std::cout << "已刷新请求: " << stats.flushed_requests << std::endl;
        std::cout << "刷新操作数: " << stats.flush_operations << std::endl;
        std::cout << "定时刷新数: " << stats.timer_flushes << std::endl;
        std::cout << "数量触发刷新: " << stats.size_flushes << std::endl;
        std::cout << "最后刷新时间: " << stats.last_flush_time << std::endl;
        std::cout << "运行状态: " << (stats.is_running ? "运行中" : "已停止") << std::endl;
    }

private:
    void SimulationLoop() {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> delay_dist(100, 2000);  // 100ms-2s随机延迟
        std::uniform_int_distribution<> host_dist(0, test_hosts_.size() - 1);
        std::uniform_int_distribution<> path_dist(0, test_paths_.size() - 1);
        std::uniform_int_distribution<> reason_dist(0, test_reasons_.size() - 1);
        
        int request_count = 0;
        
        while (running_.load()) {
            // 生成随机拦截请求
            BlockedRequest request = GenerateRandomRequest(request_count++);
            
            // 添加到管理器
            manager_.AddRequest(request);
            
            // 打印请求信息
            PrintRequest(request);
            
            // 随机延迟
            int delay = delay_dist(gen);
            std::this_thread::sleep_for(std::chrono::milliseconds(delay));
        }
    }
    
    BlockedRequest GenerateRandomRequest(int id) {
        BlockedRequest request;
        request.id = id;  // 使用id参数，避免编译器警告
        
        // 随机选择测试数据
        static std::random_device rd;
        static std::mt19937 gen(rd());
        static std::uniform_int_distribution<> host_dist(0, test_hosts_.size() - 1);
        static std::uniform_int_distribution<> path_dist(0, test_paths_.size() - 1);
        static std::uniform_int_distribution<> reason_dist(0, test_reasons_.size() - 1);
        
        int host_idx = host_dist(gen);
        int path_idx = path_dist(gen);
        int reason_idx = reason_dist(gen);
        
        request.host = test_hosts_[host_idx];
        request.url = "https://" + test_hosts_[host_idx] + test_paths_[path_idx];
        request.reason = test_reasons_[reason_idx];
        request.timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
        request.reported = false;
        
        return request;
    }
    
    void PrintRequest(const BlockedRequest& request) {
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time_t);
        
        std::cout << std::put_time(&tm, "%H:%M:%S") 
                  << " 拦截请求: " << request.host 
                  << " (" << request.reason << ")" << std::endl;
    }
};

int main() {
    std::cout << "浏览器拦截模拟器" << std::endl;
    std::cout << "==================" << std::endl;
    
    BrowserSimulator simulator("blocked_requests.db");
    
    if (!simulator.Initialize()) {
        std::cerr << "初始化失败" << std::endl;
        return 1;
    }
    
    // 启动模拟器
    simulator.Start();
    
    // 运行一段时间
    std::cout << "模拟器运行中... 按Enter键停止" << std::endl;
    std::cin.get();
    
    // 停止模拟器
    simulator.Stop();
    
    // 打印最终统计
    simulator.PrintStats();
    
    std::cout << "\n模拟完成!" << std::endl;
    return 0;
}
