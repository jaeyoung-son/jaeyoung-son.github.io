---
title: '타입스크립트와 리덕스 개선'
date: '2020-04-21T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/ts_redux_refactoring/'
category: 'typescript'
description: '타입스크립트와 리덕스를 깔끔하게 사용하기'
tags:
  - 'typescript'
---

지난번 타입스크립트 + 리덕스로 투두리스트를 만든것을 typesafe-actions라는 라이브러리를 사용하여 더 편한 방법으로 코드를 개선하는 과정.

```
npm install typesafe-actions
```

라이브러리 설치

### counter.ts 리팩토링

src/modules/counter.ts

#### 필요한 함수와 타입 import

```js
import { createAction, ActionType, createReducer } from 'typesafe-actions';
```

3가지 유틸 함수 및 타입을 불러온다. 전버전에서는 createStandardAction이었으나 createAction으로 바뀌었다.

#### 액션 타입 선언할 때 as const 지우기

```ts
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_BY = 'counter/INCREASE_BY';
```

#### createAction으로 액션생성함수 만들기

액션생성함수를 만들 때 createAction을 활용한다.

```ts
export const increase = createAction(INCREASE)();
export const decrease = createAction(DECREASE)();
export const increaseBy = createAction(INCREASE_BY)<number>();
```

액션의 페이로드로 들어가는 값은 제너릭을 사용해 정해주고 페이로드에 아무것도 필요없다면 제너릭을 생략한다.  
가끔 액션생성함수로 파라미터로 넣어주는 값과 페이로드값이 일치하지 않는다면?

```ts
const createItem = (name: string) => ({
  type: CREATE_ITEM,
  payload: { id: nanoid(), name }
});
```

이렇게 작성해준다

```ts
const createItem = createStandardAction(CREATE_ITEM).map(name => ({
  payload: { id: nanoid(), name }
}));
```

#### 액션의 객체 타입 만들기

이전에는 ReturnType을 사용하여 선언했다.

```ts
const actions = { increase, decrease, increaseBy };
type CounterAction = ActionType<typeof actions>;
```

ActionType을 사용해 actions라는 객체에 모든 액션생성함수를 넣고 액션타입으로 감싸준다. 간편해졌다.

#### createReducer로 리듀서 만들기

createReducer를 활용해 스위치케이스문이 아닌 object map형태로 구현할 수 있어서 코드가 간결해진다.

```ts
const counter = createReducer<CounterState, CounterAction>(initialState, {
  [INCREASE]: state => ({ count: state.count + 1 }),
  [DECREASE]: state => ({ count: state.count - 1 }),
  [INCREASE_BY]: (state, action) => ({ count: state.count + action.payload })
});
```

createReducer에서는 제너릭으로 상태의 타입과 액션들의 타입을 넣어준다. 이를 사용해 내부에 각각 액션들을 위해 구현할 함수에서 타입을 추론한다.  
object map 방식ㅇ니 아닌 메소드 체이닝 방식으로 구현도 가능하다.

```ts
const counter = createReducer<CounterState, CounterAction>(initialState)
  .handleAction(INCREASE, state => ({ count: state.count + 1 }))
  .handleAction(DECREASE, state => ({ count: state.count - 1 }))
  .handleAction(INCREASE_BY, (state, action) => ({
    count: state.count + action.payload
  }));
```

handleAction 함수에 첫번째 매개변수에는 액션의 타입을 넣어주고 두번째에는 업데이터 함수를 넣어준다.

### todos 모듈 리팩토링

방식은 counter를 했던것처럼 동일하다.  
src/modules/todos.ts

#### 타입 임포트하기

```ts
import { createAction, ActionType, createReducer } from 'typesafe-actions';
```

#### 액션의 타입선언, 액션생성함수 만들기, 액션 객체 타입 준비

```ts
const ADD_TODO = 'todos/ADD_TODO';
const TOGGLE_TODO = 'todos/TOGGLE_TODO';
const REMOVE_TODO = 'todos/REMOVE_TODO';

export const addTodo = createAction(ADD_TODO)<string>();

export const toggleTodo = createAction(TOGGLE_TODO)<number>();

export const removeTodo = createAction(REMOVE_TODO)<number>();

// 액션들의 타입스크립트 타입 준비
const actions = { addTodo, toggleTodo, removeTodo };
type TodosAction = ActionType<typeof actions>;
```

### 리듀서 createReducer로 바꾸기

```ts
const todos = createReducer<TodosState, TodosAction>(initialState, {
  [ADD_TODO]: (state, { payload: text }) =>
    state.concat({
      id: Math.max(...state.map(todo => todo.id)) + 1,
      text,
      done: false
    }),
  [TOGGLE_TODO]: (state, { payload: id }) =>
    state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
  [REMOVE_TODO]: (state, { payload: id }) =>
    state.filter(todo => todo.id !== id)
```
