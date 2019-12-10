// beforeEach(() => {
//   console.log('初始化数据')
// });

// afterEach(() => {
//   console.log('一次测试结束，清除数据')
// });

// beforeAll(() => {
//   console.log('开始测试')
// });

// afterAll(() => {
//   console.log('结束测试')
// });

// test('测试：1+1=2', () => {
//   expect(2 === (1+1)).toBeTruthy();
// });

// test('测试：1+2=3', () => {
//   expect(3 === (1+2)).toBeTruthy();
// });


// 作用域 顶级的 beforeEach 在 describe 块级的 beforeEach 之前被执行
// beforeAll(() => console.log('顶级的 - beforeAll'));
// afterAll(() => console.log('顶级的 - afterAll'));
// beforeEach(() => console.log('顶级的 - beforeEach'));
// afterEach(() => console.log('顶级的 - afterEach'));
// test('', () => console.log('顶级的 - test'));
// describe('Scoped / Nested block', () => {
//   beforeAll(() => console.log('块级的 - beforeAll'));
//   afterAll(() => console.log('块级的 - afterAll'));
//   beforeEach(() => console.log('块级的 - beforeEach'));
//   afterEach(() => console.log('块级的 - afterEach'));
//   test('', () => console.log('块级的 - test'));
// });


// desribe和test块的执行顺序
// 先处理describe，然后依次处理test块
// describe('outer', () => {
//   console.log('describe outer-a');

//   describe('describe inner 1', () => {
//     console.log('describe inner 1');
//     test('test 1', () => {
//       console.log('test for describe inner 1');
//       expect(true).toEqual(true);
//     });
//   });

//   console.log('describe outer-b');

//   test('test 1', () => {
//     console.log('test for describe outer');
//     expect(true).toEqual(true);
//   });

//   describe('describe inner 2', () => {
//     console.log('describe inner 2');
//     test('test for describe inner 2', () => {
//       console.log('test for describe inner 2');
//       expect(false).toEqual(false);
//     });
//   });

//   console.log('describe outer-c');
// });
