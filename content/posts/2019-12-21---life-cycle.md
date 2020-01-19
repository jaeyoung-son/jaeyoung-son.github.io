---
title: "react life-cycle"
date: "2019-12-21T10:43:32.169Z"
template: "post"
draft: false
slug: "/posts/react_life-cycle/"
category: "react"
description: "리액트 라이프사이클"
tags:
  - "react"
---

### 라이프 사이클은 총 세가지 로 나뉜다.
* #### 마운트
* #### 업데이트
* #### 언마운트

## 마운트
#### DOM이 생성되고 웹 브라우저상에 나타나는 것을 마운트 라고 한다.
* ##### constructor: 컴포넌트를 새로 만들 때마다 호출되는 클래스 생성자 메서드.
* ##### getDerviedStateFromProps: props에 있는 값을 state에 동기화하는 메서드.
* ##### render: 준비한 UI를 렌더링하는 메서드.
* ##### componenetDidMount: 컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드.

## 업데이트
### 컴포넌트를 업데이트할 때는 네 가지 경우이다.
* #### props가 바뀔 때
* #### state가 바뀔 때
* #### 부모컴포넌트가 리렌더링될 때
* #### this.forceUpdate로 강제로 렌더링을 트리거할 때

#### 업데이트 메서드
* #### getDerviedStateFromProps: 이 메서드는 마운트 과정에서도 호출하며, props가 바뀌어서 업데이트할 때도 호출한다.
* #### shouldComponentUpdate: 컴포넌트가 리렌더링을 해야 할지 말아야 할지를 결정하는 메서드, 여기서 false를 반환하면 아래 메서드들은 호출하지 않는다.
* #### render: 컴포넌트를 리렌더링한다.
* #### getSnapShotBeforeUpdate: 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드.
* #### componentDidUpdate: 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메서드이다.

## 언마운트
### 마운트의 반대 과정이며 컴포넌트 DOM에서 제거하는 것을 언마운트라고 한다.
* #### componentWillUnmount: 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메서드.


## render() 함수
#### 이 메서드는 컴포넌트 모양새를 정의한다. 컴포넌트에서 가장 중요한 메서드라고 할 수 있으며 라이프사이클 메서드 중 유일한 필수 메서드이다.
#### 이 메서드 안에서 this.props와 this.state에 접근할 수 있으며, 리액트 요소를 반환한다. 이 메서드 안에서는 절대로 state를 변형해서는 안되며, 웹브라우저에 접근해서도 안된다. DOM정보를 가져오거나 변화를 줄 때는 componentDidMount에서 처리해야 한다.

## constructor 메서드
#### 이메서드는 컴포넌트의 생성자 메서드로 컴포넌트를 만들 때 처음으로 실행된다. 이 메서드에서는 초기 state를 정할 수 있다.

## getDervedStateFromProps 메서드
#### 이것은 리액트v16.3 이후에 새로 만든 라이프사이클 메서드이다. props로 받아 온 값을 state에 동기화시키는 용도로 사용하며, 컴포넌트를 마운트하거나 props를 변경할 때 호출한다.
```jsx
static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.value !== prevState.value) { // 조건에 따라 특정 값 동기화
      return { value: nextProps.value };
    }
    return null; // state를 변경할 필요가 없다면 null을 반환
}
```
## componentDidMount 메서드
#### 이것은 컴포넌트를 만들고, 첫 렌더링을 마친 후 실행한다. 이 안에서는 다른 자바스크립트 라이브러리 또는 프레임워크의 함수를 호출하거나 이벤트 등록,setInterval,네트워크 요청 같은 비동기 작업을 처리하면 된다.

## shouldComponentUpdate 메서드
#### 이것은 props 또는 state를 변경했을 때, 리렌더링을 시작할지 여부를 지정하는 메서드이다 반드시 true 또는 false값을 반환해야 한다 이 메서드를 따로 생성하지 않으면 기본적으로 언제나 true값을 반환한다, false를 반환한다면 업데이트 과정은 여기에서 중지된다. 현재 props와 state는 this.props와 this.state로 접근하고, 새로 설정될 props또는 state는 nextProps와 nextState로 접근할 수 있다.

## getSnapshotBeforeUpdate 메서드
#### 리액트 v16.3이후 만든 메서드이며 이 메서드는 render를 호출한 후 DOM에 변화를 반영하기 바로 직전에 호출하는 메서드이다. 여기에서 반환하는 값은 componentDidUpdate에서 세번째 파라미터인 snapshot값으로 전달받을 수 있다. 주로 업데이트 하기 직전의 값을 참고할 일이 있을 때 활용된다(예: 스크롤바 위치 유지)

## componentDidUpdate 메서드
#### 이 메서드는 리렌더링을 완료한 후 실행한다. 업데이트가 끝난 직후이므로 DOM관련 처리를 해도 무방하다. 여기에서는 prevProps 또는 prevState를 사용하여 컴포넌트가 이전에 가졌던 데이터에 접근할 수 있다. getSnapshotBeforeUpdate에서 반환한 값이 있다면 여기에서 snapshot값을 전달받을 수 있다.

## componentWillUnmount 메서드
#### 이것은 컴포넌트를 DOM에서 제거할 때 실행한다. componentDidMount에서 등록한 이벤트,타이머,직접 생성한 DOM이 있다면 여기에서 제거 작업을 해야한다.
