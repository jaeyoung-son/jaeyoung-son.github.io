---
title: '타입스크립트 리덕스 리팩토링'
date: '2020-07-258T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/ts_typesafe_actions/'
category: 'learn'
description: 'type safe actions 사용하기'
tags:
  - 'typescript'
---

이전에 typescript와 리덕스 를 함꼐 사용하는 글을 정리한 적이 있는데, 주로 사용하지 않았던 터라 시간이 지나고 잊은 부분도 있었고, typesafe-actions라는 라이브러리도 적용해서 코드도 깔끔하게 정리하기 위해 재차 시도 해보려고 합니다.

## 기본적인 ts, redux 카운터기능 구현과 todoList 기능 구현

#### modules/counter.ts

```ts
// 액션 타입
const INCREASE = 'counter/INCREASE' as const;
const DECREASE = 'counter/DECREASE' as const;
const INCREASE_BY = 'counter/INCREASE_BY' as const;

// 액션 생성함수
export const increase = () => ({
  type: INCREASE
});

export const decrease = () => ({
  type: DECREASE
});

export const increaseBy = (diff: number) => ({
  type: INCREASE_BY,
  payload: diff
});

//액션 겍체들에 대한 타입
type CounterAction =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>
  | ReturnType<typeof increaseBy>;

// 모듈에서 관리 할 상태의 타입
type CounterState = {
  count: number;
};

const initialState: CounterState = {
  count: 0
};

// 리듀서
function counter(
  state: CounterState = initialState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case INCREASE:
      return { count: state.count + 1 };
    case DECREASE:
      return { count: state.count - 1 };
    case INCREASE_BY:
      return { count: state.count + action.payload };
    default:
      return state;
  }
}

export default counter;
```

기본적인 액션, 액션생성함수, 리듀서를 준비하고 그에대한 타입들을 잡아준다.

