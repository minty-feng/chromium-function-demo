#include "ip_checker.h"
#include <stddef.h>
#include "maxminddb.h"
#include <string.h>
#include <stdio.h>

bool is_china_ip(const char* ip, const char* db_path) {
    MMDB_s mmdb;
    int status = MMDB_open(db_path, MMDB_MODE_MMAP, &mmdb);
    if (status != MMDB_SUCCESS) {
        fprintf(stderr, "Failed to open MMDB: %s\n", MMDB_strerror(status));
        return false;
    }
    int gai_error = 0, mmdb_error = 0;
    MMDB_lookup_result_s result = MMDB_lookup_string(&mmdb, ip, &gai_error, &mmdb_error);
    if (gai_error || mmdb_error || !result.found_entry) {
        MMDB_close(&mmdb);
        return false;
    }
    MMDB_entry_data_s entry_data;
    int ret = MMDB_get_value(&result.entry, &entry_data, "country", "iso_code", NULL);
    if (ret == MMDB_SUCCESS && entry_data.has_data && entry_data.type == MMDB_DATA_TYPE_UTF8_STRING) {
        if (entry_data.data_size == 2 && strncmp(entry_data.utf8_string, "CN", 2) == 0) {
            MMDB_close(&mmdb);
            return true;
        }
    }
    MMDB_close(&mmdb);
    return false;
}
