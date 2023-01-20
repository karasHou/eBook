/**
 * 生成HTML的目录
 */

import path from "path";
import { readdir, writeFile } from "fs"


// 默认路径当前文件
const targetDir = process.argv.slice(3, 4)[0] || "./src/";

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
  <title>how-browsers-work</title>
</head>

<body>
  $$$
</body>
</html>
`

// process.cwd()：当前执行终端命令的目录
const nowWorkPath = path.resolve(process.cwd(), targetDir);


function readFile(path: string) {
  readdir(path, (err, fileList) => {
    if (err !== null) {
      console.log('error');
    } else {
      console.log('当前目录文件');
      console.log(fileList);
      // 只包含.html
      writeContent(fileList.filter((file) => (/\.html$/i.test(file))))
    }
  })

}

/**
 * 写入html文件
 * @param fileList 
 */
function writeContent(fileList: string[]) {
  let str = "";

  fileList.forEach((file) => {
    const anchorStr = `<a href="./src/${file}" target="_blank" rel="noopener noreferrer">${file}</a><br/>
    `;
    str += anchorStr;
  })

  writeFile('index.html', template.replace('$$$', str), (err) => {
    if (err) {
      console.log('出现错误');
      console.log(err);
    } else {
      console.log('生成成功');
    }
  })

}


readFile(nowWorkPath)
