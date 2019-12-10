# Getting Started

## 安装

`npm install --save-dev jest`

## 简单使用

让我们开始为一个假设函数编写测试，该函数将两个数字相加。
首先，创建一个 sum.js 文件：

```
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

然后，创建一个名为 sum.test.js 的文件。 这将包含我们的实际测试：

```
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

将下面的配置部分添加到你的 package.json 里面：
```
{
  "scripts": {
    "test": "jest"
  }
}
```

最后，运行 `npm run test` ，Jest 将打印下面这个消息：

```
./sum.test.js
  √ adds 1 + 2 to equal 3 (4ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.699s
Ran all test suites.
```

## 使用 Babel

如果需要使用 Babel，可以通过 npm 来安装所需的依赖。

`npm install --save-dev babel-jest @babel/core @babel/preset-env`

然后可以在工程的根目录下创建一个 babel.config.js 文件用于配置与你当前 Node 版本兼容的 Babel：
```
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
```
