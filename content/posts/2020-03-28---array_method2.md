---
title: '배열 메소드2'
date: '2020-03-28T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/array_method2/'
category: 'javascript'
description: '자바스크립트 배열들의 메소드들2'
tags:
  - 'javascript'
---

이번에는 자주 사용했지만 헷갈리는 부분들이 있는 메소드들 정리해보기

## map 과 filter

map, filter메소드는 인자로 콜백함수를 받는다. 해당 콜백함수는 배열을 순회하면서 각각의 배열 요소의 정보를 받으며 실행된다. 이 콜백함수의 리턴 결과는 map / filter 메소드의 결과물을 결정한다.

### map

배열을 순회하며 얻은 결과들로 이루어진 배열을 리턴하며 변형된 결과물 배열은 기존 배열을 변형한게 아닌 새로운 배열이 된다. 콜백하수의 리턴결과는 새로운 배열에서 각각의 요소가 가지는 값이 된다.

```js
const arr = [1, 2, 3, 4, 5];
const double = arr.map(el => el * 2);
// 요소에 2를 곱하고 리턴하는 함수가 각각의 요소마다 순회됨
console.log(double); // [2,4,6,8,10]

const obj = arr.map((el,i) -> ({
  index: i, // 콜백의 두번째 인자는 배열에서의 각 요소의 인덱스
  value: el // 콜백의 첫번째 인자는 배열의 각 요소의 값
}))

 console.log(obj)
// [
//   {index:0. value:1},
//   {index:1. value:2},
//   {index:2. value:3},
//   {index:3. value:4},
//   {index:4. value:5}
//  ]
```

### filter

배열을 순회하면서 얻은 결과를 각 요소가 새로운 배열에 포함시킬지 제외시킬지 평가한 결과라고 간주한 뒤, 포함시키기로 평가한 요소들로만 이루어진 새 배열을 리턴한다.
필터역시 기존 배열을 변형한게 아닌 새로운 배열이 된다. 콜백함수의 리턴결과는 true/false로 평가되어, 새로운 배열에 포함시킬지 여부에 사용된다.

```js
const arr = [1, 2, 3, 4, 5];
const result = arr.filter(el => el > 2);
//각 요소가 2보다 큰지 결과를 비교하고 리턴
console.log(result); // [3,4,5]
// filter에서 true가 나온 요소들만 새 배열에 포함
```

### reduce

간단히 숫자배열 덧셈하는 메소드로 알고있지만, 복잡한 로직에 활용이 가능한 메소드 처음 학습할때 많이 헷갈리고 어려웠던 메소드이다.
맵과 필터처럼 리듀스도 인자로 콜백함수를 받는다.
콜백함수 외에 두번째 인자로 어떠한 값을 받는데 reduce에서 초기값이라고 한다.

```
arr.reduce(콜백함수,초기값)
```

콜백함수는 맵과 필터처럼 배열의 각 요소의 값과 인덱스를 받을 수 있다. 그보다 먼저 첫번째 인자로 누산기(accumulator)라는 특별한 값을 받는다. 누산기 이후의 인자들은 맵과 필터와 같다.  
참고: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce

```js
const arr = [1, 2, 3, 4];
const reducer = (acc, current) => acc + current;

// 1 + 2 + 3 + 4
console.log(arr.reduce(reducer)); // 10
console.log(arr.reduce(reducer, 5)); // 15 초기값을 5로 설정
```

### 메소드 체이닝

무작위 유리수를 반올림한 뒤, 짝수인 숫자들만 선택하는 로직을 구현한다면

```js
const arr = [2.8, 1.7, 8.33, 3.2];
const arr2 = arr.map(num => Math.round(num));
// arr2 === [3,2,8,3]
const arr3 = arr.filter(num => !(num % 2));
// arr3 === [2,8]
```

변수를 정의하는 코드가 세번씩이나 필요하다.  
배열 접근 메소드들의 리턴 결과물은 배열이다. 그리고 그 배열에서 메소드를 사용하는게 가능 메소드를 연속적으로 사용하기 때문에 이런 형태의 패턴을 메소드 체이닝이라고 한다.

```js
const arr = [2.8, 1.7, 8.33, 3.2]
  .map(num => Math.round(num))
  .filter(num => !(num % 2));
```
