# Testing Asynchronous Code(测试异步代码)

在JavaScript中执行异步代码是很常见的。 当你有以异步方式运行的代码时，Jest 需要知道当前它测试的代码是否已完成，然后它可以转移到另一个测试。 Jest有若干方法处理这种情况。

## 回调

最常见的异步模式是回调函数。

例如，假设您有一个 fetchData(callback) 函数，获取一些数据并在完成时调用 callback(data)。 You want to test that this returned data is the string 'peanut butter'.

默认情况下，Jest 测试一旦执行到末尾就会完成。 那意味着该测试将不会按预期工作：

```
// 不要这样做！
test('the data is peanut butter', () => {
  function callback(data) {
    expect(data).toBe('peanut butter');
  }

  fetchData(callback);
});
```

问题在于一旦fetchData执行结束，此测试就在没有调用回调函数前结束。

还有另一种形式的 test，解决此问题。 使用单个参数调用 done，而不是将测试放在一个空参数的函数。 Jest会等done回调函数执行结束后，结束测试。

```
test('the data is peanut butter', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }

  fetchData(callback);
});
```

如果 done()永远不会调用，这个测试将失败，这也是你所希望发生的。

## Promises

如果您的代码使用Promise，则有一种更简单的方法来处理异步测试。 从测试中返回一个resolve，Jest将等待该resolve解决。如果resolve被拒绝，则测试将自动失败。

```
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

一定不要忘记把 promise 作为返回值⸺如果你忘了 return 语句的话，在 fetchData 返回的这个 promise 被 resolve、then() 有机会执行之前，测试就已经被视为已经完成了。

如果你想要 Promise 被拒绝，使用 .catch 方法。 请确保添加 expect.assertions 来验证一定数量的断言被调用。 否则一个fulfilled态的 Promise 不会让测试失败︰

```
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => expect(e).toMatch('error'));
});
```

### .resolves / .rejects

您也可以在 expect 语句中使用 .resolves 匹配器，Jest 将等待此 Promise 解决。 如果承诺被拒绝，则测试将自动失败。

```
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```

一定不要忘记把整个断言作为返回值返回⸺如果你忘了return语句的话，在 fetchData 返回的这个 promise 变更为 resolved 状态、then() 有机会执行之前，测试就已经被视为已经完成了。

如果你想要 Promise 被拒绝，使用 .catch 方法。 它参照工程 .resolves 匹配器。 如果 Promise 被拒绝，则测试将自动失败。

```
test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});
```

## Async/Await

或者，您可以在测试中使用 async 和 await。 To write an async test, use the async keyword in front of the function passed to test. 例如，可以用来测试相同的 fetchData 方案︰

```
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

You can combine async and await with .resolves or .rejects.

```
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toThrow('error');
});
```

In these cases, async and await are effectively syntactic sugar for the same logic as the promises example uses.
