# Git 高级操作技巧完全指南

## 引言
本文档介绍 Git 的高级操作技巧，包括历史重写、暂存区操作、子模块管理、工作流优化等实用技能，帮助开发者更高效地使用 Git。

## 历史重写技巧

### 1. 交互式变基 (Interactive Rebase)

#### 1.1 基本用法
```bash
# 交互式变基最近 3 个提交
git rebase -i HEAD~3

# 交互式变基到指定提交
git rebase -i <commit-hash>
```

#### 1.2 常用操作
```bash
# 在编辑器中会显示：
pick f7f3f6d Change feature A
pick 310154e Fix bug in feature A
pick a5f4a0d Add feature B

# 可用的操作：
# pick   - 使用提交
# reword - 使用提交，但编辑提交信息
# edit   - 使用提交，但停下来修改
# squash - 使用提交，但合并到前一个提交
# fixup  - 使用提交，但丢弃提交信息
# drop   - 删除提交
```

#### 1.3 实际应用场景
```bash
# 场景1: 合并多个小提交
git rebase -i HEAD~5
# 将后面的提交改为 squash 或 fixup

# 场景2: 修改提交信息
git rebase -i HEAD~3
# 将需要修改的提交改为 reword

# 场景3: 在提交之间插入新提交
git rebase -i HEAD~3
# 将某个提交改为 edit，然后添加新文件
```

### 2. 提交历史清理

#### 2.1 删除敏感信息
```bash
# 从整个历史中删除文件
git filter-branch --tree-filter 'rm -f passwords.txt' HEAD

# 使用 BFG Repo-Cleaner (推荐)
bfg --delete-files passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### 2.2 重写提交作者信息
```bash
# 修改最近一次提交的作者
git commit --amend --author="New Author <new@email.com>"

# 批量修改作者信息
git filter-branch --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "old@email.com" ]
then
    export GIT_AUTHOR_NAME="New Name"
    export GIT_AUTHOR_EMAIL="new@email.com"
fi
' HEAD
```

### 3. 提交分割与合并

#### 3.1 分割提交
```bash
# 1. 开始交互式变基
git rebase -i HEAD~3

# 2. 将需要分割的提交改为 edit
# 3. 重置到该提交
git reset HEAD^

# 4. 分阶段添加文件并提交
git add file1.js
git commit -m "Add feature A part 1"
git add file2.js
git commit -m "Add feature A part 2"

# 5. 继续变基
git rebase --continue
```

#### 3.2 合并提交
```bash
# 使用 squash 合并提交
git rebase -i HEAD~3
# 将后面的提交改为 squash

# 或者使用 soft reset
git reset --soft HEAD~3
git commit -m "Combined commit message"
```

### 4. Cherry-pick 操作

#### 4.1 基本用法
```bash
# 将单个提交应用到当前分支
git cherry-pick <commit-hash>

# 将多个提交应用到当前分支
git cherry-pick <commit-hash-1> <commit-hash-2>

# 将提交范围应用到当前分支
git cherry-pick <start-commit>..<end-commit>
```

#### 4.2 高级选项
```bash
# 不自动提交，只应用更改到暂存区
git cherry-pick --no-commit <commit-hash>

# 保留原始提交信息
git cherry-pick -x <commit-hash>

# 跳过冲突的提交
git cherry-pick --skip

# 继续 cherry-pick 操作
git cherry-pick --continue

# 中止 cherry-pick 操作
git cherry-pick --abort
```

#### 4.3 实际应用场景
```bash
# 场景1: 将修复提交应用到多个分支
git checkout main
git cherry-pick abc1234  # 应用修复提交

git checkout release/v1.0
git cherry-pick abc1234  # 同样应用到发布分支

# 场景2: 选择性应用功能提交
git cherry-pick --no-commit feature1 feature2 feature3
git commit -m "Selectively apply features 1, 2, and 3"

# 场景3: 处理冲突
git cherry-pick <commit-hash>
# 解决冲突后
git add .
git cherry-pick --continue
```

### 5. 其他高级操作

#### 5.1 重置操作 (Reset)
```bash
# 软重置 - 保留更改在暂存区
git reset --soft HEAD~1

# 混合重置 - 保留更改在工作区
git reset --mixed HEAD~1  # 或 git reset HEAD~1

# 硬重置 - 完全丢弃更改
git reset --hard HEAD~1

# 重置到特定提交
git reset --hard <commit-hash>
```

#### 5.2 恢复操作 (Revert)
```bash
# 创建撤销提交
git revert <commit-hash>

# 撤销多个提交
git revert <commit-hash-1> <commit-hash-2>

# 撤销合并提交
git revert -m 1 <merge-commit-hash>

# 撤销但不提交
git revert --no-commit <commit-hash>
```

#### 5.3 引用日志操作 (Reflog)
```bash
# 查看引用日志
git reflog

# 查看特定分支的引用日志
git reflog show main

# 重置到引用日志中的特定位置
git reset --hard HEAD@{5}

# 查看引用日志的详细信息
git reflog --all --graph --oneline
```

#### 5.4 工作树操作 (Worktree)
```bash
# 基本操作
# 添加工作树
git worktree add ../path-to-worktree branch-name

# 列出所有工作树
git worktree list

# 删除工作树
git worktree remove path-to-worktree

# 锁定工作树
git worktree lock path-to-worktree
```

#### 5.5 工作树高级用法
```bash
# 1. 创建临时工作树用于快速修复
git worktree add ../hotfix-temp hotfix-branch

# 2. 在特定提交上创建工作树
git worktree add ../old-version HEAD~5

# 3. 创建工作树并切换到新分支
git worktree add -b new-feature ../feature-worktree

# 4. 强制删除工作树（即使有未提交的更改）
git worktree remove --force path-to-worktree

# 5. 移动工作树到新位置
git worktree move old-path new-path

# 6. 查看工作树详细信息
git worktree list --porcelain

# 7. 清理过时的工作树引用
git worktree prune
```

#### 5.6 工作树实际应用场景
```bash
# 场景1: 并行开发多个功能
# 主工作区开发功能A
git checkout feature-a
# 在新工作区开发功能B
git worktree add ../feature-b-worktree feature-b

# 场景2: 快速修复生产问题
git worktree add ../hotfix-production hotfix
# 在 hotfix 工作区快速修复
# 修复完成后删除工作区
git worktree remove ../hotfix-production

# 场景3: 代码审查和测试
git worktree add ../review-branch review-feature
# 在新工作区进行代码审查和测试
# 完成后删除工作区

# 场景4: 版本对比
git worktree add ../v1.0 v1.0-tag
git worktree add ../v2.0 v2.0-tag
# 可以同时打开多个版本进行对比
```

## 暂存区高级操作

### 1. 选择性暂存

#### 1.1 交互式暂存
```bash
# 交互式添加文件
git add -i

# 交互式添加补丁
git add -p

# 交互式暂存特定行
git add -e
```

#### 1.2 暂存部分文件
```bash
# 暂存特定文件
git add file1.js file2.js

# 暂存所有 .js 文件
git add *.js

# 暂存所有修改的文件
git add -u

# 暂存所有文件（包括未跟踪的）
git add -A
```

### 2. 暂存区管理

#### 2.1 暂存区状态查看
```bash
# 查看暂存区状态
git status

# 查看暂存区差异
git diff --cached

# 查看工作区差异
git diff

# 查看所有差异
git diff HEAD
```

#### 2.2 暂存区操作
```bash
# 从暂存区移除文件
git reset HEAD file.js

# 清空暂存区
git reset HEAD

# 暂存区内容应用到工作区
git checkout -- file.js
```

## 工作区管理技巧

### 1. 工作区清理

#### 1.1 清理未跟踪文件
```bash
# 查看将被删除的文件
git clean -n

# 删除未跟踪的文件
git clean -f

# 删除未跟踪的文件和目录
git clean -fd

# 删除未跟踪的文件、目录和忽略的文件
git clean -fdx
```

#### 1.2 工作区重置
```bash
# 重置工作区到最近一次提交
git checkout -- .

# 重置工作区到指定提交
git checkout <commit-hash> -- .

# 重置工作区和暂存区
git reset --hard HEAD
```

### 2. 工作区暂存

#### 2.1 Stash 操作
```bash
# 暂存当前工作
git stash

# 暂存并添加描述
git stash push -m "Working on feature A"

# 查看所有 stash
git stash list

# 应用最近的 stash
git stash pop

# 应用指定的 stash
git stash apply stash@{1}

# 删除指定的 stash
git stash drop stash@{1}

# 清空所有 stash
git stash clear
```

#### 2.2 Stash 高级用法
```bash
# 暂存特定文件
git stash push -m "Partial stash" file1.js file2.js

# 暂存未跟踪的文件
git stash push -u -m "Include untracked files"

# 从 stash 创建分支
git stash branch new-branch stash@{0}
```

## 远程仓库高级操作

### 1. 远程分支管理

#### 1.1 远程分支操作
```bash
# 查看远程分支
git branch -r

# 查看所有分支（本地和远程）
git branch -a

# 创建本地分支跟踪远程分支
git checkout -b local-branch origin/remote-branch

# 设置本地分支跟踪远程分支
git branch -u origin/remote-branch local-branch
```

#### 1.2 远程分支同步
```bash
# 获取远程分支信息
git fetch origin

# 获取并清理过时的远程分支引用
git fetch --prune

# 同步远程分支
git remote update origin --prune
```

### 2. 远程仓库管理

#### 2.1 多远程仓库
```bash
# 添加远程仓库
git remote add upstream https://github.com/original/repo.git

# 查看远程仓库
git remote -v

# 重命名远程仓库
git remote rename origin upstream

# 删除远程仓库
git remote remove upstream
```

#### 2.2 远程仓库同步
```bash
# 推送到多个远程仓库
git remote set-url --add origin https://github.com/user/repo.git
git push origin main

# 或者分别推送
git push origin main
git push upstream main
```

## 子模块管理

### 1. 子模块基本操作

#### 1.1 添加子模块
```bash
# 添加子模块
git submodule add https://github.com/user/library.git libs/library

# 初始化子模块
git submodule init

# 更新子模块
git submodule update
```

#### 1.2 克隆包含子模块的仓库
```bash
# 方法1: 递归克隆
git clone --recursive https://github.com/user/repo.git

# 方法2: 分步克隆
git clone https://github.com/user/repo.git
cd repo
git submodule init
git submodule update
```

### 2. 子模块高级操作

#### 2.1 子模块更新
```bash
# 更新所有子模块到最新版本
git submodule update --remote

# 更新特定子模块
git submodule update --remote libs/library

# 进入子模块目录进行更新
cd libs/library
git checkout main
git pull origin main
cd ../..
git add libs/library
git commit -m "Update submodule to latest version"
```

#### 2.2 子模块状态管理
```bash
# 查看子模块状态
git submodule status

# 查看子模块差异
git diff --submodule

# 强制更新子模块
git submodule update --force
```

## 性能优化技巧

### 1. 仓库优化

#### 1.1 垃圾回收
```bash
# 运行垃圾回收
git gc

# 激进垃圾回收
git gc --aggressive

# 清理过期的 reflog
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### 1.2 浅克隆
```bash
# 浅克隆（只获取最近的历史）
git clone --depth 1 https://github.com/user/repo.git

# 增加深度
git fetch --depth 10

# 转换为完整克隆
git fetch --unshallow
```

### 2. 网络优化

#### 2.1 压缩和协议
```bash
# 启用压缩
git config --global core.compression 9

# 使用 SSH 而不是 HTTPS
git remote set-url origin git@github.com:user/repo.git

# 配置 Git 协议版本
git config --global protocol.version 2
```

#### 2.2 并行操作
```bash
# 并行获取
git config --global fetch.parallel 10

# 并行子模块更新
git submodule update --jobs 4
```

## 调试和故障排除

### 1. 常见问题解决

#### 1.1 合并冲突
```bash
# 查看冲突文件
git status

# 查看冲突内容
git diff

# 解决冲突后标记为已解决
git add resolved-file.js

# 继续合并
git commit
```

#### 1.2 历史问题
```bash
# 查看操作历史
git reflog

# 重置到特定操作
git reset --hard HEAD@{5}

# 查看提交历史
git log --oneline --graph --all
```

### 2. 调试工具

#### 2.1 Git 内置工具
```bash
# 查看 Git 配置
git config --list

# 查看 Git 环境
git var -l

# 查看 Git 版本
git --version
```

#### 2.2 第三方工具
```bash
# 使用 tig 查看历史
tig

# 使用 lazygit 进行交互式操作
lazygit

# 使用 gitk 查看图形化历史
gitk --all
```

## 总结

掌握这些 Git 高级操作技巧可以显著提高开发效率：

1. **历史重写** - 保持提交历史的整洁和清晰
2. **暂存区管理** - 精确控制要提交的内容
3. **工作区管理** - 灵活处理临时工作和状态切换
4. **远程操作** - 高效管理多仓库协作
5. **子模块** - 管理复杂项目的依赖关系
6. **性能优化** - 提升 Git 操作速度
7. **故障排除** - 快速解决常见问题

记住，这些高级操作要谨慎使用，特别是在共享分支上。建议在个人分支上练习，熟悉后再应用到团队协作中。
