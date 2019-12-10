# Setup and Teardown(设置和拆卸)

写测试的时候你经常需要在运行测试前做一些准备工作，和在运行测试后进行一些整理工作。 Jest 提供辅助函数来处理这个问题。

## 为多次测试重复设置

如果你有一些要为多次测试重复设置的工作，你可以使用 beforeEach 和 afterEach。

例如，我们考虑一些与城市信息数据库进行交互的测试。 你必须在每个测试之前调用方法 initializeCityDatabase() ，同时必须在每个测试后，调用方法 clearCityDatabase()。 你可以这样做：

```
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

beforeEach 和 afterEach 能够通过与 异步代码测试 相同的方式处理异步代码 — — 他们可以采取 done 参数或返回一个 promise。 例如，如果 initializeCityDatabase() 返回解决数据库初始化时的 promise ，我们会想返回这一 promise︰

```
beforeEach(() => {
  return initializeCityDatabase();
});
```

## 一次性设置

在某些情况下，你只需要在文件的开头做一次设置。 This can be especially bothersome when the setup is asynchronous, so you can't do it inline.(当设置为异步时，这尤其麻烦，因此您不能在一行内进行) Jest 提供 beforeAll 和 afterAll 处理这种情况。

例如，如果 initializeCityDatabase 和 clearCityDatabase 都返回了 promise ，城市数据库可以在测试中重用，我们就能把我们的测试代码改成这样:

```
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

## 作用域

默认情况下，before 和 after 的块可以应用到文件中的每个测试。 此外可以通过 describe 块来将测试分组。 当 before 和 after 的块在 describe 块内部时，则其只适用于该 describe 块内的测试。

例如，我们不仅有一个城市数据库，而且还有一个食品数据库。 我们可以为不同的测试进行不同的设置：

```
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 sausage', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

注意，顶级的 beforeEach 在 describe 块级的 beforeEach 之前被执行。 这可能有助于说明所有钩子的执行顺序。

```
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});


// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

## desribe和test块的执行顺序

Jest 会在所有真正的测试开始之前执行测试文件里所有的 describe 处理程序（handlers）。 这是在 before* 和 after* 处理程序里面 （而不是在 describe 块中）进行准备工作和整理工作的另一个原因。 当 describe 块运行完后,，默认情况下，Jest 会按照 test 出现的顺序（译者注：原文是in the order they were encountered in the collection phase）依次运行所有测试,，等待每一个测试完成并整理好，然后才继续往下走。

考虑以下示例测试文件和输出：

```
describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });

  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });

  console.log('describe outer-c');
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```

## 通用建议

如果测试失败，第一件要检查的事就是，当仅运行这条测试时，它是否仍然失败。 To run only one test with Jest, temporarily change that test command to a test.only:

```
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});
```

如果你有一个测试，当它作为一个更大的用例中的一部分时，经常运行失败，但是当你单独运行它时，并不会失败，所以最好考虑其他测试对这个测试的影响。 通常可以通过修改 beforeEach 来清除一些共享的状态来修复这种问题。
