#include "ip_checker.h"
#include <stdio.h>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        printf("Usage: %s <ip> <mmdb_path>\n", argv[0]);
        return 1;
    }
    const char* ip = argv[1];
    const char* db_path = argv[2];
    if (is_china_ip(ip, db_path)) {
        printf("%s is a China IP.\n", ip);
    } else {
        printf("%s is NOT a China IP.\n", ip);
    }
    return 0;
}
