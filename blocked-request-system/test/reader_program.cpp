#include "blocked_request_db.h"
#include <iostream>
#include <chrono>
#include <thread>
#include <iomanip>
#include <vector>
#include <atomic>
#include <random>

// 定时读取程序
// 模拟外部程序定期扫描数据库，读取未上报的记录

class DatabaseReader {
private:
    BlockedRequestDB db_;
    std::atomic<bool> running_{false};
    std::thread reader_thread_;
    
    // 配置参数
    int scan_interval_seconds_;
    int batch_size_;
    std::string db_path_;

public:
    DatabaseReader(const std::string& db_path, int scan_interval = 60, int batch_size = 100)
        : scan_interval_seconds_(scan_interval), batch_size_(batch_size), db_path_(db_path) {}
    
    ~DatabaseReader() {
        Stop();
    }
    
    bool Initialize() {
        if (!db_.Initialize(db_path_)) {
            std::cerr << "数据库初始化失败" << std::endl;
            return false;
        }
        
        std::cout << "数据库读取器初始化成功" << std::endl;
        std::cout << "扫描间隔: " << scan_interval_seconds_ << " 秒" << std::endl;
        std::cout << "批量大小: " << batch_size_ << " 条记录" << std::endl;
        
        return true;
    }
    
    void Start() {
        if (running_.load()) return;
        
        running_.store(true);
        reader_thread_ = std::thread(&DatabaseReader::ReaderLoop, this);
        
        std::cout << "数据库读取器已启动" << std::endl;
    }
    
    void Stop() {
        if (!running_.load()) return;
        
        running_.store(false);
        
        if (reader_thread_.joinable()) {
            reader_thread_.join();
        }
        
        std::cout << "数据库读取器已停止" << std::endl;
    }
    
    void PrintStats() {
        auto stats = db_.GetStatistics();
        
        std::cout << "\n=== 数据库统计 ===" << std::endl;
        std::cout << "总记录数: " << stats.total_requests << std::endl;
        std::cout << "未上报记录: " << stats.unreported_requests << std::endl;
        std::cout << "已上报记录: " << stats.reported_requests << std::endl;
        std::cout << "上报失败: " << stats.failed_reports << std::endl;
    }

private:
    void ReaderLoop() {
        while (running_.load()) {
            // 扫描数据库
            ScanDatabase();
            
            // 等待下次扫描
            for (int i = 0; i < scan_interval_seconds_ && running_.load(); ++i) {
                std::this_thread::sleep_for(std::chrono::seconds(1));
            }
        }
    }
    
    void ScanDatabase() {
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        auto tm = *std::localtime(&time_t);
        
        std::cout << std::put_time(&tm, "%H:%M:%S") << " 开始扫描数据库..." << std::endl;
        
        // 获取未上报的记录
        auto unreported_requests = db_.GetUnreportedRequests(batch_size_);
        
        if (unreported_requests.empty()) {
            std::cout << "  没有未上报的记录" << std::endl;
            return;
        }
        
        std::cout << "  发现 " << unreported_requests.size() << " 条未上报记录" << std::endl;
        
        // 模拟上报过程
        ProcessUnreportedRequests(unreported_requests);
        
        // 打印统计
        PrintStats();
    }
    
    void ProcessUnreportedRequests(const std::vector<BlockedRequest>& requests) {
        std::cout << "  开始处理未上报记录..." << std::endl;
        
        for (const auto& request : requests) {
            // 模拟上报到服务器
            bool report_success = SimulateReport(request);
            
            if (report_success) {
                // 标记为已上报
                if (db_.MarkAsReported(request.id, 200, "上报成功")) {
                    std::cout << "    ✓ 记录 " << request.id << " 上报成功: " 
                              << request.host << std::endl;
                } else {
                    std::cout << "    ✗ 记录 " << request.id << " 状态更新失败" << std::endl;
                }
            } else {
                // 模拟上报失败
                if (db_.MarkAsReported(request.id, 500, "上报失败")) {
                    std::cout << "    ✗ 记录 " << request.id << " 上报失败: " 
                              << request.host << std::endl;
                }
            }
            
            // 模拟网络延迟
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
        
        std::cout << "  处理完成" << std::endl;
    }
    
    bool SimulateReport(const BlockedRequest& request) {
        // 模拟上报成功率90%
        static std::random_device rd;
        static std::mt19937 gen(rd());
        static std::uniform_real_distribution<> dis(0.0, 1.0);
        
        bool success = dis(gen) < 0.9;
        
        // 模拟网络延迟
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
        
        // 使用request参数避免警告（可以用于日志记录）
        (void)request;  // 标记为已使用
        
        return success;
    }
};

int main(int argc, char* argv[]) {
    std::cout << "数据库定时读取程序" << std::endl;
    std::cout << "==================" << std::endl;
    
    // 配置参数
    int scan_interval = 60;  // 默认60秒扫描一次
    int batch_size = 100;    // 默认每次处理100条记录
    
    // 解析命令行参数
    if (argc >= 2) {
        scan_interval = std::atoi(argv[1]);
    }
    if (argc >= 3) {
        batch_size = std::atoi(argv[2]);
    }
    
    std::cout << "配置参数:" << std::endl;
    std::cout << "扫描间隔: " << scan_interval << " 秒" << std::endl;
    std::cout << "批量大小: " << batch_size << " 条记录" << std::endl;
    std::cout << std::endl;
    
    DatabaseReader reader("blocked_requests.db", scan_interval, batch_size);
    
    if (!reader.Initialize()) {
        std::cerr << "初始化失败" << std::endl;
        return 1;
    }
    
    // 启动读取器
    reader.Start();
    
    // 运行一段时间
    std::cout << "读取器运行中... 按Enter键停止" << std::endl;
    std::cin.get();
    
    // 停止读取器
    reader.Stop();
    
    // 打印最终统计
    reader.PrintStats();
    
    std::cout << "\n程序运行完成!" << std::endl;
    return 0;
}
