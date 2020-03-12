---
title: '자바스크립트 promise'
date: '2020-03-13T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/front_promise/'
category: 'javascript'
description: '스터디. 비동기, promise, async/await에 대해'
tags:
  - 'javascript'
---

자바스크립트 비동기 처리에 대해 알아보며 promise, async / await 개념 정리를 해보자

## promise란?

프로미스는 자바스크립트 비동기 처리에 사용되는 객체이다. 비동기 처리를 먼저 알아보자.

## 비동기 처리

비동기 처리란 단순히 특정 코드의 연산이 끝날 때까지 기다리고 다음 코드를 읽는게 아니라 다음 코드를 먼저 실행하는 자바스크립트의 특성을 의미한다.

### 비동기 처리의 예

```js
console.log('첫번째콘솔');

setTimeout(function() {
  console.log('두번쨰콘솔');
}, 3000);

console.log('세번째콘솔');
```

- '첫번째콘솔' 출력
- '세번째콘솔' 출력
- '두번째콘솔' 출력

setTimeout함수도 비동기 방식으로 실행되기 때문에 setTimeout을 실행하고 결과를 기다리지 않고 바로 다음 세번째콘솔로 넘어갔다.  
이러한 비동기 처리의 문제를 해결하기 위해 콜백함수를 이용 하였다.  
하지만 콜백의 콜백의 콜백... 콜백을 중첩해서 쓰게되면 가독성도 떨어지고 로직을 바꾸기도 어려워진다. 그래서 콜백 지옥이라고 부른다.  
콜백 지옥 해결방법은?? Promise나 Async사용

### promise의 상태에 대하여

프로미스의 기본적인 개념 상태. 즉 처리과정을 의미한다.

- Pending(대기)
- Fulfilled(이행)
- Rejected(실패)

#### Pending(대기)

비동기 처리 로직이 완료되지 않은 상태이다.

```js
new Promise(); // new Promise() 메소드를 호출하면 대기 상태가 된다.

new Promise(function(resolve, reject) {
  //
});
```

메소드르 호출할 때 콜백 함수를 선언할 수 있으며 콜백의 인자는 resolve, reject를 받는다.

#### Fulfilled(이행)

```js
new Promise(function(resolve, reject) {
  resolve();
});
```

콜백 함수의 첫 번째 인자인 resolve를 호출하면 이행 상태가 된다.  
이행 상태가 되면 then()을 이용하여 결과값을 받는다.

```js
function getResult() {
  return new Promise(function(resolve, reject) {
    var data = 100;
    resolve(data);
  });
}
// resolve()의 결과 data를 resolvedData로 받는다.
getResult().then(function(resolvedData) {
  console.log(resolvedData); // 100
});
```

이행 상태를 다른말로 표현한다면 완료라고 할 수 있다.

### Rejected(실패)

```js
function getResult() {
  return new Promise(function(resolve, reject) {
    reject(new Error('Error'));
  });
}

getResult().catch(function(err) {
  console.log(err); // 삐빅 Error
});
```

코랙 함수의 두 번째 인자인 reject를 호출하면 실패 상태가 된다. 실패 상태가 되면 catch()로 결과를 받을 수 있다.

### 에러 처리 방법

서비스를 구현하다 보면 네트워크 연결, 서버 문제 등으로 오류가 발생할 수 있다.  
에러 처리 방법에는 2가지 방법이 있다.

#### then()의 두 번째 인자로 에러를 처리하는 방법

```js
getData().then(handleSuccess, handleError);
```

#### catch()를 이용하는 방법

```js
getData()
  .then()
  .catch();
```

가급적 catch로 에러를 처리하는 방법이 권장된다.  
이유는?? 두번째 인자로 에러를 처리하면 then()의 첫 번째 콜백 함수 내부에서 오류가 나는 경우 오류를 제대로 잡아내지 못하기 때문이다.

### async / await

async await는 자바스크립트의 비동기 처리 패턴이며 콜백 함수와 프로미스의 단점을 보완해준다.

```js
function fetchFunc() {
  var user = fetchUser(url, function(user) {
    if (user.id === 1) {
      console.log(user.name);
    }
  });
}
```

fetchUser가 서버에서 데이터를 받아오는 http통신 코드라고 가정한다면 콜백을 사용해야 실행 순서를 보장 받을 수 있다.  
기본 문법

```js
async function 함수이름() {
  await 비동기 처리 메서드명()
}
```

함수 앞에 async를 붙이고 함수 내부에 http통신을 하는 비동기 처리 코드 앞에 await를 붙인다. 비동기 처리 메소드가 프로미스 객체를 반환해야 await가 의도한대로 동작한다.  
async await를 적용한 예

```js
async function fetchFunc() {
  var user = await fetchUser(url, function(user) {
    if (user.id === 1) {
      console.log(user.name);
    }
  });
}
```

확실히 콜백에 비해 가독성이 좋은걸 확인할 수 있다.

### 이해를 돕는! 간단한 예제 더 살펴보기

```js
function fetchItems() {
  return new Promise(function(resolve, reject) {
    var items = [1, 2, 3];
    resolve(items);
  });
}

async function logItems() {
  var resultItems = await fetchItems();
  console.log(resultItems); // [1,2,3]
}
```

fetchItem()함수는 프로미스 객체를 반환하며 fetchItems() 함수가 실행하면 프로미스가 이행되며 결과 값은 items 배열이 된다.

### 실용 예제

```js
function fetchUser() {
  var url = 'https://jsonplaceholder.typicode.com/users/1';
  return fetch(url).then(function(response) {
    return response.json();
  });
}

function fetchTodo() {
  var url = 'https://jsonplaceholder.typicode.com/todos/1';
  return fetch(url).then(function(response) {
    return response.json();
  });
}

async function logTodoTitle() {
  var user = await fetchUser();
  if (user.id === 1) {
    var todo = await fetchTodo();
    console.log(todo.title); // delectus aut autem
  }
}
```

1. fetchUser()시 사용자 정보 호출
2. 아이디가 1이면 할 일 정보 호출
3. 콘솔 출력

확실히 콜백 프로미스에 비해 가독성이 좋다.

### 예외 처리

```js
async function func() {
  try {
    const abc = await fetchFunc();
    console.log(abc);
  } catch (e) {
    console.log(e);
  }
}
```

try 시 catch도 작성을 해줘야한다.  
주로 then위주로 사용했었는데 async await도 많이 적용을 해봐야 할것 같다.
async await는 가독성도 굉장히 좋고 코드이해와 사용법도 어렵지 않은것 같다.
프로젝트를 진행하다보면 비동기 작업을 처리할 일이 많은데 잘모르고 사용했던것들에 대해 이해가 조금 더 된 듯 하다. 헷갈릴때마다 찾아봐야겠다.  
캡틴판교님의 프로미스와 비동기 처리 블로그글을 참고하였습니다.
