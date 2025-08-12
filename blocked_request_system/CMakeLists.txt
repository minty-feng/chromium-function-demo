cmake_minimum_required(VERSION 3.10)
project(BlockedRequestSystem)

# 设置C++标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 查找依赖包
find_package(Threads REQUIRED)

# 查找SQLite3
find_package(SQLite3 REQUIRED)

# 设置编译选项
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# 包含目录
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/src)

# 创建库文件
add_library(blocked_request_db STATIC
    src/blocked_request_db.cc
)

add_library(smart_batch_manager STATIC
    src/smart_batch_manager.cc
)

# 链接依赖库
target_link_libraries(blocked_request_db
    SQLite::SQLite3
)

target_link_libraries(smart_batch_manager
    blocked_request_db
    Threads::Threads
)

# 创建可执行程序
add_executable(simulate_browser
    test/simulate_browser.cpp
)

add_executable(reader_program
    test/reader_program.cpp
)

add_executable(create_test_data
    test/create_test_data.cpp
)

# 链接库
target_link_libraries(simulate_browser
    smart_batch_manager
)

target_link_libraries(reader_program
    blocked_request_db
)

target_link_libraries(create_test_data
    blocked_request_db
)

# 安装规则
install(TARGETS blocked_request_db smart_batch_manager simulate_browser reader_program create_test_data
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
)

install(FILES 
    src/blocked_request_db.h
    src/smart_batch_manager.h
    DESTINATION include/blocked_request_system
)

# 设置输出目录
set_target_properties(simulate_browser reader_program PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)

# 打印配置信息
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ compiler: ${CMAKE_CXX_COMPILER}")
message(STATUS "SQLite3 found: ${SQLite3_FOUND}")
