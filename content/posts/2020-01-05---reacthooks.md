---
title: "React-hooks"
date: "2020-01-05T10:43:32.169Z"
template: "post"
draft: false
slug: "/posts/react-hooks/"
category: "react"
description: "리액트 훅스"
tags:
  - "react"
---

# 리액트 훅스
### Hook는 리액트 v16.8에 새로 도입된 기능으로 함수형 컴포넌트에서도 상태 관리를 할 수 있는 useState, 렌더링 직후 작업을 설정하는 useEffect 등의 기능을 제공하여 기존의 함수형 컴포넌트에서 할 수 없었던 다양한 작업을 할 수 있게 해준다.
## useState
#### useState는 가장 기본적인 Hook이며 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다.
```jsx
import React, { useState } from 'react

const [value, setValue] = useState(0)

<button onClick={() => setValue(value+1)} />
```
#### useState 함수의 파라미터에는 상태의 기본값을 넣어준다 현재 0을 넣어 주었는데 기본값을 0으로 설정하겠다는 의미이다. 이 함수가 호출되면 배열을 반환하고 그 배열의 첫번째 원소는 상태 값, 두번째 원소는 상태를 설정하는 함수이다. 이 함수에 파라미터를 넣어서 호출하면 전달받은 파라미터로 값이 바뀌고 컴포넌트가 정상적으로 리렌더링이 된다.
# useEffect
#### useEffect는 리액트 컴포넌트가 렌더링 될때마다 특정 작업을 수행하도록 설정할 수 있는 Hook이다. 클래스형 컴포넌트의 componentDidMount와 componentDidUpdate를 합친 형태로 보아도 무방하다.
## 마운트될 때만 실행하기
#### useEffect에서 설정한 함수를 컴포넌트가 화면에 맨 처음 렌더링될 때만 실행하고, 업데이트될 떄는 실행하지 않으려면 함수의 두 번째 파라미터로 비어있는 배열을 넣어주면 된다.
```jsx
useEffect(() => {
  console.log('마운트될 때만 실행하기')
},[]);
```
#### 개발자도구의 콘솔을 보면 처음에만 실행되는것을 확인할 수 있다.
## 특정 값이 업데이트될 때만 실행하고 싶을 때
#### useEffect를 사용할 때, 특정 값이 변경될때만 호출하고 싶은 경우가 생길 수 있다. 클래스형 컴포넌트라면 componentDidUpdate를 사용하겠지만 useEffect에서 두 번째 파라미터로 전달되는 배열 안에 검사하고 싶은 값을 넣어 준다,
```jsx
useEffect(() => {
  console.log('재영');
},[재영]);
```
#### 배열 안에는 useState를 통해 관리하고 있는 상태를 넣어주어도 되고, props로 전달받은 값을 넣어주어도 된다....
#### useEffect는 기본적으로 렌더링되고 난 직후마다 실행되며, 두 번째 파라미터 배열에 무엇을 넣는지에 따라 실행되는 조건이 달라진다. 컴포넌트가 언마운트되기 전이나 업데이트 되기 직전에 어떠한 작업을 수행하고 싶다면 useEffect에서 뒷정리(clean up)함수를 반환해 주어야 한다.
```jsx
useEffect(() => {
  console.log('effect');
  return () => {
    console.log('cleanup');
  };
});
```
#### 렌더링될 때마다 뒷정리 함수가 계속 나타나는 것을 콘솔에서 확인할 수 있다. 그리고 뒷정리 함수가 호출될 때는 업데이트되기 직전의 값을 보여준다. 오직 언마운트될 때만 뒷정리 함수를 호출하고 싶다면 useEffect 함수의 두 번째 파라미터에 비어있는 배열을 놓으면 된다.
