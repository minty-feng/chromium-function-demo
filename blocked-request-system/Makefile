# Makefile for Blocked Request System
# 双重触发机制核心代码

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
INCLUDES = -Isrc
LIBS = -lsqlite3 -lpthread

# 目标文件
TARGETS = test/simulate_browser test/reader_program test/create_test_data

# 库文件
LIBRARIES = libblocked_request_db.a libsmart_batch_manager.a

# 默认目标
all: $(TARGETS)

# 库文件
libblocked_request_db.a: src/blocked_request_db.o
	ar rcs $@ $^

libsmart_batch_manager.a: src/smart_batch_manager.o
	ar rcs $@ $^

# 可执行文件
test/simulate_browser: test/simulate_browser.o libblocked_request_db.a libsmart_batch_manager.a
	$(CXX) $^ -o $@ $(LIBS)

test/reader_program: test/reader_program.o libblocked_request_db.a
	$(CXX) $^ -o $@ $(LIBS)

test/create_test_data: test/create_test_data.o libblocked_request_db.a
	$(CXX) $^ -o $@ $(LIBS)

# 编译源文件
src/%.o: src/%.cpp
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

test/%.o: test/%.cpp
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# 清理
clean:
	rm -f *.o *.a *.db
	rm -f src/*.o test/*.o
	rm -f $(TARGETS)

# 安装依赖（Ubuntu/Debian）
install-deps-ubuntu:
	sudo apt-get update
	sudo apt-get install -y libsqlite3-dev build-essential

# 安装依赖（CentOS/RHEL）
install-deps-centos:
	sudo yum install -y sqlite-devel gcc-c++ make

# 安装依赖（macOS）
install-deps-macos:
	brew install sqlite3

# 测试
test: $(TARGETS)
	@echo "编译完成！可以运行以下程序："
	@echo "  ./test/simulate_browser  - 浏览器模拟器"
	@echo "  ./test/reader_program    - 数据库读取器"
	@echo "  ./test/create_test_data  - 测试数据生成器"
	@echo "  ./test/test_database.sh  - 数据库测试脚本"

# 帮助
help:
	@echo "可用的目标:"
	@echo "  all                - 编译整个项目"
	@echo "  clean              - 清理编译文件"
	@echo "  install-deps-ubuntu  - 安装Ubuntu/Debian依赖"
	@echo "  install-deps-centos  - 安装CentOS/RHEL依赖"
	@echo "  install-deps-macos   - 安装macOS依赖"
	@echo "  test               - 显示使用说明"
	@echo "  help               - 显示此帮助信息"

.PHONY: all clean install-deps-ubuntu install-deps-centos install-deps-macos test help
