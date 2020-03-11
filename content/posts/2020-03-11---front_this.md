---
title: '자바스크립트 this란??'
date: '2020-03-11T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/front_this/'
category: 'javascript'
description: '스터디. 자바스크립트에서 디스란 무엇인가요'
tags:
  - 'javascript'
---

간단할것같지만 그렇지 않은 자바스크립트 this... 학습해보자

## this

디스란 무엇인가??  
mdn을 보면 javascript에서 함수의 this 키워드는 다른 언어와는 조금 다르게 동작한다. 또한 엄격 모드와 비엄격 모드에서도 일부 차이가 있다. 대부분의 경우 this의 값은 함수를 호출한 방법이 결정한다. 그래서 ECMAScript5는 함수를 어떻게 호출했는지 상관하지 않고 this값을 설정할 수 있는 bind 메서드를 도입했고, 스스로의 this 바인딩을 제공하지 않는 화살표 함수를 추가했다고 한다.

### this는 현재 실행 문맥이다??

이게 무슨말인가 보면 결국 this를 호출하는게 누구인지와 같다.

```js
console.log(this); // window

const callThis = {
  call: function() {
    console.log(this);
  }
};
callThis.call(); // Object > call function
```

일반적인 전역범위에서 this를 보면 window객체를 가르킨다. callThis 객체내의 함수에서 this를 조회해보면 window를 가르키지 않는다.

### 생성자 함수와 객체에서의 this

생성자란 ? new로 객체를 만들어 사용하는 방식. 객체지향 언어에서 일반적으로 객체를 만들 때 쓰이는 문법과 동일하다.

```js
function NewObject(name, color) {
  this.name = name;
  this.color = color;
  this.isWindow = function() {
    return this === window;
  };
}

const newObj = new NewObject('재영이', '노랑이');
console.log(newObj.name); // 재영이
console.log(newObj.color); // 노랑이
console.log(newObj.isWindow()); // false

const newObj2 = new NewObject('태호', '파랑이');
console.log(newObj2.name); // 태호
console.log(newObj2.color); // 파랑이
console.log(newObj2.isWindow()); // false
```

new 키워드로 새로운 객체를 생성할 경우 생성자 함수 내의 this 는 new를 통해 만들어진 새로운 변수가 된다. newObj와 newObj2는 별도의 객체이기 때문에 각 객체의 속성은 서로 관련이 없다.  
여기서 new 키워드를 빼면 일반 함수와 동일하게 동작하므로 함수내의 this는 window객체를 가르킨다.

```js
const person = {
  name: '재영이',
  age: 26,
  getName: function() {
    return this.name;
  }
};
console.log(person.getName()); //재영이
const otherPerson = person;
otherPerson.name = '재영이변신';
console.log(person.getName()); // 재영이변신
console.log(otherPerson.getName()); // 재영이변신
```

otherPerson의 값을 변경했는데 person의 값도 바뀌었다. otherPerson = person으로 선언했기때문에 person의 레퍼런스 변수이므로 같은값을 참조한다.
이를피하려면 Object.assign()과 같은 얕은 객체복사를 한다.

### call()과 apply()

mdn을보면 this의 값을 한 문맥에서 다른 문맥으로 넘기려면 call() 이나 apply()를 사용하라고 명시되어있다. 아래는 그 예시

```js
// call()이나 apply()의 첫 번째 매개변수로 객체를 제공하면 this가 그 객체에 묶임
var obj = { a: 'Custom' };

// 전역 객체에 속성 지정
var a = 'Global';

function whatsThis() {
  return this.a; // 함수 호출 방식에 따라 값이 달라짐
}

whatsThis(); // 'Global'
whatsThis.call(obj); // 'Custom'
whatsThis.apply(obj); // 'Custom'
```

call 과 apply 를 사용했을때 whatsThis함수를 호출하면 this가 obj객체를 가르키게 된다. 단순 호출시 전역객체를 가르킨다.

### bind메소드

```js
function bindFunc() {
  return this.a;
}

var g = bindFunc.bind({ a: '에이맨' });
console.log(g()); // 에이맨

var h = g.bind({ a: '에이요' });
console.log(h()); // 에이맨 ??? 에이요로 안바뀜 --> 바인드는 한번만사용가능

var o = { a: 37, f: bindFunc, g: g, h: h };
console.log(o.a, o.f(), o.g(), o.h()); // 37 37 "에이맨"  "에이맨"
```

이 결과를 보면 bind는 두번사용해도 의미가 없다는것을 확인할 수 있다.

### 화살표 함수

화살표 함수에서 this는 자신을 감싼 정적 범위이다. 전역 코드에서는 전역 객체를 가리킨다.

```js
var globalObject = this;
var foo = () => this;
function bar() {
  return this;
}

console.log(foo() === globalObject); // true

// 객체로서 메서드 호출
var obj = { func: foo, barFunc: bar };
console.log(obj.func() === globalObject); // true
console.log(obj.barFunc() === globalObject); // false

// call()로 this 설정 시도
console.log(foo.call(obj) === globalObject); // true
console.log(bar.call(obj === globalObject)); // false
// bind()로 this 설정 시도
foo = foo.bind(obj);
bar = bar.bind(obj);
console.log(foo() === globalObject); // true
console.log(bar() === globalObject); // false
```

화살표 함수를 call(), bind(), apply()를 사용해 호출할 때 this의 값을 정해주어도 무시를 한다.  
화살표 함수는 호출 대상에 따라 실행 문맥이 결정되는것이 아니다. 자신을 포함하는 외부 scope에서 this를 받는다. 자신의 this를 만들지 않는다.  
일반 함수는 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정되는 것이 아니고, 함수를 호출할 때 함수가 어떻게 호출되었는지에 따라 this에 바인딩할 객체가 동적으로 결정된다.  
화살표 함수는 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정된다. 동적으로 결정되는 일반 함수와는 달리 화살표 함수의 this 언제나 상위 스코프의 this를 가리킨다. 이를 Lexical this라 한다.

단순히 그냥 일반함수와 화살표함수의 차이만 있는줄 알았던 this였지만 많은경우에 각각 다른 값을 가리키는 this를 확인할 수 있었다.
사용해야할 상황이 있을때 많이 참고하며 사용해야겠다고 느꼈다.

정리를 하다보니 잘못된 정보가 있을수 있으니 있다면 말씀해주세요!  
참조: https://blueshw.github.io/2018/03/12/this/  
mdn
