---
title: '코드 스플리팅'
date: '2020-03-30T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/code_spliting/'
category: 'javascript'
description: '리액트 에서 컴포넌트를 원할때 불러오자'
tags:
  - 'javascript'
---

리액트 프로젝트를 완성하며 사용자에게 제공할 때 빌드 작업을 통해 프로젝트에서 사용되는 자바스크립트 파일 안에서 불필요 주석, 에러메시지, 공백등을 제거하여 파일 크기를 최소화하기도 하고, 브라우저에서 jsx 문법이나 다른 최신 자바스크립트 문법이 원활하게 실행되도록 코드의 트랜스파일 작업도 한다. 이 작업은 웹팩이 담당한다. 별도의 설정을 하지 않으면 모든 자바스크립트 파일이 하나의 파일로 합쳐지고, css도 하나의 파일로 합쳐진다. cra의 경우 최소 두 개 이상의 자바스크립트 파일이 생성되는데 기본 웹팩설정에 splitChunks라는 기능이 적용되어 node_modules에서 불러온파일, 일정 크기 이상의 파일, 여러 파일간에 공유된 파일을 자동으로 따로 분리시켜서 캐싱의 효과를 제대로 누릴 수 있게 해준다.

### 코드 비동기 로딩

spa개발을 할 때 1,2,3페이지를 만들고 사용자가 1페이지를 방문하면 2,3페이지에서 사용하는 컴포넌트 정보는 필요하지 않다. 하지만 프로젝트에 별도의 설정을 하지 않는다면 1,2,3페이지 컴포넌트에 대한 코드가 모두 한파일에 저장된다. 프로젝트 규모가 커지게 된다면 파일 크기도 커지고 로딩도 오래걸린다. 이러한 문제를 해결해 주는 방법이 코드 비동기 로딩. 코드 스플리팅 방법 중 하나이며 컴포넌트를 필요한 시점에 불러와서 사용할 수 있다.

```jsx
function App() {
  const onClick = () => {
    import('./notify').then(result => result.default());
    // 익스포트 디포트가 아니면 result.notify()
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
      </header>
    </div>
  );
}
```

onClick함수에 import함수로 notify파일의 함수를 불러왔다. 이렇게하면 파일을 따로 분리시켜서 저장한다. 실제 함수가 필요한 지점에 파일을 불러와서 함수를 사용함.
import를 함수로 사용하면 promise를 반환한다. import를 함수로 사용하는 문법은 아직 표준 자바스크립트가 아니며 dynamic import라고 한다. 이 함수를 통해 모듈을 불러올 때 모듈에서 default로 내보낸것은 result.default를 참조해야 사용할 수 있다.  
네트워크탭을 확인하면 클릭이벤트가 발동했을때 새로운 자바스크립트 파일을 불러오며 notify에관한 코드만 들어있다.

## React.lazy와 Suspense를 통한 코드 스플리팅

코드 스플리팅을 위해 리액트에 내장된 기능으로 유틸함수인 React.lazy와 컴포넌트인 Suspense가 있다. 리액트 16.6버전 이후로 도입됨.

### state를 사용한 코드 스플리팅

리액트레이지 없이 코드 스플리팅 해보기

```jsx
class App extends Component {
  state = {
    SplitMe: null
  };

  handleClick = async () => {
    const loadedModule = await import('./SplitMe');
    this.setState({
      SplitMe: loadedModule.default
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p onClick={this.handleClick}>Hello React!</p>
          {this.state.SplitMe && <this.state.SplitMe />}
        </header>
      </div>
    );
  }
}
```

state를 활용해서 핸들클릭이벤트에 다이나믹 임포트를 하고 셋스테이트하여 상태값을 설정해주었다. 네트워크탭으로 보면 온클릭시 SplitMe컴포넌트를 가져온다. 이 방식은 매번 state를 선언해주어야하기때문에 불편하다.

### lazy와 Suspense

React.lazy는 컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩할 수 있게 해주는 유틸 함수이다.

```jsx
const SplitMe = React.lazy(() => import('./SplitMe'));
```

Suspense는 리액트 내장 컴포넌트로 코드 스플리팅된 컴포넌트를 로딩하도록 발동시킬 수 있고, 로딩이 끝나지 않았을때 보여줄 UI를 설정할 수 있다.

```jsx
import React, { Suspense } from 'react';

<Suspense fallback={<div>loading..</div>}>
  <SPlitme />
</Suspense>;
```

Suspense에서 fallback props로 로딩중에 보여줄 jsx를 지정할 수 있다.

```jsx
import React, { Component, useState, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
const SplitMe = React.lazy(() => import('./SplitMe'));

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        <Suspense fallback={<div>loading!</div>}>
          {visible && <SplitMe />}
        </Suspense>
      </header>
    </div>
  );
}
```

단순히 SplitMe 컴포넌트의 가시성을 의미하는 visible이라는 상태만 업데이트하여 스플리팅된 컴포넌트를 보여준다.

### Loadable Components

Loadable Components는 코드 스플리잍을 편하게 하도록 도와주는 서드파티 라이브러리이다. 이 라이브러리의 이점은 서버사이드렌더링을 지원한다. 또한, 렌더링하기전에 필요할 때 스플리팅된 파일을 미리 불러올 수 있는 기능도 있다.

```
npm install @loadable/component
```

사용법은 React.lazy와 비슷하며 Suspense를 사용할 필요는 없다.

```jsx
import loadable from '@loadable/component';
const SplitMe = loadable(() => import('./SplitMe'), {
  fallback: <div>loading!</div>
});

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
}
```

loadable함수의 두 번째 인자를 활용하여 로딩시 보여줄 UI를 설정

```jsx
const SplitMe = loadable(() => import('./SplitMe'), {
  fallback: <div>loading!</div>
});

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  const onMouseOver = () => {
    SplitMe.preload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick} onMouseOver={onMouseOver}>
          Hello React!
        </p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
}
```

SplitMe의 preload를 사용하면 커서를 올리기만해도 로딩이 시작된다. 그리고 클릭시 렌더링 더 좋은 사용자경험을 제공할 수 있는 기능
