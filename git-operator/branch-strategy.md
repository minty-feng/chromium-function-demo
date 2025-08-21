# Git 分支管理策略完整指南

## 引言
本文档详细介绍现代软件开发中常用的 Git 分支管理策略，包括 Git Flow、GitHub Flow、GitLab Flow 等主流工作流程，以及如何根据团队规模和项目特点选择合适的策略。

## 主流分支策略对比

### 1. Git Flow (经典策略)

#### 1.1 分支结构
```
main (master)
├── develop
│   ├── feature/user-auth
│   ├── feature/payment
│   └── feature/admin-panel
├── release/v1.2.0
└── hotfix/security-fix
```

#### 1.2 工作流程
```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 开发完成后合并回 develop
git checkout develop
git merge --no-ff feature/new-feature
git branch -d feature/new-feature

# 3. 发布版本时创建 release 分支
git checkout -b release/v1.2.0 develop
# 修复 bug，更新版本号
git commit -m "Bump version to 1.2.0"
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"
git checkout develop
git merge --no-ff release/v1.2.0
git branch -d release/v1.2.0
```

#### 1.3 适用场景
- 大型团队项目
- 需要严格版本控制
- 有明确的发布周期
- 需要支持多个版本并行维护

### 2. GitHub Flow (简化策略)

#### 2.1 分支结构
```
main
├── feature-branch-1
├── feature-branch-2
└── feature-branch-3
```

#### 2.2 工作流程
```bash
# 1. 从 main 创建功能分支
git checkout -b feature-branch
# 开发功能
git add .
git commit -m "Add new feature"
git push origin feature-branch

# 2. 创建 Pull Request
# 3. 代码审查通过后合并
git checkout main
git pull origin main
git merge feature-branch
git push origin main
git branch -d feature-branch
```

#### 2.3 适用场景
- 小型团队
- 持续部署项目
- 快速迭代需求
- 自动化测试完善

### 3. GitLab Flow (环境驱动策略)

#### 3.1 分支结构
```
production
├── pre-production
├── staging
└── main
    ├── feature-branch-1
    └── feature-branch-2
```

#### 3.2 工作流程
```bash
# 1. 功能开发
git checkout main
git checkout -b feature/new-feature
# 开发完成后合并到 main

# 2. 环境部署
git checkout staging
git merge main
# 部署到 staging 环境测试

# 3. 生产发布
git checkout production
git merge staging
# 部署到生产环境
```

## 分支命名规范

### 功能分支
```bash
# 格式: type/description
git checkout -b feature/user-authentication
git checkout -b bugfix/login-error
git checkout -b hotfix/security-vulnerability
git checkout -b release/v2.1.0
```

### 分支类型前缀
- `feature/` - 新功能
- `bugfix/` - 修复 bug
- `hotfix/` - 紧急修复
- `release/` - 发布版本
- `chore/` - 维护任务

## 高级分支操作

### 1. 分支清理策略
```bash
# 查看已合并的分支
git branch --merged main

# 删除已合并的远程分支
git remote prune origin

# 批量删除本地已合并分支
git branch --merged main | grep -v '^[ *]*main$' | xargs git branch -d
```

### 2. 分支保护规则
```bash
# 设置分支保护
git config branch.main.protect true

# 禁止强制推送
git config receive.denyNonFastForwards true

# 要求 Pull Request
git config branch.main.requirePullRequest true
```

### 3. 分支同步策略
```bash
# 同步远程分支信息
git fetch --prune

# 更新本地分支
git branch -u origin/main main

# 清理过时的远程分支引用
git remote prune origin
```

## 团队协作最佳实践

### 1. 提交信息规范
```bash
# 格式: type(scope): description
git commit -m "feat(auth): add OAuth2 authentication"
git commit -m "fix(api): resolve user data validation issue"
git commit -m "docs(readme): update installation guide"
```

### 2. 代码审查流程
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发完成后推送到远程
git push origin feature/new-feature

# 3. 创建 Pull Request
# 4. 代码审查
# 5. 合并到主分支
```

### 3. 冲突解决策略
```bash
# 1. 更新主分支
git checkout main
git pull origin main

# 2. 重新基于主分支
git checkout feature-branch
git rebase main

# 3. 解决冲突
# 编辑冲突文件
git add .
git rebase --continue

# 4. 强制推送（如果分支已推送）
git push --force-with-lease origin feature-branch
```

### 4. Cherry-pick 在分支管理中的应用

#### 4.1 选择性合并策略
```bash
# 场景: 只合并特定的修复提交，而不是整个功能分支
git checkout main
git cherry-pick abc1234  # 只应用修复提交

# 或者应用多个修复提交
git cherry-pick abc1234 def5678 ghi9012
```

#### 4.2 热修复分支管理
```bash
# 1. 在 main 分支上创建热修复
git checkout main
git checkout -b hotfix/security-patch
# 修复问题
git commit -m "fix: resolve security vulnerability"

# 2. 合并到 main 分支
git checkout main
git merge hotfix/security-patch

# 3. 将修复应用到其他需要维护的分支
git checkout release/v1.0
git cherry-pick hotfix/security-patch

git checkout release/v2.0
git cherry-pick hotfix/security-patch
```

#### 4.3 功能分支部分合并
```bash
# 场景: 功能分支包含多个提交，但只需要部分功能
git checkout main
git cherry-pick feature-branch~3..feature-branch  # 应用最后3个提交

# 或者选择性应用特定提交
git cherry-pick feature-branch~2  # 应用倒数第二个提交
git cherry-pick feature-branch~1  # 应用最后一个提交
```

### 5. 工作树在分支管理中的应用

#### 5.1 并行开发策略
```bash
# 使用工作树实现真正的并行开发
# 主工作区保持在 develop 分支
git checkout develop

# 为每个功能创建独立的工作树
git worktree add ../feature-auth feature/user-authentication
git worktree add ../feature-payment feature/payment-integration
git worktree add ../feature-admin feature/admin-dashboard

# 每个工作树可以独立开发，互不干扰
# 完成后合并回主分支
```

#### 5.2 紧急修复工作流
```bash
# 1. 在主工作区创建热修复分支
git checkout main
git checkout -b hotfix/critical-bug

# 2. 创建热修复工作树
git worktree add ../hotfix-work hotfix/critical-bug

# 3. 在热修复工作树中快速修复
cd ../hotfix-work
# 修复代码...

# 4. 测试完成后合并
git checkout main
git merge hotfix/critical-bug

# 5. 清理工作树
git worktree remove ../hotfix-work
```

#### 5.3 版本维护策略
```bash
# 为每个维护版本创建工作树
git worktree add ../v1.0-maintenance v1.0
git worktree add ../v2.0-maintenance v2.0

# 在各自的工作树中进行版本维护
cd ../v1.0-maintenance
# 修复 v1.0 的问题

cd ../v2.0-maintenance
# 修复 v2.0 的问题

# 定期同步修复到主分支
```

## 自动化工具推荐

### 1. Git Hooks
```bash
# 预提交检查
#!/bin/sh
# .git/hooks/pre-commit
npm run lint
npm run test
```

### 2. CI/CD 集成
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
```

### 3. 分支保护规则
- 禁止直接推送到主分支
- 要求 Pull Request 审查
- 要求状态检查通过
- 要求最新代码同步

## 总结

选择合适的 Git 分支策略需要考虑：
1. **团队规模** - 小团队适合简化策略
2. **项目复杂度** - 复杂项目需要严格策略
3. **发布频率** - 高频发布适合简化策略
4. **团队经验** - 经验不足的团队适合简单策略

无论选择哪种策略，关键是保持团队一致性和流程的可持续性。
