---
title: "[].slice.call(arguments)와 Array.from()"
date: "2019-11-11T05:46:32.169Z"
template: "post"
draft: true
slug: "/posts/array-from/"
category: "JavaScript"
tags:
  - "java-script"
---
[].slice.call(arguments)와 Array.from()는
유사배열이나 iterable object를 배열로 만들어주는 문법이다.

----
## TL;DR

이 문법을 100% 이해하고 싶으면, 아래의 개념에 익숙해야 한다.
- arguments 키워드
- array-like (유사배열)
- iterable object
- call 메서드
- context 변환

즉, 아직 모르고 사용해도 된다는 말.
하지만, 사용하다가 문자게 생기면, 위의 키워드로 검색해보고 `아! 이래서 이렇구나` 깨닳으면 된다.


### 사용 예
공부하다 아래의 코드를 봤다.
이제까지는 사용한 적 없는 코드이다.

```js
function promisify() {
  const args = [].slice.call(arguments);
  args.push( //이하 생략
}
```
처음엔 arguments 를 copy 하려는 구문인가 생각했다.
하지만 그런 경우라면 훨씬 쉬운 방법이 많았을 것이다.
검색해보았더니 나름 qna와 블로그가 보인다.

그 동안 arguments를 사용하면서 index로 접근하였으므로 당연히 배열이라고 생각했다.

#### arguments에 대한 개념 몇 가지
- arguments는 유사배열 객체이다. 함수 내에서만 사용할 수 있는 키워드 이며(=정의하지 않고 사용),
인자로 넘어오는 값의 정보를 가지고 있다.
- `유사배열`이란, 배열은 아니지만 length property를 가지며, 0부터 시작하는 property가 있어서 index로 접근할 수 있는 자료구조를 의미한다.
~~(그동안 length와 값 접근만 했으니, 딱히 배열이 아닐거라는 생각이 없었다)~~
- es6의 arrow function일 경우에는 사용할 수 없다.
- arrow function이 아닐 경우에도, 굳이 유사 배열로 사용하여 관리를 어렵게 하지 말고, rest parameter 로 사용하는 것을 권장한다.
    ```js
    // rest parameter 예제
    function sum(...theArgs) {
      return theArgs.reduce((previous, current) => {
        return previous + current;
      });
    }
    ```

#### [].slice.call(arguments)
`결론: 객체인 arguments를 배열로 만들기 위한 구문`

[].slice까지는 함수를 반환한다. 모든 함수는 call 메서드를 갖고 있다.
call 메서드는 context 를 변환해서 함수(slice)를 호출해주는 것이라고 생각하면 된다.
    - slice 메서드가 호출될 때, slice 메서드는 call()의 인자인 object의 this를 바라본다.

즉, 이 문법은,
배열의 slice 메서드를 사용했으나 array-like인 arguments 객체를 바라보게 되어
0 부터 시작하는 propery 값을 참조하여 새로운 배열을 만들어 낸다.

#### Array.from()
es6에 배열에 from() 메서드가 추가 되었다.
Array.from()를 사용할 수 있다는 말은 ES6 환경이라는 말이고,
그렇다면 rest paramater를 사용하면 되니까 arguments를 Array.from()로 감쌀 이유는 없다.

유사배열이나 iterable object를 배열로 만들어주는 메서드이므로 다른 용도로 사용하면 된다.
(iterator는 꽤나 깊은 스터디를 했기 때문에 블로그를 작성한줄 알았는데 없다.
언젠간 추가 예정..)

참고로 string도 유사배열이다. length property를 가지며, 0부터 index로 접근할 수 있기 때문이다.
```js
console.log(Array.from('foo'));
```

객체 같은 경우, property 이름만 0, 1 등의 index처럼 사용하면 안되고,
legnth 프로퍼티가 꼭 있어야 한다.
```js
console.log(Array.from({ 0:1, 1: 'yeri', length: 2 }));
```


