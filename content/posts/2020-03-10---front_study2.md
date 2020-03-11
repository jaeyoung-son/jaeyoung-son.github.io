---
title: '프론트 스터디 정리하기2'
date: '2020-03-10T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/front_study2/'
category: 'study'
description: '스터디. 변수선언, scope, protoType'
tags:
  - 'study'
---

이번 스터디에는 자바스크립트의 const, let, var의 차이와 scope, 클로저, this의 개념에대해 공부하기로 하였다. 클로져와 this를 보기 전에 프로토타입 개념에 대해 파헤쳐보자.

## scope

스코프란? 한마디로 현재 접근할 수 있는 변수들의 범위.. 즉 범위이다.

### block

block 이란 중괄호로{} 감싸진 것이라고 보면 된다.

함수 내부는 하나의 block 이다

```js
function func() {
  return 'hi';
}
```

for문 내부도 하나의 block 이다

```js
for (let i = 0; i < 10; i++) {
  count++;
}
```

block 내부에서 정의된 변수를 local(지역)변수라고 부른다.

### 전역 scope

block 밖인 전역scope 에서 생성한 변수를 전역변수(global variable) 이라고 한다.

```js
const name = '재영맨';
console.log(name); //재영맨

function returnName() {
  console.log(name); //재영맨
  return name;
}

console.log(returnName()); //재영맨
```

코드 어디에서든 접근이 가능하며 변수값을 확인할 수 있다.

### scope 오염

전역변수를 너무 남용하게되면 프로그램에 문제를 일으킬 수 있다. 전역 변수는 계속 살아있기 때문에 계속 값이 변한다면 해당 변수를 찾기 어렵다. 어디에서 왜 필요한지? 어디에서 선언했는지?

### 좋은 scope 습관

- 코드가 block으로 명확하게 구분되기 때문에 코드 가독성이 올라간다.
- 코드가 한줄한줄 쭉 나열된 것이 아니라 각각의 기능별로 block을 나누면 코드가 이해하기 쉬워진다.
- 나중에 코드를 수정할 일이 있을 때, 코드를 오랜만에 보더라도 잘 나뉘어 있어서 유지보수가 쉬워진다.
- 프로그램이 끝날때까지 변수가 살아있는 것이 아니라서(block이 끝나면 local 변수의 삶이 끝나서 메모리 절약도 된다.

### 스코프의 생성

자바스크립트는 다른 언어와 달리 일반적인 블록 스코프를 따르지 않는다. 특정 구문이 실행될 때 새로 생성한다.

```js
if (true) {
  var a = 1;
}
console.log(a); // 1
```

위와같이 if구문 밖에서도 a값조회가 가능하다.

### 스코프를 생성하는 구문들

- function
- with
- catch

```js
function foo() {
  var b = '보이니?';
}
console.log(b); // error
```

앞의 예에서 if구문에서는 블록 외부에서 내부에 있는 변수에 접근을 할 수 있었지만, 함수 외부에서 내부에 선언된 변수에는 접근할 수 없다.

## const 랑 let이랑 var

변수와 상수 선언..  
기존의 es6이전 자바스크립트는 var키워드로 변수나 상수를 자유롭게 설정할 수 있었지만 es6이후 상수와 변수를 구분할 수 있는 키워드를 추가하였다.  
변경되지 않을 상수는 const키워드로 정의하고 변경될 변수는 let키워드로 정의한다. 이 외에도 var 키워드와 중요한 차이점이 있다 앞서 정리한 scope개념과도 연관된 내용.  
기존 자바스크립트의 블록 개념이 다른 언어와 달리 if나 for의 블록안에서 var키워드로 정의하더라도 외부에서 조회가 가능하였다. 그러나 let과 const는 접근이 불가능하다.

### var와 let키워드를 통한 블록 비교

```js
if (true) {
  var abc = 1;
  let cba = 2;
}

console.log(abc); // 1;
console.log(cba); // error;
```

이뿐 아니라 선언에 있어서도 차이가 있다. var는 한 변수를 여러번 선언해도 문제가 없으나. let과 const는 이미 선언된 변수라며 에러를 표시한다.
개발자의 중복 정의 실수를 잡아줄 중요한 기능이다.

## protoType

프로토타입이란.... 프로토타입의 사전적 의미는 '원형'이다. 자바스크립트는 객체지향 개념을 지원하기 위해 프로토타입을 사용한다. 프로토타입으로 구현할 수 있는 대표적인 객체지향 개념은 상속이다. 일단 프로토타입에 대해 알아보자

### 자바스크립트 에서의 객체생성

es6이전에 자바스크립트는 class가 없기에 함수로 정의하였다.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
var jy = new Person('재영', '26');
console.log(jy.name, jy.age); //// 재영 26
```

객체를 생성할 때 function키워드를 사용하는 방식이 다른 언어와 많은 차이가 있고 이질감이 있기에 객체지향을 조금이라도 더 지원하기 위해 class 키워드를 새로 만들었다.

### 프로토타입에 대한 표준 정의

다른 객체들과 공유되는 속성을 제공하는 객체이다. 셍성자가 객체를 생성할 때, 객체는 내부적으로 생성자의 prototype 속성을 활용하여 속성들의 레퍼런스를 참조한다. 생성자의 prototype 속성은 constructor.prototype과 같은 표현식으로 프로그램 내에서 접근이 가능하고, 객체의 prototype에 추가된 속성은 상속받는 객체들까지 함께 공유된다

### 프로토타입 사용 예

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function() {
  return this.name;
};

Person.prototype.getAge = function() {
  return this.age;
};

var jy = new Person('재영', 26);
var koko = new Person('코코', 5);
console.log(jy.getName()); // 재영
console.log(jy.getAge()); // 26
console.log(koko.getName()); // 코코
console.log(koko.getAge()); // 5
```

위 코드의 5번째 줄에 Person.prototype이 표준 정의중 constructor.prototype로 접근할 수 있다고 한 부분이다.
즉 Person이라는 생성자의 prototype속성을 설정하고 있는 것이다. 이후 새로 생성된
jy와 koko객체는 내부적으로 prototype객체를 참고하여 getName()과 getAge()함수를 사용할 수 있다. 이 내용이 표준에 명시된 생성자를 통해 생성한 객체들이 prototype을 공유한다는 말에 해당한다.

### 객체 생성 후 prototype의 수정 예

```js
Person.prototype.introduce = function() {
  console.log('my name is ' + this.name + ' my age ' + this.age);
};
jy.introduce(); // my name is 재영 my age 26
```

이처럼 생성자를 통해 생성된 객체라도 나중에 생성자의 프로토타입에 새로운 속성을 추가할 수 있고,
추가된 속성 또한 모든 객체가 공유한다. 또한 기존에 선언해 두었던 속성을 다시 수정할 수 있다.  
또한 함수가 아닌 변수도 추가하여 공유할 수 있다.

```js
Person.prototype.gender = 'male';
console.log(jy.gender); // male
console.log(koko.gender); // male
```

이처럼 변수를 공유할 수 있는데 koko객체의 gender변수를 바꾸면 어떻게 될까...

```js
Person.prototype.gender = 'male';
console.log(jy.gender); // male
console.log(koko.gender); // male

koko.gender = 'female';

console.log(jy.gender); // male
console.log(koko.gender); // female
console.log(Person.prototype.gender); // male
```

koko객체의 gender값은 female로 바뀌지만 jy객체과 Person.prototype.gender의 값도 여전히
male로 유지된다. 작동원리는 ECMAScript 표준에 프로토타입과 생성자와의 관계를 자세히 살펴보아야 할것같다.

### 프로토타입의 장단점

프로토타입의 개념은 다소 어렵거나 생소하여 그냥 생성자 안에서 this로 일일이 속성을 추가할 수도 있다.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getName = function() {
    return this.name;
  };
}

var jy = new Person('재영', 26);
console.log(jy.getName()); // 재영
```

이처럼 생성자 안에서 속성을 일일이 부여하고 함수를 사용할 수도 있다.
생성자를 사용하여 많은 객체를 중복해서 사용하려면 프로토타입이 좋고, 생성자를 사용해서 객체를 조금만 생성하면
그냥 속성을 부여하는 것이 낫다고 한다. 그 이유는 프로토타입은 모든 객체가 한 객체를 공유하고 있어서
메모리를 하나만 사용하지만, 생성자 안에서 속성으로 부여하는 방식은 객체를 생성할 때마다
새로운 function을 생성하기 때문이다. 따라서 여러 객체를 생성해야 하는 때는 프로토타입을 사용하는것이
메모리상 유리하다.  
그렇다면 단점은 ????

- 프로토타입의 활용법을 이해하기 힘들다. gender의 예와같은 일반적으로 이해하기 힘든 상황들이 나옴.
- 프로토타입 체인이 많아지거나 속성에 접근하는 횟수가 많이 늘어나게 되면 탐색 시간이 길어진다.

### class와 extends 상속

기존의 new 키워드와 함수가 모호한 기능을 수행하고 있다는 것을 인지하고 es6에서 새로운
키워드로 class와 extends가 생겼다.

```js
class Person {
  constructor() {
    this.name = 'anonymous';
  }
}

class Jy extends Person {
  constructor() {
    super();
    this.name = '재영';
  }
}

var jy = new Jy();
console.log(jy instanceof Person); // true
console.log(jy instanceof Jy); // true
console.log(jy.constructor); // class Jy extends Person
```

이렇게 클래스 개념이 생기면서 자바스크립트에서도 다른 객체지향 언어들과 유사하게
상속을 구현할 수 있게 되었다.

이와같이 scope와 const,let,var 그리고 프로토타입에 대해 공부를 해보았다.  
스코프와 변수선언 쪽은 보면서 이해가 되었지만. 프로토타입은 생소하고 많이 어려웠다. 또한 파면 팔수록
더욱 깊어지기에 온전히 이해하려면 시간이 많이 필요할거같은 느낌이 든다. 적어도 프로토타입이 무엇이고
장점과 단점이 무엇인지 알고 가야겠다.
