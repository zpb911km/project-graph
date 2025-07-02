// app/src/utils/retext.tsx
import { invoke } from "@tauri-apps/api/core";

// 异步函数来读取和解析转换表
const loadReplaceSheet = async () => {
  try {
    const response = await invoke<Promise<string>>("read_replace_sheet");
    const text = response;
    const replaceSheet: { [key: string]: string } = {};
    // 解析文件内容
    text.split("\n").forEach((line) => {
      if (line.trim() && !line.startsWith("#")) {
        const [from, to] = line.split("~~~");
        replaceSheet[from] = to;
      }
    });

    return replaceSheet;
  } catch {
    console.error("Failed to load replace sheet");
    return {};
  }
};

// 异步函数来替换文本
export const retext = async (text: string) => {
  const replaceSheet = await loadReplaceSheet();

  for (const [from, to] of Object.entries(replaceSheet)) {
    // 转义正则表达式中的特殊字符
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedFrom, "g"); // 全局替换
    text = text.replace(regex, to.replace(" \\n", "").replace("\n", ""));
  }
  console.log(text);
  return text;
};
