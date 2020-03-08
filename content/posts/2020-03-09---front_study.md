---
title: '프론트 스터디 정리하기'
date: '2020-03-09T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/front_study1/'
category: 'study'
description: '스터디 내용 정리하기 HTML React'
tags:
  - 'react-native'
---

위코드 수강을 마치고 동기분들과 함께 면접준비도 할겸 부족한 개념도 채울겸 스터디를 진행하기로 하였다. 스터디를 준비하며 정리한 내용을 기록 해보자

## HTML

- #### HTML
  HTML은 Hypertext Markup Language 의 약자이다. HTML이란 웹 페이지를 만들기 위한 언어 이며 웹 브라우저 위에서 동작하는 언어이다. 웹브라우저가 HTML을 읽고 해석해서 웹페이지의 구조를 잡고 렌더링을 해준다. 태그와 태그속의 내용으로 이루어져있고, 태그는 속성을 지정 받는다.
- #### DOM

  DOM 이란 Document Object Model의 약자이며 웹페이지의 HTML을 계층화시켜서 트리구조로 만든 객체 모델이다. 자바스크립트는 이 모델을 통하여 웹페이지에 접근하고 페이지를 수정할 수 있다. (document라는 전역객체를 통해 DOM트리의 root node에 접근한다.)
  HTML/CSS ----- DOM ----- Javascript

- #### 시멘틱마크업

- semantic markup  
  의미론적인 HTML
  시멘틱 마크업이란 적절한 HTML요소를 올바르게 사용하는 것
  시멘틱 마크업을 준수해야 하는 이유

- 검색엔진 최적화  
  사람은 문맥상 제목이 무엇이며 내용이 무엇인지 알아볼 수 있지만 컴퓨터는 그럴 수 없기에 어떤 정보가 어떤 의미를 가지는지 컴퓨터가 잘 알아볼 수 있도록 시멘틱 마크업을 준수하여 작성해야한다.
- 개발능률  
  태그의 이름에서 내용유추가 명확히 된다면 css작업을 할때나 유지보수 함에 있어서 상대적으로 더 편하게 할 수 있다.

* semantic Tag  
  시멘틱태그란 말 그대로 의미를 명확하게 설명해주는 태그이다. 예를들어 form,table,article 태그는 내용을 명확하게 알 수 있다. 반대로 div나 <span>같이 내용을 알 수 없는 태그는 시멘틱 태그가 아니다. 그 외 시멘틱 태그들
  - article
  - aside
  - details
  - footer
  - header
  - main
  - nav
  - section
    등이 있다.

## React

- #### Virtual DOM
  가상돔  
  큰 규모의 웹 어플리케이션에서 DOM에 직접접근하여 변화를 주다보면 성능 이슈가 생긴다. 웹 브라우저에서 DOM에 변화가 일어나면 브라우저가 CSS를 다시 연산하고, 레이아웃을 구성하고, 페이지를 리페인트하면서 이슈가 생김 Virtual DOM방식으로 DOM을 최소한으로 조작하여 DOM 업데이트를 추상화함으로써 개선
  1. 데이터를 업데이트하면 전체 UI를 virtual DOM에 리렌더링 한다.
  2. 이전 Virtual DOM에 잇던 내용과 현재 내용을 비교한다.
  3. 바뀐 부분만 실제 DOM에 적용한다.
- #### Props 및 State

  Props  
  Props란 속성을 나타내는 데이터이다. 리액트가 사용자 정의 컴포넌트로 작성한 요소를 발견하면 JSX 속성을 해당 컴포넌트에 단일 객체로 전달한다 이 객체를 props라고 한다.  
  props는 읽기 전용이다 모든 React 컴포넌트는 자신의 props를 다룰 때 반드시 순수 함수처럼 동작해야 한다.
  State  
  리액트에서 상태, state란 컴포넌트 내부에서 바뀔 수 있는 값을 의미한다. state값을 바꿀때는 setState, set함수를 이용해 바꾼다. 리액트에서는 이 함수가 호출되고 상태값에 변화가 생기면 컴포넌트가 리렌더링 되도록 설계되어있다.

- #### Life Cycle

  ##### 마운트

  DOM이 생성되고 웹 브라우저상에 나타나는 것을 마운트라고한다.

  ##### 마운트 메소드

  constructor: 컴포넌트를 새로 만들 때마다 호출되는 클래스 생성자 메서드  
   getDerivedStateFromProps: props에 있는 값을 state에 넣을 때 사용하는 메서드  
   render: 준비한 UI를 렌더링하는 메서드  
   componentDidMount: 컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드

  ##### 업데이트

  컴포넌트는 4가지 경우에 업데이트를 한다.

  1. props가 바뀔 때
  2. state가 바뀔 때 set
  3. 부모 컴포넌트가 리렌더링될 때
  4. this.forceUpdate로 강제로 렌더링을 트리거할 때

  ##### 업데이트 메소드

  getDerviedStateFromProps: 아운트 과정에서도 호출되고 업데이트가 시작하기 전에도 호출됨
  shouldComponentUpdate: 컴포넌트가 리렌더링을 할지 말지 결정하는 메서드 이 메서드는 true 혹은 false를 반환해야 하며, true를 반환해야 다음 메소드를 계속 실행한다. false를 반환하면 리렌더링되지 않는다.  
   render  
   getSnapshotBeforeUpdate: 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메소드  
   componentDidUpdate: 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메소드.

  ##### 언마운트

  마운트의 반대이며 컴포넌트를 DOM에서 제거하는 것을 언마운트라고 한다.

  ##### 언마운트 메소드

  componentWillUnmount: 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메소드

혹여라도 잘못된 부분이 있을 수 있으니 다른 자료와 같이 참고해주시길 바랍니다
