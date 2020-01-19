---
title: "redux_practice"
date: "2020-01-15T10:43:32.169Z"
template: "post"
draft: false
slug: "/posts/redux_practice/"
category: "redux"
description: "리덕스 연습"
tags:
  - "redux"
---

## 리덕스 준비하기
#### 리덕스를 사용할 때 가장 많이 사용하는 패턴은 프레젠테이셔널 컴포넌트와 컨테이너 컴포넌트를 분리하는 것이다. 여기서 프레젠테이셔널 컴포넌트란 주로 상태 관리가 이루어지지 않고, 그저 props를 받아와서 화면에 보여주기만 하는 컴포넌트를 말한다. 컨테이너 컴포넌트는 리덕스와 연동도어 있는 컴포넌트로, 리덕스로부터 상태를 받아 오기도 하고 리덕스 스토어에 액션을 디스패치 하기도 한다.
##### (코드의 재사용성도 높이고 관심사의 분리가 이루어져 UI를 작성할 때 좀 더 집중할 수 있다)
## 액션 타입, 액션 생성 함수, 리듀서 코드 작성 준비
### 파일구조
* #### actions, constants, reducers라는 세 개의 디렉토리를 만들고 그 안에 기능별로 파일을 하나씩 만드는 방식 코드를 종류에 따라 다른 파일에 작성하여 정리할 수 있어서 편리하지만, 새로운 액션을 만들 때마다 세 종류의 파일을 모두 수정해야 하기 때문에 불편하기도 하다 가장 기본적인 사용방식
* #### Ducks 패턴 -- 액션 타입, 액션 생성 함수, 리듀서 함수를 기능별로 파일 하나에 몰아서 작성하는 방식이며 일반적인 구조로 리덕스를 사용하다가 불편함을 느낀 개발자들이 자주 사용함

### 액션 타입 정의하기
```jsx
const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";
```
#### 가장 먼저 해야할 작업은 액션 타입을 정의하는 것이다. 타입은 대문자로 정의하고 문자열 내용은 '모듈 이름/액션 이름'과 같은 형태로 작성한다. 나중에 프로젝트가 커졌을 때 액션의 이름이 충돌되지 않게 해주기 위함
### 액션 생성 함수 만들기
```jsx
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });
```
#### export 함으로써 추후 이 함수를 다른 파일에서 불러와 사용할 수 있다.
### 초기 상태 및 리듀서 함수 만들기
```jsx
const initialState = {
  number: 0
};

function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return {
        number: state.number + 1
      };
    case DECREASE:
      return {
        number: state.number - 1
      };
    default:
      return state;
  }
}

export default counter;
```
#### 초기 상태에 number값을 설정 해주고 리듀서 함수에는 현재 상태를 참조하여 새로운 객체를 생성해서 반환하는 코드를 작성함.

#### createStore 함수를 사용하여 스토어를 만들 때는 리듀서를 하나만 사용해야 한다. 리듀서를 여러 개 만들 경우 리덕스에서 제공하는 combineReducers라는 유틸 함수를 사용하여 합쳐 준다
```jsx
import { combineReducers } from "redux";
import counter from "./counter";
import todos from "./todos";

const rootReducer = combineReducers({
  reducer1,
  reducer2
});

export default rootReducer;
```
### 스토어 만들기 및 provider 컴포넌트를 사용하여 프로젝트에 리덕스 적용하기
```jsx
...
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./modules";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```
#### 리액트 컴포넌트에서 스토어를 사용할 수 있도록 컴포넌트를 react-redux에서 제공하는 Provider컴포넌트로 감싸 주고 store를 props로 전달해 주어야 한다.
### connect함수 사용하기
```jsx
import React from "react";
import Counter from "../components/Counter";
import { connect } from "react-redux";

const CounterContainer = ({ number, increase, decrease }) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

const mapStateToProps = state => ({
  number: state.counter.number
});

const mapDispatchToProsp = dispatch => ({
  increase: () => {
    console.log("increase");
  },
  decrease: () => {
    console.log("decrease");
  }
});

export default connect(mapStateToProps, mapDispatchToProsp)(CounterContainer);
```
mapStatetoProps는 리덕스 스토어 안의 상태를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수이고, mapDispatchToProps는 액션 생성 함수를 컴포넌트의 props로 넘겨주기 위해 사용하는 함수이다. connect함수를 호출하고 나면 또 다른 함수를 반환하는데, 반환된 함수에 컴포넌트를 파라미터로 넣어 주면 리덕스와 연동된 컴포넌트가 만들어진다.
#### mapStateToProps는 state를 파라미터로 받아오는데, 이 값은 현재 스토어가 지니고 있는 상태를 가리키며 mapDispatchToProps의 경우 store의 내장 함수 dispatch를 파라미터로 받아온다.