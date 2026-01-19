# Spec 文档规范

## 核心原则

- **契约优先**：先写目标/约束/验收，再写实现计划
- **活文档**：计划可随探索结果更新
- **验证绑定**：每个 todo 必须有验证方式

## 文档结构

docs/specs/<task>/
- **spec-contract.md**：目标、约束、验收、风险（不写实现细节）
- **implementation-plan.json**：todo 列表 + 验证方式
- **spec-design.md**（可选）：技术方案、组件复用

## 轻量级模式（单文件）

当任务简单（预期修改文件数 < 3 或 步骤 < 5）时，可合并为单个 `spec.md`：

docs/specs/<task>/spec.md

结构包含：
1. **Contract**: 目标/约束/验收
2. **Design**: (可选) 方案
3. **Plan**: 包含验证方式的 Todo 列表 (Markdown Checkbox)

## Contract Spec 要求

只写不易过时的内容：
- 目标与非目标
- 约束（兼容性/性能/安全）
- 验收标准
- 关键风险

禁止写：具体文件列表、写死方案、实现步骤

## implementation-plan.json 格式

```json
[
  {
    "id": "task-1",
    "title": "任务简述",
    "status": "failed",
    "validation": "npm test -- *.test.ts",
    "code_paths": ["/path/to/file.ts"],
    "@see": ["/docs/specs/<task>/spec-design.md"]
  }
]
```

- status: failed（初始）| success | blocked
- validation: 必填，命令或手工验证步骤
- 流程：先全量 failed → 逐条验证并更新 success

## Design Spec（可选）

写技术方案时：
- 记录探索发现（现有入口、依赖）
- 说明方案选择理由
- 引用可复用组件：`@see /packages/ui/Button.tsx`

## 基本规则

- 语言：中文
- 文档长度：<= 150 行
- 避免大段代码（< 10 行）
- 使用绝对路径或 @see 引用
- 状态更新：原子提交
