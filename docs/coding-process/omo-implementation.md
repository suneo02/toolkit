# OMO 集成与配置实战

本文件描述在 OhMyOpenCode (OMO) 环境下的落地建议与配置策略。

## 1. 角色分工

- Sisyphus：主协调与执行，负责 todo 驱动与验证
- Explore：在仓库内定位入口、调用链与影响面
- Librarian：查外部官方文档与最佳实践
- Oracle：复杂架构决策与风险评审

## 2. 规划输出持久化

规划输出不应只留在聊天里，建议写入文档：
- 输出格式：Markdown 或 JSON
- 输出路径：`docs/spec/` 或 `docs/coding-process/`

示例配置（仅示意，以本地 schema 为准）：
```json
{
  "sisyphus": {
    "planning": {
      "output_format": "markdown",
      "output_path": "docs/spec/{task_slug}.md"
    }
  }
}
```

## 3. Skill 的重构建议

将传统 spec skill 拆成两个更稳定的能力：
- `contract_builder`: 输出目标/约束/验收/风险
- `todo_planner`: 输出 todo 列表与验证方式

探索结果应写回 todo，而不是写死在 spec 里。

## 4. 推荐提示词框架

```
目标：...
约束：...
验收：...
流程要求：
1) 先输出 todos（每条可独立提交，含验证方法）
2) 并行 explore/librarian（必要时 oracle）
3) 收敛为执行计划（文件列表 + 方案 + 风险）
4) 按 todo 实施并验证
```

## 5. Review 实践

- 默认做法：用 Oracle 进行评审，不维护独立 review skill
- 定制需求：将公司规范或安全 checklist 写入 Oracle 约束
- 混合工具：在 OMO 里用 Oracle，在 IDE/平台（如 Trae/Antigravity）用其内置 review

## 6. 适用建议

- 小任务：可省略 oracle，但保持 todo + 验证
- 大任务：必须并行探索，避免方案漂移
- 高风险：优先契约明确，再进入实现
