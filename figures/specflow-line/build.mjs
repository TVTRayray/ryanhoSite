// SpecFlow 检验线：把 spec-workflow 的双层状态机（change phase + per-spec state）与 System Spec domain 归档画成一台台面流水线。
// 用法：node figures/specflow-line/build.mjs [--preview]
// 产物：src/figures/specflow-line.html（嵌入站点的片段）；--preview 另写两份独立预览页（深色、浅色）。
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";

const { slabOf, solidSvg, lineSvg, dotsSvg, planOutline, insetPlan, iso, lineOnTop, translateAlong, depthOf } = k;
const HERE = dirname(fileURLToPath(import.meta.url));

const WIDTH = 640;
const HEIGHT = 400;
const PLATE = { x: -170, y: -66, w: 306, d: 126, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;

// 模型常量：构建脚本与页面脚本共用同一份。
const C = {
  HOME: -138, GATE: -112, HOLD: -95, STOP_X: -78, PRESS: -54, GAUGE: -8, SLOT: [36, 58, 80],
  DECK: 6, BLANK: 16, NOMINAL: 12, TOL: 0.4, MAX: 2, LEVEL: 18,
  RAM_UP: 26, PLG_UP: 24.5, PER_TURN: 10, DIAL_R: 16, DIAL_TOP: 55,
  TRAY_Y: -23, TRAY_IN: 20, PUSH: 24, PUSH_FACE: 9,
  GATE_LIFT: 20.6, SHUT_LIFT: 22, FLAG_LIFT: 34, RIDER_STEP: 12,
  KEYA: [-112, 36], KEYB: [118, 20], KEY_Z: 8.2,
  STOP: 14, PARTIAL: 15, BLOCKED_SPEC: 1,
  // 每个 spec 每轮实现后的高度；与 NOMINAL 的差在 ±TOL 内才算 QA 通过。
  HEIGHTS: [[12.0], [13.6, 12.1], [14.8, 13.9, 13.0, 12.2]],
};

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [C.HOME - 14, -14, 67], [C.HOME + 14, 14, 67],
    [C.PRESS, 8, 68], [C.PRESS - 5, -41, 66],
    [-152, 46, 52], [-166, 46, 50], [18, -62, 46], [98, -62, 46],
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 58 },
);

const at = (point) => iso(point, P);
const S = (paths, style) => solidSvg(paths, style);
const L = (d, style) => lineSvg(d, style);
const D = (points, style) => dotsSvg(points, style);
const box = (x, y, w, d, r = 0.5) => ({ x, y, w, d, r });
const slab = (plan, z, h, steps = 3, bevel = 0) => slabOf(plan, z, h, P, steps, bevel);
const cyl = (x, y, r, z, h, steps = 24, bevel = 0) => k.cylinder(x, y, r, z, h, P, steps, bevel);
const poly = (points) => k.pathOf(points.map(at), true);
const byDepth = (points) => [...points].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));
const part = (name, body, extra = "") => `<g data-part="${name}"${extra}>${body}</g>`;

// ---------- 页面与构建共用的纯函数（会被 toString 内联进页面） ----------

function blockSvg(index, height, lit) {
  const plan = { x: -8, y: -8, w: 16, d: 16, r: 1.5 };
  const top = C.DECK + height;
  const pips = [[[0, 0]], [[-2.6, 0], [2.6, 0]], [[-3.6, 0], [0, 0], [3.6, 0]]][index];
  return (
    solidSvg(slabOf(plan, C.DECK, height, P, 3, 0.5), { tone: "hi", crease: "lo", lit }) +
    lineSvg(planOutline(insetPlan(plan, 2.4), top, P, 3), { tone: lit ? "mid" : "faint" }) +
    dotsSvg(pips.map(([x, y]) => iso([x, y, top], P)), { size: 0.75, tone: "hi" })
  );
}

function needleD(turn) {
  const angle = turn * Math.PI * 2;
  const x = C.GAUGE;
  const reach = C.DIAL_R - 4;
  return lineOnTop([x - Math.sin(angle) * 3, Math.cos(angle) * 3], [x + Math.sin(angle) * reach, -Math.cos(angle) * reach], C.DIAL_TOP + 0.2, P);
}

function keyD(centre, turned) {
  const angle = (turned * Math.PI) / 2;
  return lineOnTop(centre, [centre[0] + Math.sin(angle) * 2.9, centre[1] - Math.cos(angle) * 2.9], C.KEY_Z + 0.05, P);
}

// 两圈：第一个 change 走到归档（途中 spec 2 被阻塞一次、spec 3 升级一次），第二个 change 在 spec 1 阻塞后被人取消。
// 每一步声明 phase、当前 spec 状态与所有零件目标姿态；状态名与转换条件取自 src/state.ts。
function buildSteps() {
  const steps = [];
  const lap = (cancelled) => {
    const loc = ["s0", "s1", "s2"];
    const h = [C.BLANK, C.BLANK, C.BLANK];
    let cur = {
      keyA: 0, car: C.HOME, ram: null, plg: 0, push: 0, att: 0, flag: 0, stop: 0,
      keyB: 0, shut: 0, tray: 0, lit: -1, sp: -1, spSt: "", hold: "", fresh: false,
    };
    const add = (phase, note, patch = {}, dwell = 0.48) => {
      cur = { ...cur, fresh: false, ...patch };
      steps.push({ ...cur, phase, note, dwell, loc: [...loc], h: [...h] });
    };
    const dropRest = (from) => {
      for (let j = from + 1; j < 3; j++) {
        if (loc[j].startsWith("s")) loc[j] = "s" + (j - from - 1);
      }
    };
    const block = (s) => {
      loc[s] = "c";
      dropRest(s);
      h[s] = C.PARTIAL;
      add("executing", "取得任务租约：同一 spec 同时最多一个 writer", { car: C.PRESS, ram: C.PARTIAL, push: 0, sp: s, spSt: "implementing", hold: "", att: 0, lit: s });
      add("executing", "spec " + (s + 1) + " 报告 blocked：租约归还，挡杆伸出；phase 仍为 executing", { car: C.HOLD, ram: null, spSt: "blocked", hold: "blocked", stop: 1, lit: -1 }, 1.6);
    };

    add("planning", (cancelled ? "第二个 change：" : "") + "规划中：planner 拆分 spec 并绑定 System Spec domain", { fresh: true }, 0.9);
    add("awaiting_plan_approval", "规划工件齐备，等人转动钥匙批准计划", {}, 1.2);
    add("executing", "人转动钥匙批准计划，闸门升起；spec 1 就绪", { keyA: 1, sp: 0, spSt: "ready" }, 0.8);

    if (cancelled) {
      block(0);
      add("cancelled", "人决定取消：终态，闸门落下，System Spec 保持不变", { keyA: 0, sp: -1, spSt: "", hold: "" }, 2.4);
      return;
    }

    C.HEIGHTS.forEach((rounds, s) => {
      if (s > 0) {
        add("executing", "runtime 推进下一个依赖已满足的 spec（todo → ready）", { car: C.HOME, push: 0, sp: s, spSt: "ready", hold: "", att: 0, lit: -1 });
      }
      if (s === C.BLOCKED_SPEC) {
        block(s);
        add("executing", "人排除阻塞后 resolve：仅该 spec 回到阻塞前状态", { stop: 0, spSt: "ready", hold: "" }, 0.8);
      }
      loc[s] = "c";
      dropRest(s);
      h[s] = rounds[0];
      add("executing", s === C.BLOCKED_SPEC ? "重新派发，取得新的任务租约" : "取得任务租约：同一 spec 同时最多一个 writer", { car: C.PRESS, ram: rounds[0], push: 0, sp: s, spSt: "implementing", hold: "", att: 0, lit: s });
      let attempts = 0;
      for (let round = 0; round < rounds.length; round++) {
        add("executing", "校验写入范围并导入结果；Reviewer 量出偏差", { car: C.GAUGE, ram: null, plg: 1, spSt: "reviewing", hold: "" }, 1.0);
        if (Math.abs(rounds[round] - C.NOMINAL) <= C.TOL) break;
        if (attempts < C.MAX) {
          attempts += 1;
          h[s] = rounds[round + 1];
          add("executing", "QA 打回，自动修复 " + attempts + "/" + C.MAX + "：只改报告列出的问题", { car: C.PRESS, plg: 0, ram: rounds[round + 1], spSt: "repairing", att: attempts });
        } else {
          add("executing", "修复上限用尽（repeated_failure），仅 spec " + (s + 1) + " 升级给人", { flag: 1, spSt: "decision_required", hold: "decision_required", lit: -1 }, 1.6);
          h[s] = rounds[round + 1];
          add("executing", "人记录决定：spec " + (s + 1) + " 回到 repairing（计数不清零）", { flag: 0, hold: "", car: C.PRESS, plg: 0, ram: rounds[round + 1], spSt: "repairing", lit: s });
        }
      }
      loc[s] = "t";
      const domain = s < 2 ? "Domain A" : "Domain B";
      add("executing", "QA 通过，推入 " + domain + " 托盘区（" + (s < 2 ? "共享域按计划顺序合并" : "独立域") + "）", { car: C.SLOT[s], plg: 0, push: 1, spSt: "qa_passed", lit: -1 }, 0.65);
    });

    add("awaiting_archive_approval", "全部 spec 通过；validate 预演合并无冲突，等人批准归档", { car: C.HOME, push: 0, sp: -1, spSt: "", hold: "", att: 0 }, 1.4);
    add("archived", "人转动钥匙批准：3 个 spec 按计划顺序合并进 2 个 System Spec 域", { keyB: 1, shut: 1, tray: 1 }, 0.95);
    add("archived", "归档完成，闸板落下", { shut: 0 }, 2.4);
  };
  lap(false);
  lap(true);
  return steps;
}

// ---------- 静态几何 ----------

function floor() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(cyl(x, y, 7, -PLATE_H - FOOT_H, 1.6, 28), { tone: "lo" }));
    out.push(S(cyl(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28), { tone: "mid" }));
  }
  out.push(S(slab(PLATE, -PLATE_H, PLATE_H, 8, 1.6), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // 轨道旁的位置刻度尺（从 HOLD 到 GAUGE 后）
  const strip = box(-102, 11.4, 122, 3.6, 0.6);
  out.push(S(slab(strip, 0, 0.6), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 4, 5, strip.y + 0.2, 0.6, [1.4, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // 铭牌
  const label = box(80, 39, 34, 12, 1);
  out.push(S(slab(label, 0, 0.8, 4), { tone: "lo", crease: "none" }));
  out.push(L(planOutline(insetPlan(label, 1.6), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[20, 43], [26, 46], [14, 49]].map(([w, y]) => lineOnTop([label.x + 4, y], [label.x + 4 + w, y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 2, 45, 0.8]), at([label.x + label.w - 2, 45, 0.8])], { size: 0.45 }));
  return out.join("");
}

const CAB = box(18, -62, 80, 28, 2);
const CAB_H = 46;
const FACE = -34;
const OPEN = { x0: 23, x1: 93, z0: 1.5, z1: 22 };

function cabinet() {
  const out = [];
  out.push(S(slab(CAB, 0, CAB_H, 4, 1), { tone: "mid", inner: L(k.sideSeam(CAB, 25, P, 4), { tone: "faint" }) }));
  // 两个 System Spec domain 舱顶区：左舱接收 spec 1+2（共享 domain），右舱接收 spec 3
  out.push(L(planOutline(box(22, -58, 45, 20, 1.5), CAB_H, P, 3), { tone: "faint" }));
  out.push(L(planOutline(box(71, -58, 23, 20, 1.5), CAB_H, P, 3), { tone: "faint" }));
  // 柜顶域分隔压条（实心薄条，零悬空线端）
  out.push(S(slab(box(68.2, -59, 1.6, 22, 0.4), CAB_H, 0.7, 2), { tone: "lo", crease: "none" }));
  out.push(D(k.corners(CAB, 7).map(([x, y]) => at([x, y, CAB_H])), { size: 0.45 }));
  out.push(k.faceTextSvg(k.topMatrix([26, -41], CAB_H, P, "x"), "system-specs", { size: 4.1, tone: "lo" }));
  // 前面板两块闭合域铭牌凹槽
  out.push(S(slab(box(24, FACE, 42, 0.8, 0.2), 28, 5, 2), { tone: "lo", crease: "none" }));
  out.push(S(slab(box(72, FACE, 20, 0.8, 0.2), 28, 5, 2), { tone: "lo", crease: "none" }));
  // 柜口：透过开口能看到的左壁、底板和域隔墙阴影
  const { x0, x1, z0, z1 } = OPEN;
  const back = FACE - 26;
  const opening = [[x0, FACE, z0], [x1, FACE, z0], [x1, FACE, z1], [x0, FACE, z1]];
  out.push(`<clipPath id="sf-hole"><path d="${poly(opening)}"/></clipPath>`);
  out.push(
    `<g clip-path="url(#sf-hole)"><path class="sf-cav" d="${poly(opening)}"/>` +
      `<path class="sf-cav-wall" d="${poly([[x0, FACE, z0], [x0, FACE, z1], [x0, back, z1], [x0, back, z0]])}"/>` +
      `<path class="sf-cav-floor" d="${poly([[x0, FACE, z0], [x1, FACE, z0], [x1, back, z0], [x0, back, z0]])}"/></g>`,
  );
  out.push(L(poly(opening), { tone: "lo" }));
  // 托盘和已入柜的 spec 只能透过开口被看到：裁剪到"开口向观察者扫出的体积"
  out.push(`<clipPath id="sf-open"><path d="${slabOf(box(x0 - 0.6, FACE, x1 - x0 + 1.2, 120, 0), 0.6, z1 - 0.1, P, 1).fill}"/></clipPath>`);
  return out.join("");
}

const guide = (x) => S(slab(box(x, FACE, 2, 2.2, 0.3), 0, CAB_H, 2), { tone: "mid", crease: "none" });

function shutter() {
  return (
    S(slab(box(22.5, FACE + 0.4, 71, 1.4, 0.2), 1.5, 21.5, 2), { tone: "mid" }) +
    S(slab(box(54, FACE + 1.8, 8, 1.2, 0.3), 10, 2.4, 2), { tone: "mid", crease: "none" }) +
    D([at([28, FACE + 1.8, 12]), at([88, FACE + 1.8, 12]), at([28, FACE + 1.8, 20]), at([88, FACE + 1.8, 20])], { size: 0.45 })
  );
}

const TRAY = box(24, -32, 68, 18, 1);

function tray() {
  const out = [S(slab(TRAY, 1.6, 4.4, 3, 0.4), { tone: "mid" })];
  // 外框分组表示 System Spec domain：左组（spec 1+2 共享 Domain A），右组（spec 3 独立 Domain B）
  out.push(L(planOutline(box(36 - 9.4, C.TRAY_Y - 9.2, 40.8, 18.4, 1.8), C.DECK, P, 3), { tone: "lo" }));
  out.push(L(planOutline(box(80 - 9.4, C.TRAY_Y - 9.2, 18.8, 18.4, 1.8), C.DECK, P, 3), { tone: "lo" }));
  out.push(L(C.SLOT.map((x) => planOutline(box(x - 8.4, C.TRAY_Y - 8.4, 16.8, 16.8, 1.5), C.DECK, P, 3)).join(""), { tone: "faint" }));
  for (const x of [52, 62.4]) out.push(S(slab(box(x, -14, 1.6, 2.4, 0.3), 3, 1.6, 2), { tone: "mid", crease: "none" }));
  out.push(S(slab(box(51, -11.8, 14, 1.4, 0.5), 2.6, 2.4, 2), { tone: "mid" }));
  return out.join("");
}

function pressBack() {
  const base = box(C.PRESS - 9, -44, 18, 18, 2);
  return (
    S(slab(base, 0, 6, 4, 0.6), { tone: "mid" }) +
    D(k.corners(base, 3).map(([x, y]) => at([x, y, 6])), { size: 0.45 }) +
    S(cyl(C.PRESS, -35, 4, 6, 52, 28), { tone: "mid", crease: "none" }) +
    L([22, 40].map((z) => k.sideArc(C.PRESS, -35, 4, z, P, 16)).join(""), { tone: "faint" })
  );
}

function ram() {
  return S(cyl(C.PRESS, 0, 6.2, C.RAM_UP, 2.4, 28, 0.4), { tone: "hi", crease: "lo" }) + S(cyl(C.PRESS, 0, 3, C.RAM_UP + 2.4, 24, 20), { tone: "hi", crease: "none" });
}

function pressFront() {
  const arm = box(C.PRESS - 5.5, -41, 11, 49, 2.5);
  return (
    S(cyl(C.PRESS, 0, 5.2, 31, 27, 32), { tone: "mid", crease: "none" }) +
    L(k.knurl(C.PRESS, 0, 5.2, 31, 34.5, 30, P), { tone: "lo" }) +
    L([34.5, 54].map((z) => k.sideArc(C.PRESS, 0, 5.2, z, P, 20)).join(""), { tone: "faint" }) +
    S(slab(arm, 58, 7, 4, 0.7), { tone: "mid" }) +
    D([[-41 + 4], [-22], [-12]].map(([y]) => at([C.PRESS, y, 65])), { size: 0.45 }) +
    S(cyl(C.PRESS, -35, 2.6, 65, 1.6, 20), { tone: "mid" }) +
    S(cyl(C.PRESS, 0, 3.6, 65, 3, 24), { tone: "mid" }) +
    L(k.knurl(C.PRESS, 0, 3.6, 65, 68, 22, P), { tone: "lo" })
  );
}

function gaugeBack() {
  const x = C.GAUGE;
  const base = box(x - 9, -44, 18, 18, 2);
  return (
    S(slab(base, 0, 6, 4, 0.6), { tone: "mid" }) +
    D(k.corners(base, 3).map(([px, py]) => at([px, py, 6])), { size: 0.45 }) +
    S(cyl(x, -35, 3.2, 6, 40, 24), { tone: "mid", crease: "none" }) +
    L([20, 34].map((z) => k.sideArc(x, -35, 3.2, z, P, 16)).join(""), { tone: "faint" }) +
    S(slab(box(x - 7, -42, 14, 14, 2.5), 46, 10, 4, 0.6), { tone: "mid" }) +
    S(cyl(x, -35, 3.2, 56, 8, 24), { tone: "mid", crease: "none" }) +
    S(cyl(x, -35, 3.8, 64, 1.6, 24), { tone: "mid" }) +
    S(slab(box(x + 7, -36.4, 3, 2.8, 0.8), 49, 4, 2), { tone: "mid", crease: "none" }) +
    S(cyl(x + 11.4, -35, 2.6, 48, 6, 18), { tone: "mid" }) +
    L(k.knurl(x + 11.4, -35, 2.6, 48, 54, 18, P), { tone: "lo" })
  );
}

function plunger() {
  return S(cyl(C.GAUGE, 0, 2.4, C.PLG_UP, 2, 16), { tone: "hi", crease: "lo" }) + S(cyl(C.GAUGE, 0, 1.3, C.PLG_UP + 2, 22, 14), { tone: "hi", crease: "none" });
}

function gaugeFront(body) {
  const x = C.GAUGE;
  const top = C.DIAL_TOP;
  const R = C.DIAL_R;
  const out = [];
  out.push(S(slab(box(x - 3, -28, 6, 13, 1.5), 48.5, 4, 3, 0.4), { tone: "mid" }));
  out.push(body);
  out.push(S(cyl(x, 0, 2.8, 30, 16, 20), { tone: "mid" }));
  out.push(L(k.sideArc(x, 0, 2.8, 34, P, 12), { tone: "lo" }));
  out.push(S(cyl(x, 0, R, 46, 9, 64, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, 0, R, top - 3.4, top, 84, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(x, 0, R, top - 3.4, P, 40), { tone: "faint" }));
  out.push(L(k.ring(x, 0, R - 2.2, top, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(x, 0, R - 3, 50, 5, top, [1.3, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // 公差带：±TOL
  const span = (C.TOL / C.PER_TURN) * Math.PI * 2;
  const arc = Array.from({ length: 9 }, (_, i) => -span + (i / 8) * span * 2).map((a) => [x + Math.sin(a) * (R - 6.4), -Math.cos(a) * (R - 6.4)]);
  out.push(L(k.onTop(arc, top, P), { tone: "hi" }));
  out.push(L([-span, span].map((a) => lineOnTop([x + Math.sin(a) * (R - 6.4), -Math.cos(a) * (R - 6.4)], [x + Math.sin(a) * (R - 3), -Math.cos(a) * (R - 3)], top, P)).join(""), { tone: "hi" }));
  out.push(S(slab(box(x + R - 1, -2.4, 5, 4.8, 1.2), 48, 5, 3), { tone: "mid" }));
  out.push(S(slab(box(x + R + 3.6, -3.2, 2.6, 6.4, 1.2), 47.2, 6.6, 3), { tone: "mid" }));
  out.push(L(k.ring(x, 0, 1.6, top, P, 16), { tone: "mid" }));
  out.push(`<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleD((C.PLG_UP - C.DECK - C.NOMINAL) / C.PER_TURN)}" style="stroke-width:1.1"/>`);
  return out.join("");
}

const TOWER = 12.6;
const towerPost = (sx, sy) =>
  S(slab(box(C.HOME + sx * TOWER - 2.2, sy * TOWER - 2.2, 4.4, 4.4, 0.6), 0, 1, 2), { tone: "lo", crease: "none" }) +
  S(slab(box(C.HOME + sx * TOWER - 1.2, sy * TOWER - 1.2, 2.4, 2.4, 0.4), 1, 63, 2), { tone: "mid", crease: "none" });
const towerBarX = (sy, z) => S(slab(box(C.HOME - TOWER - 1.2, sy * TOWER - 1.2, TOWER * 2 + 2.4, 2.4, 0.5), z, 2.4, 2), { tone: "mid" });
const towerBarY = (sx, z) => S(slab(box(C.HOME + sx * TOWER - 1.2, -TOWER - 1.2, 2.4, TOWER * 2 + 2.4, 0.5), z, 2.4, 2), { tone: "mid" });

function towerBack() {
  return towerPost(-1, -1) + towerPost(1, -1) + towerBarX(-1, 30) + towerBarY(-1, 30);
}

function towerFront() {
  return towerPost(-1, 1) + towerPost(1, 1) + towerBarX(-1, 64) + towerBarY(-1, 64) + towerBarY(1, 64) + towerBarX(1, 64);
}

const gatePost = (sy) =>
  S(slab(box(C.GATE - 2.5, sy > 0 ? 16 : -21, 5, 5, 0.6), 0, 1.2, 2), { tone: "lo", crease: "none" }) +
  S(slab(box(C.GATE - 1.5, sy > 0 ? 17 : -20, 3, 3, 0.5), 1.2, 44.8, 2, 0.3), { tone: "mid" });

function gatePlate() {
  return (
    S(slab(box(C.GATE - 0.8, -15.5, 1.6, 31, 0.2), 3.4, 20, 2), { tone: "mid" }) +
    D([[-11, 8], [11, 8], [-11, 19], [11, 19]].map(([y, z]) => at([C.GATE + 0.8, y, z])), { size: 0.45 })
  );
}

function gateBeam() {
  return S(slab(box(C.GATE - 2.5, -21.5, 5, 43, 1), 46, 4, 3, 0.5), { tone: "mid" }) + D([-18.5, 18.5].map((y) => at([C.GATE, y, 50])), { size: 0.45 });
}

function rails() {
  const out = [];
  for (const y of [-9, 5]) {
    out.push(S(slab(box(-152, y, 252, 4, 1), 0, 3, 3, 0.4), { tone: "mid" }));
    out.push(D([-146, -84, -32, 16, 94].map((x) => at([x, y + 2, 3])), { size: 0.4 }));
  }
  for (const x of [-157, 100]) {
    out.push(S(slab(box(x, -12, 5, 24, 1.2), 0, 7, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 2.5, -8, 7]), at([x + 2.5, 8, 7])], { size: 0.45 }));
  }
  return out.join("");
}

function carriage() {
  const plan = box(C.HOME - 11, -11, 22, 22, 2);
  return (
    S(slab(plan, 3, 3, 4, 0.5), { tone: "mid" }) +
    // 前导轨滑块与对准刻度尺的游标指针凸耳
    S(slab(box(C.HOME - 8.5, 9, 17, 2.2, 0.4), 1.6, 4.4, 2), { tone: "mid" }) +
    S(slab(box(C.HOME - 1.4, 11.2, 2.8, 1.8, 0.3), 3.0, 2.2, 2), { tone: "hi", crease: "lo" }) +
    D([at([C.HOME, 12.1, 5.2])], { size: 0.45 }) +
    L(planOutline(box(C.HOME - 8.6, -8.6, 17.2, 17.2, 1.8), C.DECK, P, 3), { tone: "faint" }) +
    D(k.corners(plan, 1.8).map(([x, y]) => at([x, y, C.DECK])), { size: 0.4 })
  );
}

const RODS = [47, 69];

function pusher() {
  const bar = box(24, C.PUSH_FACE, 68, 3, 1);
  return (
    S(slab(bar, 6.4, 5, 3, 0.4), { tone: "mid" }) +
    D([30, 58, 86].map((x) => at([x, C.PUSH_FACE + 1.5, 11.4])), { size: 0.4 }) +
    RODS.map((x) => S(slab(box(x - 1.2, C.PUSH_FACE + 3, 2.4, 41, 0.4), 7.7, 2.4, 2), { tone: "hi", crease: "none" })).join("")
  );
}

function actuators() {
  const out = [];
  for (const x of RODS) {
    const body = box(x - 5, 27, 10, 27, 1.5);
    out.push(S(slab(box(x - 4.5, 29, 9, 4, 0.5), 0, 3, 2), { tone: "lo", crease: "none" }));
    out.push(S(slab(box(x - 4.5, 47, 9, 4, 0.5), 0, 3, 2), { tone: "lo", crease: "none" }));
    out.push(S(slab(box(x - 2.4, 25.4, 4.8, 1.6, 0.4), 6.5, 4.8, 2), { tone: "mid" }));
    out.push(S(slab(body, 3, 11, 4, 0.6), { tone: "mid" }));
    out.push(L(planOutline(insetPlan(body, 2), 14, P, 3), { tone: "faint" }));
    out.push(D([at([x, 31.5, 14]), at([x, 49.5, 14])], { size: 0.5 }));
  }
  return out.join("");
}

function counter() {
  const x = C.GAUGE;
  const strip = box(x - 24, 24, 40, 9, 1);
  const ticks = k.topTicks(x - 16, x + 8, C.RIDER_STEP, 1, strip.y + 0.2, 1, [3, 3], P);
  return (
    S(slab(strip, 0, 1, 3), { tone: "lo", crease: "none" }) +
    L(ticks.major + ticks.minor, { tone: "mid" }) +
    S(slab(box(x - 21.5, 29.5, 35, 2, 0.5), 1, 1.2, 2), { tone: "mid", crease: "none" }) +
    S(slab(box(x - 22.4, 28.5, 2, 4, 0.5), 1, 3.5, 2), { tone: "mid" }) +
    S(slab(box(x + 11.6, 28.5, 2, 4, 0.5), 1, 3.5, 2), { tone: "mid" })
  );
}

function rider() {
  const x = C.GAUGE - 16;
  return S(slab(box(x - 3, 28, 6, 5, 1), 1, 4.6, 3, 0.4), { tone: "hi", crease: "lo" }) + L(lineOnTop([x, 28], [x, 33], 5.6, P), { tone: "hi" });
}

function keyBox(centre, name) {
  const [cx, cy] = centre;
  const plan = box(cx - 7, cy - 6, 14, 12, 1.5);
  return (
    S(slab(plan, 0, 6, 3, 0.6), { tone: "mid" }) +
    L(planOutline(insetPlan(plan, 1.6), 6, P, 3), { tone: "faint" }) +
    D([at([cx - 5, cy + 4, 6]), at([cx + 5, cy - 4, 6])], { size: 0.45 }) +
    S(cyl(cx, cy, 3.4, 6, C.KEY_Z - 6, 28), { tone: "hi", crease: "lo" }) +
    L(k.knurl(cx, cy, 3.4, 6, C.KEY_Z, 22, P), { tone: "lo" }) +
    `<path data-part="${name}" class="iso-line" data-tone="hi" data-free="end" d="${keyD(centre, 0)}" style="stroke-width:1"/>` +
    D([at([cx, cy, C.KEY_Z])], { size: 0.6, tone: "hi" })
  );
}

const MAST = [-152, 46];

function mast() {
  const [x, y] = MAST;
  return S(cyl(x, y, 4, 0, 2, 24), { tone: "lo" }) + S(cyl(x, y, 1.3, 2, 48, 14), { tone: "mid", crease: "none" }) + S(cyl(x, y, 2, 50, 1.5, 16), { tone: "mid" });
}

function flag() {
  const [x, y] = MAST;
  return (
    S(slab(box(x - 2.5, y - 2.5, 5, 5, 1), 4, 4, 2), { tone: "hi", crease: "lo", className: "sf-flag" }) +
    S(cyl(x, y, 1.3, 8, 3, 14), { tone: "mid", crease: "none" }) +
    S(slab(box(x - 13.5, y - 0.8, 11, 1.6, 0.3), 4, 9, 2), { tone: "hi", crease: "lo", className: "sf-flag" }) +
    D([at([x - 11.5, y + 0.8, 11]), at([x - 4.5, y + 0.8, 11])], { size: 0.45 })
  );
}

function stopBar() {
  const x = C.STOP_X;
  return S(slab(box(x - 2, 12, 4, 28, 0.6), 3.4, 4.6, 2, 0.3), { tone: "hi", crease: "lo", className: "sf-stop" }) + D([at([x, 14.5, 8])], { size: 0.45 });
}

function stopHousing() {
  const x = C.STOP_X;
  const plan = box(x - 5.5, 22, 11, 18, 1.5);
  return (
    S(slab(plan, 0, 11, 3, 0.6), { tone: "mid" }) +
    L(planOutline(insetPlan(plan, 1.8), 11, P, 3), { tone: "faint" }) +
    D([at([x - 3, 25, 11]), at([x + 3, 25, 11])], { size: 0.45 }) +
    S(cyl(x, 33.5, 2.8, 11, 3, 20), { tone: "mid" }) +
    L(k.knurl(x, 33.5, 2.8, 11, 14, 18, P), { tone: "lo" })
  );
}

const wires = () =>
  k.wireSvg(at([C.KEYA[0] + 7, C.KEYA[1], 0]), at([C.GATE + 2.5, 18.5, 0]), { via: [at([C.KEYA[0] + 7, 18.5, 0])], tone: "lo" }) +
  k.wireSvg(at([C.KEYB[0] + 7, C.KEYB[1], 0]), at([98, -48, 0]), { via: [at([C.KEYB[0] + 7, -48, 0])], tone: "lo" });

// ---------- 组装（由远及近） ----------

const STEPS = buildSteps();
const first = STEPS[0];
const blocks = [0, 1, 2]
  .map((i) => `<g data-block="${i}"><g data-move transform="${translateAlong(P, [C.HOME, 0, C.LEVEL * i])}">${blockSvg(i, first.h[i], false)}</g></g>`)
  .join("");

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "一条台面流水线，演示 SpecFlow 双层状态机与 System Spec domain 归档。左端料仓里叠着三块 spec 毛坯；规划就绪后人转动第一把钥匙批准计划，change 进入 executing 阶段。滑车每次只载一块，送到压床下实现，再送到千分表下由 QA 量偏差；超出公差就退回压床，修复计数器前进一格，最多两格，用尽后信号旗升起，仅该 spec 进入 decision_required 等人决定。实现中途报告阻塞时，滑车退至挡杆前，挡杆伸出，该 spec 进入 blocked，change 仍保持 executing。通过的块被推上两个 System Spec 域托盘区，三块到齐后人转动第二把钥匙，托盘滑进刻着 system-specs 的双舱归档柜。",
  body: [
    floor(),
    wires(),
    cabinet(),
    guide(20.4),
    part("shutter", shutter(), ' data-copy="back"'),
    guide(93.6),
    pressBack(),
    gaugeBack(),
    towerBack(),
    gatePost(-1),
    `<g clip-path="url(#sf-open)">${part("tray", tray())}</g>`,
    rails(),
    part("carriage", carriage()),
    part("blocks", blocks),
    part("shutter", shutter(), ' data-copy="front" style="display:none"'),
    towerFront(),
    part("gate", gatePlate()),
    gatePost(1),
    gateBeam(),
    part("stop", stopBar()),
    stopHousing(),
    part("ram", ram()),
    pressFront(),
    gaugeFront(part("plunger", plunger())),
    part("pusher", pusher()),
    actuators(),
    counter(),
    part("rider", rider()),
    keyBox(C.KEYA, "keyA"),
    keyBox(C.KEYB, "keyB"),
    mast(),
    part("flag", flag()),
  ],
});

// ---------- 页面脚本 ----------

const live = `{
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify(C)};
${blockSvg.toString()}
${needleD.toString()}
${keyD.toString()}
${buildSteps.toString()}
const root = document.querySelector('[data-figure="specflow-line"]');
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const all = (name) => [...svg.querySelectorAll('[data-part="' + name + '"]')];
const one = (name) => all(name)[0];
const el = { carriage: one("carriage"), ram: one("ram"), plunger: one("plunger"), needle: one("needle"), pusher: one("pusher"), gate: one("gate"), keyA: one("keyA"), keyB: one("keyB"), rider: one("rider"), flag: one("flag"), stop: one("stop"), tray: one("tray"), shutters: all("shutter"), blocks: one("blocks") };
const readout = root.querySelector("[data-readout]");
const stepLine = root.querySelector("[data-step]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const steps = buildSteps();
const S = { car: C.HOME, ram: C.RAM_UP, plg: C.PLG_UP, push: 0, keyA: 0, gateA: 0, att: 0, flag: 0, stop: 0, keyB: 0, shut: 0, tray: 0 };
const B = [0, 1, 2].map((i) => {
  const wrap = svg.querySelector('[data-block="' + i + '"]');
  return { wrap, move: wrap.firstElementChild, x: C.HOME, y: 0, z: C.DECK + C.LEVEL * i, h: C.BLANK, a: 1, loc: "s" + i, on: null, ride: false, fade: false, drawnH: C.BLANK, drawnLit: false, clipped: false };
});
let flagLit = false, stopLit = false, idx = 0, jumped = false, dwell = 0, settled = false, gaugeOn = false, calm = false;
let frame = 0, last = 0, visible = false, touring = !still.matches, idleTimer = 0, order = "012";
const go = (value, target, tau, dt, eps) => {
  if (calm || value === target) return target;
  const next = value + (target - value) * (1 - Math.exp(-dt / tau));
  return Math.abs(target - next) < eps ? target : next;
};
function readoutText(st) {
  let text = st.phase;
  if (st.hold && st.sp >= 0) text += " [spec " + (st.sp + 1) + ": " + st.hold + "]";
  else if (st.sp >= 0) text += " · spec " + (st.sp + 1) + "/3: " + st.spSt;
  if (st.att) text += " · 修复 " + st.att + "/" + C.MAX;
  if (gaugeOn) {
    const dev = S.plg - C.DECK - C.NOMINAL;
    text += " · 偏差 " + (dev >= 0 ? "+" : "") + dev.toFixed(1);
  }
  return text;
}
function advance(dt) {
  const st = steps[idx];
  const carAt = (x) => Math.abs(S.car - x) < 0.05;
  const arrived = carAt(st.car);
  S.keyA = go(S.keyA, st.keyA, 0.11, dt, 0.02);
  const gateT = st.keyA ? (S.keyA > 0.9 ? 1 : 0) : (Math.abs(S.car - C.GATE) > 14 ? 0 : 1);
  S.gateA = go(S.gateA, gateT, 0.17, dt, 0.012);
  const ramT = st.ram != null && arrived && st.car === C.PRESS ? C.DECK + st.ram : C.RAM_UP;
  S.ram = go(S.ram, ramT, 0.13, dt, 0.05);
  const riding = B.find((b) => b.loc === "c" && b.on === "c");
  const plgT = st.plg && arrived && st.car === C.GAUGE && riding ? C.DECK + riding.h : C.PLG_UP;
  S.plg = go(S.plg, plgT, 0.11, dt, 0.04);
  const pushT = st.push && arrived ? 1 : 0;
  S.push = go(S.push, pushT, 0.17, dt, 0.008);
  const toolsClear = S.ram > C.RAM_UP - 0.2 && S.plg > C.PLG_UP - 0.2 && S.push < 0.02;
  const gateClear = S.gateA > 0.97 || (S.car > C.GATE + 14 && st.car > C.GATE + 14);
  const stopT = st.stop && S.car < C.STOP_X - 14 ? 1 : 0;
  S.stop = go(S.stop, stopT, 0.17, dt, 0.012);
  const stopClear = S.stop < 0.02 || (S.car < C.STOP_X - 14 && st.car < C.STOP_X - 14);
  if (!arrived && toolsClear && gateClear && stopClear) S.car = go(S.car, st.car, 0.19, dt, 0.25);
  S.att = go(S.att, st.att, 0.13, dt, 0.01);
  S.flag = go(S.flag, st.flag, 0.2, dt, 0.008);
  S.keyB = go(S.keyB, st.keyB, 0.11, dt, 0.02);
  const trayMoving = S.tray !== st.tray;
  const shutT = trayMoving ? (st.keyB ? (S.keyB > 0.9 ? 1 : 0) : 1) : st.shut && S.keyB > 0.9 ? 1 : 0;
  S.shut = go(S.shut, shutT, 0.17, dt, 0.012);
  if (trayMoving && S.shut > 0.97) S.tray = go(S.tray, st.tray, 0.2, dt, 0.008);
  const face = C.PUSH_FACE - C.PUSH * S.push;
  let blocksSettled = true;
  B.forEach((b, i) => {
    const loc = st.loc[i], hT = st.h[i];
    if (b.loc !== loc) {
      if (jumped) b.fade = true;
      b.ride = !jumped && b.loc === "c" && b.on === "c" && loc === "t";
      b.loc = loc;
      b.on = null;
    }
    const target = loc === "c" ? [S.car, 0, C.DECK] : loc === "t" ? [C.SLOT[i], C.TRAY_Y - C.TRAY_IN * S.tray, C.DECK] : [C.HOME, 0, C.DECK + C.LEVEL * Number(loc[1])];
    const near = () => Math.hypot(b.x - target[0], b.y - target[1], b.z - target[2]) < 0.3;
    const ease = (tau) => { b.x = go(b.x, target[0], tau, dt, 0.02); b.y = go(b.y, target[1], tau, dt, 0.02); b.z = go(b.z, target[2], tau, dt, 0.02); };
    if (b.fade) {
      b.a = go(b.a, 0, 0.07, dt, 0.03);
      if (b.a === 0) { b.x = target[0]; b.y = target[1]; b.z = target[2]; b.h = hT; b.fade = false; b.on = loc === "c" || loc === "t" ? loc : null; }
      blocksSettled = false;
      return;
    }
    b.a = go(b.a, 1, 0.1, dt, 0.03);
    if (loc === "c") {
      if (b.on !== "c") { ease(0.12); if (near()) b.on = "c"; }
      if (b.on === "c") { b.x = S.car; b.y = 0; b.z = C.DECK; }
    } else if (loc === "t") {
      if (b.on === "t") { b.x = target[0]; b.y = target[1]; b.z = target[2]; }
      else if (b.ride && st.push && st.car === C.SLOT[i]) {
        b.x = S.car;
        b.y = Math.min(b.y, face - 8);
        if (b.y <= C.TRAY_Y + 0.01) { b.y = C.TRAY_Y; b.on = "t"; b.ride = false; }
      } else { ease(0.16); if (near()) b.on = "t"; }
    } else {
      b.x = go(b.x, target[0], 0.16, dt, 0.02);
      b.y = go(b.y, target[1], 0.16, dt, 0.02);
      if (target[2] >= b.z || S.car > C.HOME + 26 || carAt(C.HOME)) b.z = go(b.z, target[2], 0.12, dt, 0.02);
    }
    const underRam = loc === "c" && b.on === "c" && carAt(C.PRESS);
    if (underRam) b.h = Math.max(hT, Math.min(b.h, S.ram - C.DECK));
    if (Math.abs(b.h - hT) < 0.005) b.h = hT;
    const waitsForRam = loc === "c" && st.ram != null && st.car === C.PRESS && b.h > hT;
    if (b.h !== hT && !waitsForRam) b.h = go(b.h, hT, 0.1, dt, 0.01);
    const here = loc === "c" || loc === "t" ? b.on === loc : b.x === target[0] && b.y === target[1] && b.z === target[2];
    if (!here || b.h !== hT || b.a !== 1) blocksSettled = false;
  });
  jumped = false;
  gaugeOn = Boolean(st.plg) && plgT !== C.PLG_UP && S.plg === plgT;
  settled = blocksSettled && arrived && S.keyA === st.keyA && S.gateA === gateT && S.ram === ramT && S.plg === plgT && S.push === pushT && S.att === st.att && S.flag === st.flag && S.stop === stopT && stopT === (st.stop ? 1 : 0) && S.keyB === st.keyB && S.shut === shutT && S.tray === st.tray && shutT === (st.shut ? 1 : 0) && (!st.plg || plgT !== C.PLG_UP);
}
function draw() {
  const st = steps[idx];
  const move = (node, by) => node.setAttribute("transform", translateAlong(P, by));
  move(el.carriage, [S.car - C.HOME, 0, 0]);
  move(el.ram, [0, 0, S.ram - C.RAM_UP]);
  move(el.plunger, [0, 0, S.plg - C.PLG_UP]);
  el.needle.setAttribute("d", needleD((S.plg - C.DECK - C.NOMINAL) / C.PER_TURN));
  move(el.pusher, [0, -C.PUSH * S.push, 0]);
  move(el.gate, [0, 0, C.GATE_LIFT * S.gateA]);
  el.keyA.setAttribute("d", keyD(C.KEYA, S.keyA));
  el.keyB.setAttribute("d", keyD(C.KEYB, S.keyB));
  move(el.rider, [C.RIDER_STEP * S.att, 0, 0]);
  move(el.flag, [0, 0, C.FLAG_LIFT * S.flag]);
  if (S.flag > 0.5 !== flagLit) { flagLit = !flagLit; el.flag.querySelectorAll(".sf-flag").forEach((node) => node.toggleAttribute("data-lit", flagLit)); }
  move(el.tray, [0, -C.TRAY_IN * S.tray, 0]);
  move(el.stop, [0, -C.STOP * S.stop, 0]);
  if (S.stop > 0.5 !== stopLit) { stopLit = !stopLit; el.stop.querySelectorAll(".sf-stop").forEach((node) => node.toggleAttribute("data-lit", stopLit)); }
  el.shutters.forEach((node) => {
    move(node, [0, 0, C.SHUT_LIFT * S.shut]);
    node.style.display = (node.dataset.copy === "front") === S.tray > 0.5 ? "" : "none";
  });
  B.forEach((b, i) => {
    const lit = st.lit === i && !b.fade;
    if (b.h !== b.drawnH || lit !== b.drawnLit) { b.move.innerHTML = blockSvg(i, b.h, lit); b.drawnH = b.h; b.drawnLit = lit; }
    move(b.move, [b.x, b.y, b.z - C.DECK]);
    b.wrap.style.opacity = b.a === 1 ? "" : b.a.toFixed(2);
    const clip = b.on === "t" && S.tray > 0;
    if (clip !== b.clipped) { clip ? b.wrap.setAttribute("clip-path", "url(#sf-open)") : b.wrap.removeAttribute("clip-path"); b.clipped = clip; }
  });
  const sorted = [0, 1, 2].sort((p, q) => depthOf([B[p].x, B[p].y, B[p].z], P) - depthOf([B[q].x, B[q].y, B[q].z], P));
  if (sorted.join("") !== order) { sorted.forEach((i) => el.blocks.appendChild(B[i].wrap)); order = sorted.join(""); }
  const text = readoutText(st);
  if (readout.textContent !== text) readout.textContent = text;
}
function announce() {
  const st = steps[idx];
  const label = readoutText(st);
  stepLine.textContent = "步骤 " + (idx + 1) + "/" + steps.length + " · " + st.note;
  stage.setAttribute("aria-valuenow", String(idx + 1));
  stage.setAttribute("aria-valuetext", label + "：" + st.note);
}
function goTo(next) {
  if (next === idx) return;
  jumped = Math.abs(next - idx) !== 1 || Boolean(next > idx ? steps[next].fresh : steps[idx].fresh);
  idx = next;
  const st = steps[idx];
  if (jumped && !st.keyA && (S.car - C.GATE) * (st.car - C.GATE) <= 0 && S.car !== st.car) S.car = st.car;
  dwell = 0;
  settled = false;
  announce();
  run();
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  calm = still.matches;
  advance(dt);
  draw();
  if (touring && settled) {
    dwell += dt;
    if (dwell >= steps[idx].dwell) goTo((idx + 1) % steps.length);
  }
  frame = 0;
  if (visible && (touring || !settled)) frame = requestAnimationFrame(tick);
}
function run() { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } }
function hold() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; dwell = 0; run(); }, 5000);
}
const take = (next) => { hold(); goTo(next); run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("click", () => take((idx + 1) % steps.length));
stage.addEventListener("pointermove", (event) => { if (event.pointerType === "mouse") hold(); });
stage.addEventListener("keydown", (event) => {
  let next = null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " " || event.key === "Enter") next = (idx + 1) % steps.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, idx - 1);
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = steps.length - 1;
  if (next === null) return;
  event.preventDefault();
  take(next);
});
announce();
draw();
}`;

// ---------- 卡片、样式与输出 ----------

const body = k
  .plateHtml({
    fig: "Fig 1",
    title: "SpecFlow 检验线",
    hint: "点击或按 → 单步 · ← 回退",
    readout: first.phase,
    keys: [
      { mark: "lit", label: "持有租约的 spec：轨道上同一时刻只有它一块" },
      { mark: "raised", label: "两把钥匙：计划与归档都要人批准" },
      { mark: "edge", label: `千分表上的弧：公差 ±${C.TOL}，超出即打回` },
      { mark: "dim", label: "挡杆与信号旗只挂在单个 spec 上（executing 内），托盘分区对应 System Spec 域" },
    ],
    caption: `第一圈：change 经 planning → awaiting_plan_approval → executing；三个 spec 毛坯高 ${C.BLANK}，目标高 ${C.NOMINAL}。spec 2 实现到一半报告 blocked，挡杆伸出而 phase 仍保持 executing，人 resolve 后重新派发，再被打回一次才通过；spec 3 用尽 ${C.MAX} 次自动修复仍超差，信号旗升起，仅该 spec 进入 decision_required 等人决定。三块依次落入左（共享 Domain A）与右（独立 Domain B）两个托盘区，经 validate 预演合并、人转动第二把钥匙后滑进归档柜。第二圈：另一次变更同样被阻塞，人决定取消，闸门落下，柜子里什么都没进。`,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="SpecFlow 检验线：右方向键或空格前进一步，左方向键回退，Home 回到开头" aria-valuemin="1" aria-valuemax="${STEPS.length}" aria-valuenow="1" aria-valuetext="${first.phase}：${first.note}">${svg}</div>`,
  })
  .replace('<figcaption class="iso-legend">', `<figcaption class="iso-legend"><span class="sf-step" data-step aria-live="polite">步骤 1/${STEPS.length} · ${first.note}</span>`);

const lightTokens = k.ISO_CSS.match(/\.iso\[data-theme="light"\]\{([^}]*)\}/)[1];
const sfLight = "--sf-cav:#cdcdc9;--sf-cav-wall:#d8d8d4;--sf-cav-floor:#e4e4e0;";
const css = `${k.ISO_CSS}
.sf-fig{--sf-cav:#090909;--sf-cav-wall:#0c0c0c;--sf-cav-floor:#101010}
.sf-fig[data-theme="light"]{${sfLight}}
@media (prefers-color-scheme:light){.iso.sf-fig:not([data-theme]){${lightTokens}${sfLight}}}
.sf-fig .sf-cav{fill:var(--sf-cav)}
.sf-fig .sf-cav-wall{fill:var(--sf-cav-wall)}
.sf-fig .sf-cav-floor{fill:var(--sf-cav-floor)}
.sf-fig .iso-stage{cursor:pointer;touch-action:pan-y;outline:none;-webkit-tap-highlight-color:transparent}
.sf-fig .iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.sf-fig .sf-step{color:var(--anatomy-text);font-family:var(--anatomy-mono);font-size:12px}
.sf-fig [data-block]{will-change:opacity}
`;

const kitSource = readFileSync(join(HERE, "..", "kit", "iso-kit.mjs"), "utf8");
const kitScript = kitSource.slice(0, kitSource.indexOf("const PAGE_CSS")).replace(/^export /gm, "");
const script = `<script type="module">${(kitScript + live).replace(/<\/(script)/gi, "<\\/$1")}</script>`;
const fragment = (theme) => `<div class="iso sf-fig" data-figure="specflow-line"${theme ? ` data-theme="${theme}"` : ""}><style>${css}</style>${body}${script}</div>\n`;

const preview = (theme) =>
  `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SpecFlow 检验线</title><style>*{box-sizing:border-box}body{margin:0;background:${theme === "light" ? "#fbfaf7" : "#151412"};font:16px/1.75 system-ui,sans-serif}main{max-width:720px;margin:0 auto;padding:40px 20px}</style></head><body><main>${fragment(theme)}</main></body></html>`;

if (process.argv.includes("--preview")) {
  writeFileSync(join(HERE, "specflow-line.html"), preview("dark"));
  writeFileSync(join(HERE, "specflow-line-light.html"), preview("light"));
}
const outDir = join(HERE, "..", "..", "src", "figures");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "specflow-line.html"), fragment(""));
console.log(`wrote ${STEPS.length} steps, fragment ${(Buffer.byteLength(fragment("")) / 1024).toFixed(1)} KB`);
