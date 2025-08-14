#pragma once
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// 检查IP是否为中国IP，db_path为GeoIP2数据库路径
bool is_china_ip(const char* ip, const char* db_path);

#ifdef __cplusplus
}
#endif
