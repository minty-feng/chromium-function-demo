#include "blocked_request_db.h"
#include <iostream>
#include <vector>
#include <chrono>
#include <random>

int main() {
    std::cout << "创建测试数据..." << std::endl;
    
    BlockedRequestDB db;
    if (!db.Initialize("test_blocked_requests.db")) {
        std::cerr << "初始化数据库失败" << std::endl;
        return 1;
    }
    
    // 测试数据
    std::vector<std::string> test_hosts = {
        "example.com",
        "malware-site.com", 
        "phishing-attempt.net",
        "ads.doubleclick.net",
        "tracker.google.com",
        "analytics.facebook.com",
        "spam-site.org",
        "fake-news.info",
        "scam-website.com",
        "malicious-content.biz"
    };
    
    std::vector<std::string> test_paths = {
        "/malware.exe",
        "/phishing-form.html",
        "/ads/banner.jpg",
        "/tracking-pixel.gif",
        "/spam-content.html",
        "/fake-article.html",
        "/scam-offer.html",
        "/malicious-script.js",
        "/suspicious-download.zip",
        "/tracking-cookie.txt"
    };
    
    std::vector<std::string> test_reasons = {
        "恶意软件",
        "钓鱼网站",
        "广告追踪",
        "隐私侵犯",
        "垃圾内容",
        "虚假信息",
        "诈骗网站",
        "恶意脚本",
        "可疑下载",
        "追踪Cookie"
    };
    
    // 生成测试数据
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> host_dist(0, test_hosts.size() - 1);
    std::uniform_int_distribution<> path_dist(0, test_paths.size() - 1);
    std::uniform_int_distribution<> reason_dist(0, test_reasons.size() - 1);
    std::uniform_int_distribution<> browser_dist(0, 4);  // 模拟5个不同的浏览器
    std::uniform_int_distribution<> tab_dist(1, 20);     // 模拟每个浏览器最多20个标签页
    
    // 浏览器标识列表
    std::vector<std::string> test_browsers = {
        "Chrome/120.0.0.0",
        "Firefox/121.0",
        "Safari/17.2",
        "Edge/120.0.0.0",
        "Opera/104.0"
    };
    
    // 创建100条测试记录
    std::vector<BlockedRequest> requests;
    auto base_time = std::chrono::system_clock::now();
    
    for (int i = 0; i < 100; ++i) {
        BlockedRequest request;
        request.id = 0; // 数据库会自动分配ID
        
        int host_idx = host_dist(gen);
        int path_idx = path_dist(gen);
        int reason_idx = reason_dist(gen);
        int browser_idx = browser_dist(gen);
        
        request.host = test_hosts[host_idx];
        request.url = "https://" + test_hosts[host_idx] + test_paths[path_idx];
        request.reason = test_reasons[reason_idx];
        request.browser_id = test_browsers[browser_idx];
        request.tab_id = tab_dist(gen);
        
        // 时间戳：过去24小时内的随机时间
        auto random_offset = std::chrono::hours(gen() % 24) + 
                           std::chrono::minutes(gen() % 60) + 
                           std::chrono::seconds(gen() % 60);
        request.timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
            (base_time - random_offset).time_since_epoch()).count();
        
        // 随机设置一些记录为已上报
        request.reported = (gen() % 4 == 0); // 25%的记录标记为已上报
        
        requests.push_back(request);
    }
    
    // 批量添加到数据库
    if (db.AddBlockedRequests(requests)) {
        std::cout << "成功创建 " << requests.size() << " 条测试记录" << std::endl;
    } else {
        std::cerr << "创建测试数据失败" << std::endl;
        return 1;
    }
    
    // 显示统计信息
    auto stats = db.GetStatistics();
    std::cout << "\n数据库统计信息:" << std::endl;
    std::cout << "总记录数: " << stats.total_requests << std::endl;
    std::cout << "未上报记录: " << stats.unreported_requests << std::endl;
    std::cout << "已上报记录: " << stats.reported_requests << std::endl;
    
    std::cout << "\n测试数据创建完成！" << std::endl;
    std::cout << "数据库文件: test_blocked_requests.db" << std::endl;
    
    return 0;
}
