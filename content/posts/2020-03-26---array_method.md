---
title: '배열 메소드'
date: '2020-03-26T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/array_method/'
category: 'javascript'
description: '자바스크립트 배열들의 메소드들'
tags:
  - 'javascript'
---

자바스크립트로 프로젝트를 진행하다보면 배열메소드들을 굉장히 많이 사용하게 되는데 머릿속에 항상 남아있지 않아서 찾아보며 사용하곤했다. 정말 많은 분야에서 매우 유용하게 활용되는 배열메소드들을 정복해보자.

## push

push는 해당 배열의 맨 마지막에 요소를 추가한다.

```js
const arr = [1, 2, 3, 4, 5];
arr.push(6);
console.log(arr); // [1,2,3,4,5,6]
```

## pop

해당 배열의 맨 마지막 요소를 제거한다.

```js
const arr = [1, 2, 3, 4, 5];
arr.pop();
console.log(arr); // [1,2,3,4]
```

## unshift

배열의 맨 앞에 요소 하나를 추가한다.

```js
const arr = [1, 2, 3, 4, 5];
arr.unshift(100);
console.log(arr); // [100,1,2,3,4,5]
```

## shift

배열의 맨 앞에 요소 하나를 제거한다.

```js
const arr = [1, 2, 3, 4, 5];
arr.shift();
console.log(arr); // [2,3,4,5]
```

## sort

해당 배열을 재정렬한다. 기본적으로 사전순으로 정렬이 되며, 인자로 함수를 넣음으로써 정렬하는 규칙을 전달해줄 수 있다. 숫자 크기 순서가 아님

```js
const arr = [20, 31, 2, 7, 45, 11];
arr.sort();
console.log(arr); // [11,2,20,31,45,7]
```

배열의 각각의 요소가 문자로 변환된 뒤, 맨 앞자리 부터 사전순으로 정렬을 하는 원리.

```js
const arr = [20, 31, 2, 7, 45, 11];
arr.sort(function(a, b) {
  return a - b;
});
console.log(arr); // [2,7,11,20,31,45]
```

소트함수의 인자로 들어간 콜백함수의 리턴 결과가 0보다 작은경우 a를 b보다 낮은 색인으로 정렬한다. 즉 a가 먼저온다.  
콜백함수가 0을 반환하면 a와 b를 서로 변경하지 않고 모든 다른요소에 대해 정렬한다.  
0보다 클 경우 b를a보다 낮은 인덱스로 정렬한다.
