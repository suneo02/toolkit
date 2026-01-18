# 标准协作工作流指南

本文件定义 Agent-Native 的标准开发流程，面向日常任务的可重复执行步骤。

## 1. 输入格式（目标 + 约束 + 验收）

最小输入应包含：
- 目标：要达成的行为或结果
- 约束：不能破坏的内容或必须遵守的规则
- 验收：如何确认完成（测试/手工步骤/指标）

## 2. 规划阶段（Planning）

输出：Contract Spec + 初版 Execution Plan。
- Contract Spec：目标、非目标、约束、验收、风险
- Execution Plan：todo 列表（每条可独立提交）+ 验证方式

原则：先有 todo 才进入实现。

## 3. 并行探索（Parallel Explore）

并行收集证据，修正计划：
- explore：找入口、调用链、影响面、现有模式
- librarian：查官方文档/最佳实践/相似实现
- oracle：复杂架构取舍或高风险设计

输出：明确改动范围、替代方案与风险点。

## 4. 计划收敛（Plan Convergence）

把探索结果写回 Execution Plan：
- 选定方案与理由
- 明确涉及文件
- 列出重点验证项

## 5. 按 todo 实施（Commit-by-Commit）

只做一个 todo：
1. 实现
2. 运行对应验证
3. 记录变更与验证结果

完成后再进入下一个 todo。

## 6. Review 与验证闭环

评审优先由子代理完成（如 Oracle）：
- 与 verify 步骤绑定，避免“评审与验证脱节”
- 可在复杂改动后触发一次深度 review
- 若有组织级 checklist，优先作为 oracle 的约束而非单独 skill

## 7. 追踪与沉淀（Tracking）

建议将关键产出落到文档与 Git：
- 计划文档可追踪
- 验证结果可复现
- 变更可回滚

## 8. 常见错误

- 在没有证据前写死方案
- todo 无验证方式
- 一次性做完再统一测试
- 未把探索结果写回计划
