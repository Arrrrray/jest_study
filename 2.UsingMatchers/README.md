# 匹配器

## 1. 普通匹配器
最简单的测试值的方法是看是否精确匹配。

```
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```

在此代码中，expect (2 + 2) 返回一个"期望"的对象。 你通常不会对这些期望对象调用过多的匹配器。 在此代码中，.toBe(4) 是匹配器。 当 Jest 运行时，它会跟踪所有失败的匹配器，以便它可以为你打印出很好的错误消息。

toBe 使用 Object.is 来测试精确相等。 如果您想要检查对象的值，请使用 toEqual 代替：

```
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});
```

toEqual 递归检查对象或数组的每个字段。

您还可以测试相反的匹配︰

```
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```

## 2. Truthiness(真实性)

在测试中，你有时需要区分 undefined、 null，和 false，但有时你又不需要区分。 Jest 让你明确你想要什么。

- toBeNull 只匹配 null
- toBeUndefined 只匹配 undefined
- toBeDefined 与 toBeUndefined 相反
- toBeTruthy 匹配任何 if 语句为真
- toBeFalsy 匹配任何 if 语句为假

例如：

```
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});


test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

```

你应该使用匹配器最精确地对应您的代码你想要什么。

## 3. 数字

大多数的比较数字有等价的匹配器。

```
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);


  // toBe and toEqual are equivalent(等价的) for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

对于比较浮点数相等，使用 toBeCloseTo 而不是 toEqual，因为你不希望测试取决于一个小小的舍入误差。

```
test('两个浮点数字相加', () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3);           这句会报错，因为浮点数有舍入误差
  expect(value).toBeCloseTo(0.3); // 这句可以运行
});
```

## 4. 字符串

您可以检查对具有 toMatch 正则表达式的字符串︰

```
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```

## 5. Arrays and iterables

你可以通过 toContain来检查一个数组或可迭代对象是否包含某个特定项：

```
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'beer',
];

test('the shopping list has beer on it', () => {
  expect(shoppingList).toContain('beer');
  expect(new Set(shoppingList)).toContain('beer');
});
```

## 6. 其他

如果你想要测试的特定函数抛出一个错误，在它调用时，使用 toThrow。

```
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(Error);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});
```