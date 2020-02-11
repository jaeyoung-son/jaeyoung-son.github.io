---
title: '미들웨어'
date: '2020-02-10T10:43:32.169Z'
template: 'post'
draft: false
slug: '/posts/middleware/'
category: 'react'
description: '리덕스 미들웨어 적용하기'
tags:
  - 'react'
---

## 미들웨어

리덕스 미들웨어는 액션을 디스패치했을때 리듀서에서 이를 처리하기 전에 지정된 작업들을 실행한다. 미들웨어는 액션과 리듀서 사이의 중간자라고 볼 수 있다.
리듀서가 액션을 처리하기 전에 미들웨어가 액션을 단순히 콘솔에 기록하거나, 전달받은 액션 정보를 기반으로 액션을 취소하거나, 다른 종류의 액션을 추가로 디스패치할 수 있다.

#### 미들웨어 기본구조

```jsx
const loggerMiddleware = store => next => action => {};

export default loggerMiddleware;
```

#### 화살표 함수가 아닌 일반 function

```jsx
const loggerMiddleware = function loggerMiddleware(store) {
  return function(next) {
    return function(action) {};
  };
};
```

미들웨어는 결국 함수를 반환하는 함수를 반환하는 함수이다. 여기에 함수에서 매개변수로 받아오는 store는 리덕스 스토어 인스턴스를, action은 디스패치된 액션을 가리킨다. next파라미터는 함수 형태이며, store.dispatch와 비슷한 역할을 한다. 차이점은 next(action)을 호출하면 그다음 처리해야 할 미들웨어에게 액션을 넘겨주고, 만약 다음 미들웨어가 없다면 리듀서에게 액션을 넘겨준다.
미들웨어 내부에서 store.dispatch를 사용하면 첫 번째 미들웨어부터 다시 처리한다. next를 사용하지 않으면 액션이 리듀서에 전달되지 않는다.

#### 콘솔로 흐름 보기

```jsx
const loggerMiddleware = store => next => action => {
  console.group(action && action.type); // 액션 타입으로 log를 그룹화
  console.log('이전상태', store.getState());
  console.log('액션', action);
  next(action); //다음 미들웨어 혹은 리듀서에게 전달
  console.log('다음 상태', store.getState());
  console.groupEnd(); // 그룹 끝
};

export default loggerMiddleware;
```

#### 미들웨어 스토어에 적용

미들웨어는 스토어를 생성하는 과정에서 적용한다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import loggerMiddleware from './lib/loggerMiddleware';

const store = createStore(rootReducer, applyMiddleware(loggerMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

미들웨어에서는 여러 종류의 작업을 처리할 수 있다. 특정 조건에 따라 액션을 무시하거나, 액션 정보를 가로채서 변경한 후 리듀서에게 전달하거나, 특정 액션에 기반하여 새로운 액션을 여러 번 디스패치할 수도 있다. 이러한 미들웨어 속성을 사용하여 네트워크 요청과 같은 비동기 작업을 관리하면 매우 유용하다.

### 비동기 작업을 처리하는 미들웨어

#### redux-thunk

비동기 작업을 처리할때 가장 많이 사용하는 미들웨어이며
객체가 아닌 함수 형태의 액션을 디스패치할 수 있게 해준다.

#### redux-saga

thunk 다음으로 가장 많이 사용되는 비동기 작업 관련 미들웨어 라이브러리이다. 특정 액션이 디스패치되었을 때 정해진 로직에 따라 다른 액션을 디스패치시키는 규칙을 작성하여 비동기 작업을 처리할 수 있게 해준다.

### 미들웨어 적용

redux-thunk 설치

```
npm install redux-thunk
```

index.js 에 적용

```jsx
import ReduxThunk from 'redux-thunk';

const logger = createLogger();
const store = createStore(rootReducer, applyMiddleware(logger, ReduxThunk));
```

### Thunk 생성 함수 만들기

redux-thunk는 액션 생성 함수에서 일반 액션 객체를 반환하는 대신에 함수를 반환 한다

```jsx
import { createAction, handleActions } from 'redux-actions';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

//1초 뒤에 인크리스 나 디크리스 함수 디스패치
export const increaseAsync = () => dispatch => {
  setTimeout(() => {
    dispatch(increase());
  }, 1000);
};

export const decreaseAsync = () => dispatch => {
  setTimeout(() => {
    dispatch(decrease());
  }, 1000);
};

const initialState = 0;

const counter = handleActions(
  {
    [INCREASE]: state => state + 1,
    [DECREASE]: state => state - 1
  },
  initialState
);

export default counter;
```

컨테이너 변경

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { increaseAsync, decreaseAsync } from '../modules/counter';
import Counter from '../components/Counter';

const CounterContainer = ({ number, increaseAsync, decreaseAsync }) => {
  return (
    <Counter
      number={number}
      onIncrease={increaseAsync}
      onDecrease={decreaseAsync}
    />
  );
};

export default connect(state => ({ number: state.counter }), {
  increaseAsync,
  decreaseAsync
})(CounterContainer);
```

### 웹 요청 비동기 작업 처리하기

#### API 함수화 하기

```jsx
import axios from 'axios';

export const getPost = id =>
  axios.get(`http://jsonplaceholder.typicode.com/post/${id}`);

export const getUsers = id =>
  axios.get(`http://jsonplaceholder.typicode.com/users`);
```

#### 데이터를 받아와 상태를 관리할 리듀서

```jsx
import { handleActions } from 'redux-actions';
import * as api from '../lib/api';

//액션 타입 선언 (한 요청당 세 개를 만들어야함)
const GET_POST = 'sample/GET_POST';
const GET_POST_SUCCESS = 'sample/GET_POST_SUCCESS';
const GET_POST_FAILURE = 'sample/GET_POST_FAILURE';

const GET_USERS = 'sample/GET_USERS';
const GET_USERS_SUCCESS = 'sample/GET_USERS_SUCCESS';
const GET_USERS_FAILURE = 'sample/GET_USERS_FAILURE';

// thunk 함수 생성 thunk 함수 내부에서 시작할 때, 성공했을 때, 실패했을 때 다른 액션 디스패치

export const getPost = id => async dispatch => {
  dispatch({ type: GET_POST }); // 요청 시작 알림
  try {
    const response = await api.getPost(id);
    dispatch({
      type: GET_POST_SUCCESS,
      payload: response.data
    });
  } catch (e) {
    dispatch({
      type: GET_POST_SUCCESS,
      payload: e,
      error: true
    }); // 에러 발생
    throw e; //나중에 컴포넌트단에서 에러를 조회할 수 있게 해줌
  }
};

export const getUsers = () => async dispatch => {
  dispatch({ type: GET_USERS });
  try {
    const response = await api.getUsers();
    dispatch({
      type: GET_USERS_SUCCESS,
      payload: response.data
    });
  } catch (e) {
    dispatch({
      type: GET_USERS_FAILURE,
      payload: e,
      error: true
    });
    throw e;
  }
};

// 초기 상태 선언 요청의 로딩 상태는 loadingd이라는 객체에서 관리

const initialState = {
  loading: {
    GET_POST: false,
    GET_USERS: false
  },
  post: null,
  users: null
};

const sample = handleActions(
  {
    [GET_POST]: state => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: true //요청 시작
      }
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false //요청완료
      },
      post: action.payload
    }),
    [GET_POST_FAILURE]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false // 요청완료
      }
    }),
    [GET_USERS]: state => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: true //요청시작
      }
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false //요청 완료
      },
      users: action.payload
    }),
    [GET_USERS_FAILURE]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false //요청완료
      }
    })
  },
  initialState
);

export default sample;
```

### 데이터 받아와서 렌더링 하기

```jsx
import React from 'react';

const Sample = ({ loadingPost, loadingUsers, post, users }) => {
  return (
    <div>
      <section>
        <h1>포스트</h1>
        {loadingPost && '로딩중...'}
        {!loadingPost && post && (
          <div>
            <h3>{post.title}</h3>
            <h3>{post.body}</h3>
          </div>
        )}
      </section>
      <hr />
      <section>
        <h1>사용자 목록</h1>
        {loadingUsers && '로딩중...'}
        {!loadingUsers && users && (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.username} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Sample;
```

데이터 불러와서 렌더링을 할 때 유효성 검사로 post&&를 사용하면 post 객체가 유효할 때만 내부의 post.title,body의 값을 보여준다

### 컨테이너 컴포넌트 만들기

```jsx
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Sample from '../components/Sample';
import { getPost, getUsers } from '../modules/sample';

// const { useEffect } = React;
const SampleContainer = ({
  getPost,
  getUsers,
  post,
  users,
  loadingPost,
  loadingUsers
}) => {
  useEffect(() => {
    getPost(1);
    getUsers(1);
  }, [getPost, getUsers]);
  return (
    <Sample
      post={post}
      users={users}
      loadingPost={loadingPost}
      loadingUsers={loadingUsers}
    />
  );
};

export default connect(
  ({ sample }) => ({
    post: sample.post,
    users: sample.users,
    loadingPost: sample.loading.GET_POST,
    loadingUsers: sample.loading_GET_USERS
  }),
  {
    getPost,
    getUsers
  }
)(SampleContainer);
```
