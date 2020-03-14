---
title: '타입스크립트 정복기'
date: '2020-03-15T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/typescript_2/'
category: 'typescript'
description: '타입스크립트를 정복하자 + 리액트'
tags:
  - 'typescript'
---

저난번 찾아본 강의한번으로는 머리에 잘 들어오지 않아서 다른 자료를 찾아보았다.
이번에는 벨로퍼트님 블로그를 보며 타입스크립트를 정리해보자.

## 기본타입

값을 선언 할 때 기본 타입 지정하기

```ts
const message: string = '나는 문자열이야';
const done: boolean = true; // 불리언
const numbers: number[] = [1, 2, 3]; // 숫자배열
const messages: string[] = ['문자열', '배열'];

messages.push(1); // 삐빅 에러입니다

let mightBeUndefined: string | undefined = undefined; // 언디파인드나 스트링

let color: 'red' | 'orange' | 'yellow' = 'red';
color = 'green'; // 삐빅 에러에요
```

특정변수의 타입을 지정 할 수 있으며 사전에 지정한 타입이 아닌 값이 설정 될 때 바로 에러가 난다.  
| 는 사용해 or 과 같은 역할을 해준다.

## 함수타입 정의

```ts
function sum(x: number, y: number): number {
  return x + y;
}

sum(1, 2);
```

우측에 인자 뒤에 :number 이는 해당 함수의 결과물이 숫자라는것을 명시한다. 즉 리턴값 다른 값을 반환하면 오류가 난다.

```ts
function sumArray(numbers: num[]): number {
  return numbers.reduce((acc, cureent) => acc + current, 0);
}

const total = sumArray([1, 2, 3, 4, 5]);
```

타입스크립트 장점중 하나가 배열의 내장함수를 사용 할 때에도 타입 유추가 잘 이루어진다는 것!

```ts
fucntion returnNothing(): void {
  //아무것도 리턴 안한다
}
```

함수에서 아무것도 반환하지 않는다면 반환 타입을 void로 설정한다.

## interface

interface란 클래스 또는 객체를 위한 타입을 지정 할 때 사용되는 문법이다.

```ts
interface Shape {
  getArea(): number; // shape 라는 interface는 getArea라는 함수가 꼭 있고 숫자를 반환한다.
}

class Circle implements Shape {
  // implements 키워드로 Shape의 인터페이스를 충족하겠다.
  radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea() {
    return this.radius * this.radius = Math.PI
  }
}

class Rectangle implements Shape {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

  const shapes: Shape[] = [new Circle(5), new Rectangle(10,5)];

  shapes.forEach(shape => {
    console.log(shape.getArea());
  })

```

### 일반 객체 타입 설정하기

```ts
interface Person {
  name: string;
  age?: number; // 물음표가 있으면 설정해도 가능 안해도 가능
}

interface Developer extends Person = {
  skills: string[]
}

const person: Person = {
  name: '사람',
  age: 20
}
const expert: Developer = {
  name: '김개발',
  skills: ['자바스크립트', '리액트']
}

const people: Person[] = [person, experrt]
```

### Type Alias

type은 특정 타입에 별칭을 붙이는 용도 객체, 배열 어떤타입이던 별칭을 지어줄 수 있다.

```ts
type Person = {
  name: string;
  age?: number;
};

// & 는 intersection 으로서 두개 이상의 타입들을 합쳐준다.
type Developer = Person & {
  skills: string[];
};

const person: Person = {
  name: '사람'
};

const expert: Developer = {
  name: '이름',
  skills: ['javascript', 'typescript']
};
```

type 과 interface 겉으로 딱 봤을때 그렇게 큰 차이점은 느껴지지 않았다.  
일관성 있게 쓰는게 중요하며 구버전에서는 차이가 많이 존재했는데 지금은 큰 차이가 없다고 한다 다만 타 라이브러리나 타입 지원 파일을 작성할 때 interface가 권장된다고 하니 interface로 사용하는 습관을 들여야겠다.

### Generics

```ts
function merge<A, B>(a: A, b: B): A & B {
  return {
    ...a,
    ...b
  };
}

const merged = merge({ foo: 1 }, { bar: 2 });
```

제너릭을 사용 할 때는 <T>처럼 꺽쇠 안에 타입의 이름을 넣어서 사용한다.  
제너릭은 어제 동영상 강의 학습할때도 특히 이해가 잘 안되던 부분이었다. 타입을 좀 더 유연하게 다룰 수 있게 도와주는 녀석 같은 느낌.. 일반 타입정의는 이해라고 할 부분도 없긴 했지만 특히 리액트와 합칠때 많이 보이던 형태였는데 타입스크립트와 함께 리액트네이티브를 공부할때도 이녀석이 많이 괴롭혔었다. 빨리 익숙해져서 가지고 놀아야겠다.

```ts
interface Items<T> {
  list: T[];
}

const items: Items<string> = {
  list: ['a', 'b', 'c']
};
```

이제 다음엔 리액트 프로젝트에 타입스크립트 적용방법을 학습해 보고 정리하겠습니당.  
벨로퍼트님의 블로그를 보고 참고하며 정리했습니다.
