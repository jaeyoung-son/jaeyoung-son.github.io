---
title: '프론트 스터디 클로저'
date: '2020-03-12T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/front_closure/'
category: 'javascript'
description: '스터디. 클로저에 대해'
tags:
  - 'javascript'
---

클로저 파헤치기

## closure

일단 closure 사전적 의미로는 폐쇠란다. 무엇을 폐쇠한다는건지는 잘 모르겠지만 한번 보다 보면 이래서 이름이 클로저구나 느낌이 온다.  
클로저는 자바스크립트에서 함수가 가지는 여러 특징들로 인해 생겨나는 특별한 함수이다. 아주 혼란스럽지만 동시에 아주 유용한 개념.
그렇기에 정리를 해보자  
함수에서 이전에 배웠던 스코프 개념을 적용할때

```js
function func() {
  var value = '재영이';
}
```

func함수 안에 선언된 변수 value는 함수스코프의 변수이기에 바깥에서 value로 접근해도 값 '재영이'를 조회할 수 없고 함수 바깥에 value를 선언해도, 안쪽의 value에는 영향을 주지 못한다.  
자바스크립트에서 함수는 1급이다. 1급이란 함수가 다른 값들과 똑같이 값으로서 취급되는게 가능하다는 것이다. 그렇기에 함수는 리턴값으로 함수를 리턴하는것이 가능하다.

```js
function func() {
  var value = '재영이';

  function consoleValue() {
    console.log(value);
  }

  return consoleValue;
}

const result = func(); // func의 리턴값을 result변수에 할당
result(); // '재영이'
```

재영이값이 들어있는 value변수는 함수스코프 변수기에 외부에 노출되지 않는 값이었다. 함수 result는 함수스코프 바깥에 있지만 안쪽값에 접근할수 있는 상태가되었다. 함수스코프안의 변수에 외부에서 접근할 수 있게 해주는 함수를 클로저라고한다.

### 클로저 활용하기

```js
const makeClosure = initialValue => {
  const innerValue = initialValue;

  const getValue = () => {
    return innerValue;
  };

  return getValue;
};
```

makeClosure함수는 하나의 인자를 받고 받은 값으로 innerValue라는 변수에 담은다음에 같은함수스코프인 getValue함수만이 innerValue에 접근이 가능하다

```js
const getInnerValue = makeClosure('안녕 클로저야');

getInnerValue(); // === '안녕 클로저야'
innerValue; // error
```

이렇게 함수 내부의 값을 조회하는것 뿐아니라 값을 수정할수도 있다

```js
const makeClosure = initialValue => {
  let innerValue = initialValue;

  const getValue = () => {
    return innerValue;
  };

  const setValue = nextValue => {
    innerValue = nextValue;
  };

  return {
    get: getValue,
    set: setValue
  };
};

const innerData = makeClosure('첫번째값');
innerData.get(); // === '첫번째값'
innerData.set('바뀐값');
innerData.get(); // === '바뀐값'
```

setValue라는 함수를 만들어 인자로 들어온 값으로 innverValue의 값을 대체했다. 값을 읽는 것과 수정하는 것 두 함수를 내보내기 위해 함수가 담긴 객체를 리턴하였다.

```js
var count = (function() {
  var staticCount = 0;
  return function() {
    var localCount = 0;
    return {
      increase: function() {
        return {
          static: ++staticCount,
          local: ++localCount
        };
      },
      decrease: function() {
        return {
          static: --staticCount,
          local: --localCount
        };
      }
    };
  };
})();

var counter = count();
var counter2 = count();
console.log(counter.increase()); // { static: 1 , local: 1}
console.log(counter.increase()); // { static: 2 , local: 2}
console.log(counter2.decrease()); // { static: 1 , local: -1}
console.log(counter.increase()); // { static: 2 , local: 3}
```

count 함수 안에 있는 변수 staticCount 와 count함수가 return하는 함수에 선언된 localCount 변수가 있다.
count함수가 리턴하는 함수 기준으로 staticCount 변수는 스코프 밖에 있으므로 counter1과 counter2가 값을 공유한다. 하지만 리턴함수내 선언된 localCount는 각각의 지역변수를 갖고 각각의 값을 가진다.

### 클로저의 장단점

이와같이 클로저는 함수스코프 내에서 변수를 숨기면서 밖에서도 접근할 수 있게 해주기에 전역변수를 사용하지않고 유용하게 쓸 수 있다. 하지만 장점만 있을순 없고 단점이 있을것이다.  
클로저의 단점이란???

- 클로저는 메모리를 소모한다
  setTimeout이나 이벤트에 대한 콜백함수 등으로 등록했던 함수들이 메모리에 계속 남아있게 되면, 클로저도 같이 메모리에 계속 남아있게 된다. 그렇기에 루프돌면서 클로저를 생성하는 설계는 지양해야한다.
- 스코프 생성과 이후 변수 조회에 따른 퍼포먼스 손해가 있다.
  클로저의 하위에 있는 함수에서 상위에 있는 변수에 접근하고자 할 때 클로저로 생성한 스코프를 탐색해야 하는 문제가 있다. 최근 자바스크립트 엔진들이 이러한 스코프 체인 내의 변수 탐색에 대한 최적화를 하고있어서
  스코프 체인이 하나나 두 개이면 큰 차이는 없다고 하나 과하게 사용하면 퍼포먼스에 영향을 미친다.

* 클로저에 익숙하지 않은사람이면 이해하기 어렵다

오늘 클로저에 대해 공부를 해보았다. 처음에는 생소하고 어려웠지만 기본적인 느낌은 오는듯하다.
함수 스코프 내에서 변수를 선언하고 그 함수 내에서 변수에 접근하고 접근하는것을 함수에서 리턴해서 밖에서 조회나 수정을 한다. 스코프 체인이나 이런개념은 아직 이해가 잘 되지 않는다. 공부할것이 참 많다. 열심히해야겠다.
