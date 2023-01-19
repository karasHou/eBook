"use strict";
/**
 * 生成HTML的目录
 */
// 默认路径当前文件
const targetDir = process.argv.slice(3, 4) || "../";
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  
</body>
</html>
`;
