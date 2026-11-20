---
title: 把 Spec 驱动流程画成一台机器
description: 用一条台面检验线演示 SpecFlow 的双层状态机：谁能推进状态、QA 打回几次、哪两步必须等人。
date: 2026-11-13
tags: [specflow, 工作流, 图解]
figure: specflow-line
---

上面这台机器会自己运转，先后演示两次变更，走完大约一分半钟。点击它，或者聚焦后按 `→`，可以一步一步走；`←` 回退，`Home` 回到开头，`End` 跳到末尾。

它演示的是 [SpecFlow](https://github.com/TVTRayray/codex-spec-first-workflow) 里一次变更（change）从规划到归档的全过程，以及另一次变更中途被取消的样子。SpecFlow 是一套给 AI 编程 agent 用的 Spec 驱动开发协议：人负责范围、风险和发布决策，runtime 负责「下一步是什么」，agent 只执行一次权限受限的工作单。

## 怎么读这台机器

| 机器上的零件 | 协议里的概念 |
|---|---|
| 料仓里叠着的三块毛坯 | 一个 change 里的三个 spec（状态各自独立：`todo → ready → … → qa_passed`） |
| 左边的闸门和钥匙 | `planning → awaiting_plan_approval → executing`，计划要人批准 |
| 轨道上唯一的一台滑车 | 任务租约：顺序模式下同一时刻只有一个 spec 在线持有 writer 租约 |
| 压床 | Implementer，每压一次是一轮实现 |
| 千分表和表盘上的弧 | Reviewer 的 QA，结论由读数决定；`import-result` 先校验 git 写入范围 |
| 表前带三道刻线的滑块 | `qa_attempts`：按单个 spec 计数，默认上限 2 |
| 左前角的信号旗 | 挂在单个 spec 上的 `decision_required`：升级给人 |
| 轨道前的挡杆 | 挂在单个 spec 上的 `blocked`：执行者报告做不下去，等人处理 |
| 推杆和分两组框的托盘 | 已经 `qa_passed`、按所属 System Spec 域分组等待合并的 spec |
| 柜门闸板和第二把钥匙 | `awaiting_archive_approval → archived`，归档前 `validate` 预演合并，归档要人批准 |
| 刻着 `system-specs` 的双舱柜子 | System Spec domain：spec 1、2 按计划顺序合并进左舱共享域，spec 3 进右舱独立域 |

右下角的读数对应 runtime 维护的两层状态：change 的 **phase**，以及正在推进或等待决策的 **spec 状态**（与 `state.yaml` 一致）。

## 两层状态，三条命运

现在的 SpecFlow 把状态拆成两层：change 只保存**阶段**（`planning → awaiting_plan_approval → executing ⇄ awaiting_archive_approval → archived / cancelled`），实施进度与暂停都挂在各个 **spec** 自己身上。这样即便后续切到并行执行，spec A 等待决策期间导入 spec B 的结果，A 的状态也不会被覆盖。

在默认的顺序流水线里，三个 spec 依次走过三条不同的路：

1. **第一块一次通过。** `implementing → reviewing`，写入范围校验通过、偏差在公差内，以 `qa_passed` 推入托盘左侧的共享域区（Domain A）。
2. **第二块先被阻塞，再被打回一次。** 实现到一半，Implementer 报告 `blocked`：租约归还，滑车带着方块退到闸门外侧的挡杆前停住。此时只有 spec 2 进入 `blocked`，change 的 phase 仍保持 `executing`。人排除阻塞并执行 `resolve` 后，spec 2 回到阻塞前的 `ready`，runtime 重新派发。之后 QA 量出偏差 +1.6，进入 `repairing`，计数滑块前进一格；再压一次后通过，同样落入 Domain A。
3. **第三块用尽了自动修复。** 连续两次修复后偏差仍是 +1.0。此时 `qa_attempts` 已经等于上限，runtime 不再派发修复，而是记下 `repeated_failure`、升起信号旗，把 spec 3 转入 `decision_required`。人记录决定之后才回到 `repairing`，计数不清零；再次通过后落入右侧独立域区（Domain B）。

三块都进托盘后，change 进入 `awaiting_archive_approval`。`validate` 先在内存中预演合并、确认同一域内按计划顺序应用没有冲突；随后人转动第二把钥匙，闸板升起，托盘滑进双舱柜子，闸板落下。

## 第二圈：取消

归档之后机器会接着跑一次短得多的变更。它在第一块上遇到同样的阻塞，但这次人的决定是取消。`cancelled` 是终态：计划钥匙拧回，闸门落下，挡杆锁住，柜子里什么都没进。

`blocked` 和 `decision_required` 的出口是同一个：人做决定（`resolve`）。恢复到指定状态、退回重新规划，或者取消，都只能由人记录之后 runtime 才执行。

## 机器替协议说的三件事

**状态只能由 runtime 推进。** 图里没有任何零件会自己越过下一道工序：压床没抬起，滑车不动；滑车没到位，千分表不落下。协议里对应的规则是，agent 不能凭聊天里的结论改状态，必须提交协议工件，经 runtime 校验写入范围（对照派发时的 git 基线）和报告格式后才能转换。

**自动化有边界。** 两次自动修复是给普通实现缺陷、缺失测试和回归用的。超过上限就停下来等人，而不是无限重试；借助 `hc`（herdr-core）adapter 启动的后台 worker 只要还活着，lease 会自动续期，挂掉才按超时回收。

**两头都是人。** 整条线上只有两把钥匙，一把开计划，一把开归档。中间的全部工序可以无人值守，这两步不行。

## 这张图省略了什么

- 并行模式（`sequential_specs: false`）下，与被阻塞 spec 无关的其他 spec 可以继续推进；图里只画了单滑车的顺序轨道，以及 `blocked` 的一种来源（执行者主动报告）。
- 归档批准前的 `reopen-qa`（`awaiting_archive_approval → executing`，将某个已通过 QA 的 spec 重新转回 `repairing`）与执行中退回 `planning`（`resolve planning`）没有在动线里展开。
- 需求歧义、架构决策、安全风险、数据迁移这几类问题会跳过自动修复、直接升级，图里只演示了「次数用尽」这一种升级。
- 设计维度（Design Impact、视觉验收清单）与规划期 PRD 登记没有画。
- 毛坯高 16、目标高 12、公差 ±0.4，以及阻塞时「压到一半」的高度 15，是为了让千分表有东西可量而设的示意数字，不是协议里的值。状态名、转换条件、域合并模型和修复上限来自协议本身。

## 图是怎么做的

图用 [Anatomy](https://github.com/wheresryan22/anatomy) 这个 skill 的套件生成。它的主张是「物体本身就是解释」：不画方框和箭头，而是造一台工作方式与概念一一对应的机器。

整张图是一段构建期生成的内联 SVG，加上一段驱动它的脚本，没有外部请求。每一步只声明所有零件的目标姿态，零件之间靠互锁决定谁先动，所以前进、回退和跳转用的是同一套逻辑。读数取自零件此刻的实际位置：偏差就是千分表测杆的高度减去目标高度。
