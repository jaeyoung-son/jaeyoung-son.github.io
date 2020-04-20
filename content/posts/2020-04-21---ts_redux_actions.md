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
