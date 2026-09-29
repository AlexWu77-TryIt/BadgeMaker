#!/usr/bin/env node
// 資料防護：Claude 每次使用工具前執行。命中規則時以 exit 2 擋下，並把原因回報給 Claude。
// 只檢查「路徑」與「指令」，不檢查文件內容，所以撰寫說明文件不受影響。
// 規則：
//   1. 路徑含 data/real 資料夾，或路徑中含「真實」「正式資料」 → 擋下
//   2. 涉及 xlsx / xls / xlsm / csv 資料檔，但檔名不是以「假資料_」或「範本_」開頭 → 擋下
//   3. 以萬用字元搜尋資料檔，但範圍不限於 data/fake 或 templates → 擋下

const BANNED_WORDS = ["真實", "正式資料"];
const REAL_DIR = /(^|\/)data\/real(\/|$)/i;
const DATA_EXT = /\.(xlsx|xlsm|xls|csv)$/i;
const ALLOWED_NAME = /^(假資料_|範本_)/;
const SAFE_SCOPE = /(^|\/)(data\/fake|templates)(\/|$)/;

function norm(s) { return String(s || "").replace(/\\/g, "/"); }

function checkPath(p) {
  p = norm(p).replace(/^["'`]+|["'`,;)]+$/g, "");
  if (!p) return null;
  if (REAL_DIR.test(p)) return "涉及禁止讀取的 data/real 資料夾";
  const word = BANNED_WORDS.find((w) => p.includes(w));
  if (word) return "路徑含禁用字詞「" + word + "」：" + p;
  const base = p.split("/").pop();
  if (DATA_EXT.test(base)) {
    if (base.includes("*")) {
      if (!SAFE_SCOPE.test(p)) return "以萬用字元搜尋資料檔，範圍不限於 data/fake 或 templates：" + p;
    } else if (!ALLOWED_NAME.test(base)) {
      return "資料檔「" + base + "」的檔名不是以「假資料_」或「範本_」開頭";
    }
  }
  return null;
}

function tokensOf(cmd) {
  return norm(cmd).split(/[\s"'`=<>|;&()]+/).filter(Boolean);
}

function check(toolName, input) {
  input = input || {};
  const paths = [];
  for (const k of ["file_path", "notebook_path", "path"]) if (input[k]) paths.push(input[k]);
  if (toolName === "Glob" && input.pattern) paths.push((input.path ? norm(input.path) + "/" : "") + input.pattern);
  if (toolName === "Grep" && input.glob) paths.push((input.path ? norm(input.path) + "/" : "") + input.glob);
  if (toolName === "Bash" && input.command) paths.push(...tokensOf(input.command));
  for (const p of paths) {
    const r = checkPath(p);
    if (r) return r;
  }
  return null;
}

module.exports = { check, checkPath };

if (require.main === module) {
  let raw = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    let evt;
    try { evt = JSON.parse(raw); } catch { process.exit(0); }
    const reason = check(evt.tool_name, evt.tool_input);
    if (reason) {
      process.stderr.write(
        "【資料防護】已擋下這個動作：" + reason +
        "\n本專案只允許使用 data/fake/ 內以「假資料_」開頭的檔案，以及 templates/ 內以「範本_」開頭的空白範本。" +
        "\n員工的真實資料請放在專案資料夾外，由使用者自行在瀏覽器中操作工具。若確認是假資料，請先依規則改名。\n"
      );
      process.exit(2);
    }
    process.exit(0);
  });
}
