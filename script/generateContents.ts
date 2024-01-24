import { resolve, join } from 'path';
import { readdir, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

// 定义路径常量
const SRC_DIRECTORY = './src/';
const DIRECTORY_PATH = './directory';
const INDEX_FILE_NAME = 'index.html';
const HTML_EXTENSION = '.html';

// 获取目标目录
const targetDir = process.argv.slice(3, 4)[0] || SRC_DIRECTORY;
const dirPath = resolve(process.cwd(), DIRECTORY_PATH);
const nowWorkPath = resolve(process.cwd(), targetDir);

// HTML模板
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/browse/reset.css@2.0.2/reset.css">
  <style>
    a,
    a:link,
    a:visited,
    a:hover,
    a:active {
      text-decoration: none;
      color: inherit;
    }

    a {
      color: #0e7490;
      text-decoration: none;
      font-weight: 500;
      box-shadow: inset 0 -0.125em 0 0 #fff, inset 0 -0.375em 0 0 rgb(165 243 252 / 40%);
      display: inline-block;
      transition: transform ease 0.1s;
      transform-origin: left;
    }

    a:hover {
      transform: scale(1.05);
    }

  </style>
  <title>eBooks</title>
</head>

<body>
  $$$
</body>
</html>
`;

// 生成锚点标签函数
function getAnchorTag(href: string, text: string): string {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a><br/>`;
}

// 确保目录存在的函数
function ensureDirectoryExists(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

// 生成目录HTML文件的函数
async function generateDirHtml(path: string): Promise<string[]> {
  try {
    const fileDir = await readdir(path);
    ensureDirectoryExists(dirPath);
    const fileDirStr = fileDir
      .map((file) => getAnchorTag(join(DIRECTORY_PATH, `${file}${HTML_EXTENSION}`), file))
      .join('');
    await writeFile(resolve(process.cwd(), INDEX_FILE_NAME), template.replace('$$$', fileDirStr));
    console.log('目录索引生成成功。');
    return fileDir;
  } catch (error) {
    console.error('生成目录索引时出错：', error);
    throw error;
  }
}

// 生成项目HTML文件的函数
async function generateProjectHtml(projectName: string, projectPath: string): Promise<void> {
  try {
    const projectHtmlList = (await readdir(projectPath)).filter((file) => file.endsWith(HTML_EXTENSION));
    const fileDirStr = projectHtmlList
      .map((pFile) => getAnchorTag(join('..', SRC_DIRECTORY, projectName, pFile), pFile))
      .join('');
    await writeFile(resolve(dirPath, `${projectName}${HTML_EXTENSION}`), template.replace('$$$', fileDirStr));
  } catch (error) {
    console.error(`为项目${projectName}生成索引时出错：`, error);
    throw error;
  }
}

// 主函数
(async function main() {
  try {
    // 生成目录 html
    const dirs = await generateDirHtml(nowWorkPath);

    // 生成目录对应的html
    const promisesList = dirs.map((project) => {
      const projectPath = resolve(nowWorkPath, project);
      return generateProjectHtml(project, projectPath);
    });
    await Promise.all(promisesList);
    console.log('所有项目索引均已成功生成。');
  } catch (error) {
    console.error('生成过程中出现错误：', error);
  }
})();
