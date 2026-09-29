// 資料防護測試：確認防護腳本規則正確，且 repo 內沒有命名不合規的資料檔。
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { check } = require("../.claude/hooks/guard-real-data.js");

const ROOT = path.join(__dirname, "..");
const REAL = "data/" + "real";

test("防護腳本：應擋下的動作", () => {
  const blocked = [
    ["Read", { file_path: REAL + "/人員異動.xlsx" }],
    ["Read", { file_path: "D:\\HR\\員工名冊.xlsx" }],
    ["Read", { file_path: "C:/Users/hr/Desktop/離職原因.csv" }],
    ["Bash", { command: "cat 真實資料.csv" }],
    ["Bash", { command: "ls " + REAL }],
    ["Bash", { command: 'python read.py "滿月回饋 2026.xlsx"' }],
    ["Glob", { pattern: "**/*.xlsx" }],
    ["Grep", { pattern: "王", glob: "*.csv" }],
    ["Read", { file_path: "/share/HR/正式資料/list.txt" }],
    ["Write", { file_path: "data/fake/人員異動.xlsx" }],
  ];
  for (const [tool, input] of blocked) assert.ok(check(tool, input), "應擋下：" + JSON.stringify(input));
});

test("防護腳本：應放行的動作", () => {
  const allowed = [
    ["Read", { file_path: "data/fake/假資料_人員異動.xlsx" }],
    ["Read", { file_path: "templates/範本_行動登錄表.xlsx" }],
    ["Glob", { pattern: "data/fake/*.xlsx" }],
    ["Read", { file_path: "src/core/turnover.js" }],
    ["Write", { file_path: "docs/deployment.md" }],
    ["Bash", { command: "git status" }],
    ["Bash", { command: "node scripts/make-fake-data.js --out data/fake/假資料_人員異動.xlsx" }],
    ["Bash", { command: "node --test tests/" }],
  ];
  for (const [tool, input] of allowed) assert.strictEqual(check(tool, input), null, "應放行：" + JSON.stringify(input));
});

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(path.relative(ROOT, p).split(path.sep).join("/"));
  }
  return out;
}

test("repo 內的資料檔都在允許的位置，且命名合規", () => {
  const bad = walk(ROOT).filter((f) => !f.startsWith(REAL + "/")).filter((f) => /\.(xlsx|xlsm|xls|csv)$/i.test(f)).filter((f) => {
    const base = f.split("/").pop();
    const okFake = f.startsWith("data/fake/") && base.startsWith("假資料_");
    const okTpl = f.startsWith("templates/") && base.startsWith("範本_");
    return !(okFake || okTpl);
  });
  assert.deepStrictEqual(bad, [], "命名或位置不合規的資料檔：" + bad.join("、"));
});

test("data/real 內除了說明檔之外沒有任何檔案", () => {
  const dir = path.join(ROOT, REAL);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f !== "README.md") : [];
  // 只回報數量、不列出檔名，避免檔名本身帶出個資
  assert.strictEqual(files.length, 0, REAL + " 內有 " + files.length + " 個檔案，請移到專案資料夾外");
});
