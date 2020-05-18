---
title: '리액트 기본개념 다시잡기'
date: '2020-05-15T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/react_basic/'
category: 'react'
description: '리액트 기본개념을 정리하며 다시잡자'
tags:
  - 'react'
---

## 리액트 기본개념 다잡기

리액트를 처음 접하면서 공식 문서 및 여러 강의영상과 책을 구매해서 학습을 했었는데, 다시 처음 기본내용부터 보면서 제대로 숙지하지 못했던 내용들이 보였다.
다시한번 되새길겸 정리하기로 하였다.

### 여러 프레임워크의 아키텍쳐 패턴

여러 다른 프레임워크들은 MVC패턴으로 모델-뷰-컨트롤러 이렇게 나뉘는 아키텍쳐를 사용하며 MVVM 모델-뷰-뷰 모델, MVW 모델-뷰-왓애버 아키텍쳐로 어플리케이션을 구조화 한다. 공통적으로 모델과 뷰가 있는데, 모델은 어플리케이션에서 사용하는 데이터를 관리하는 영역이고 뷰는 사용자에게 직접 보이는 부분이다. 프로그램이 사용자에게 어떤 작업을 받으면 컨트롤러는 모델 데이터를 조회하거나 수정하고, 변경된 사항을 뷰에 반영한다.

### 리액트의 View 패턴

리액트에서는 데이터가 변할 때마다 어떤 변화를 주는것이 아닌 기존 뷰를 날리고 처음부터 새로 렌더링하는 방식이다. 따라서 어플리케이션의 구조가 간단해지고, 코드의 양도 줄어든다. 변화에 신경쓰지 않고, 뷰가 어떨지만 생각하며 선언하고 정해진 규칙에 따라 새로 렌더링한다.
리액트는 구조가 MVC,MVVM인 프레임워크와 달리 오직 V 뷰만 신경쓰는 라이브러리이다.

### 렌더링

어떠한 프레임워크를 사용하던 초기 렌더링이 필요하다. 리액트에서는 render함수로 이를 관리한다. 렌더 함수는 컴포넌트가 어떻게 생겼는지 정의하는 역할을 하며 html 형식의 문자열을 반환하지 않고 뷰가 어떻게 생겼고 어떻게 작동하는지에 대한 정보를 지닌 객체를 반환한다. 컴포넌트 내부에는 또다른 컴포넌트가 들어갈 수 있으며 render함수를 실행하면 그 내부에 있는 컴포넌트들도 재귀적으로 렌더링한다. 렌더링 작업이 끝나면 지니고 있는 정보들을 이용해 HTML마크업을 만들고 실제 페이지의 DOM요소에 주입한다.

#### 조화과정

리액트에서 업데이트는 조화 과정을 거친다(reconciliation) 컴포넌트에서 데이터에 변화가 있을때 뷰가 변형되는 것처럼 보이지만 새로운 요소로 갈아 끼우는것. 이 작업도 render함수의 역할이다.
컴포넌트는 업데이트를 했을 때 단순히 업데이트한 값을 수정한 것이 아니라 새로운 데이터를 가지고 render함수를 다시 호출한다. render함수가 반환하는 결과는 바로 DOM에 반영되는것이 아니라 이전에 render함수가 만들었던 컴포넌트 정보와 현재 render함수가 만든 컴포넌트 정보를 비교한다. ---> virtualDOM관련 DOM자체는 느리지 않다. 다만 브라우저에서 DOM에 변화가 일어나면 웹 브라우저가 CSS를 다시 연산하고, 레이아웃을 구성하고, 페이지를 다시 그린다. 이 과정에서 시간이 허비되는것

## JSX

JSX는 자바스크립트의 확장 문법이며 XML과 비슷하게 생겼다. 이 형식으로 작성된 코드는 브라우저에서 실행되기 전에 코드가 번들링 하는 과정에서 바벨을 사용하여 일반 자바스크립트의 형태로 변환된다.

### 장점

1. 보기 쉽고 익숙하다
   일반 자바스크립트만 사용한 코드와 JSX로 작성한 코드를 비교해보면 JSX를 사용한 쪽이 가독성이 높고 작성하기도 쉽다고 느껴진다. 이것이 JSX를 사용하는 주된 이유

2. 높은 활용도
   JSX에서는 div나 span같은 HTML태그를 사용할 수 있을 뿐만 아니라, 컴포넌트 까지 JSX안에서 작성이 가능하다.

### 문법

1. 감싸인 요소
   컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다.

   ```jsx
   import React from 'react'

   const App = () => {
     return (
       <div>안녕</div>
       <div>감싼요소가 없다</div>
     )
   }

   export default App
   ```

   이렇게 코드를 작성하게되면 오류가 난다. 하나의 부모로 감싸져있찌않기 때문에

```jsx
import React, {Fragment} from 'react'

const App = () => {
  return (
    <Fragment>
     <div>안녕</div>
     <div>감싼요소가 없다</div>
    <Fragment>
  )
}

export default App
```

불필요한 DOM을 생성하지 않고 Fragment를 사용해서 감쌀 수 있다. 다음과 같이 작성도 가능하다.

```jsx
import React, {Fragment} from 'react'

const App = () => {
  return (
  <>
    <div>안녕</div>
    <div>감싼요소가 없다</div>
  <>
)
}

export default App
```

2. 자바스크립트 표현
   JSX안에서는 자바스크립트 표현식을 쓸 수 있다. JSX 내부에서 자바스크립트 표현식을 작성하려면 코드를 {}로 감싼ㄷ다.

   ```jsx
   import React, {Fragment} from 'react'

   const App = () => {
    const name = '재영'

    return (
     <>
       <div>안녕</div>
       <div>내 이름은 {name}이야</div>
     <>
   )
   }

   export default App
   ```

3) 연산자 사용
   JSX내부의 자바스크립트 표현식에서 if문을 사용할 수 없다. 조건에 따라 다른 내용을 렌더링할떄에는
   if문으로 사전에 값을 설정하거나 {}안에 삼항(조건부) 연산자를 사용한다.

   ```jsx
   import React, { Fragment } from 'react';

   const App = () => {
     const name = '재영';

     return (
       <div>
         {name === '재영' ? <h1>재영이다</h1> : <h1>재영이가 아니다</h1>}
       </div>
     );
   };

   export default App;
   ```

   또한 AND 연산자(&&)를 사용이 가능하다.

   ```jsx
   import React, { Fragment } from 'react';

   const App = () => {
     const name = '재영';

     return <div>{name === '재영' && <h1>재영이다</h1>}</div>;
   };

   export default App;
   ```

   false나 null을 렌더링 할때는 아무것도 나타나지 않는다. 단 0인경우 화면에 나타나며 만약 컴포넌트에서 아무것도 리턴하지 않으면 nothing was returned라는 에러가 나타나니 주의할것.  
   or 연산자로 오류 방지

   ```jsx
   import React, { Fragment } from 'react';

   const App = () => {
     const name = undefined;

     return name || '값이 언디파인드 이다.';
   };

   export default App;
   ```
