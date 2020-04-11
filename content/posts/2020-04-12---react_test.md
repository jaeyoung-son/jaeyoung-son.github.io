---
title: '리액트 테스팅'
date: '2020-04-12T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/react_test_develop/'
category: 'test'
description: '테스트 주도 개발하기'
tags:
  - 'test'
---

리액트 컴포넌트를 테스트 할 때에는 주로 어떠한 결과가 화면상에 잘 나타났는지, 이벤트 혹은 함수가 호출 됐을 때 원하는 업데이트가 잘 반영되는지를 확인한다.
이를 수행하는 가장 기본적인 방법은 react-dom/test-utils안에 있는 유틸 함수를 사용하는것이다. 그러나 조금 복잡하고, 불편한점들이 있다. 테스팅 라이브러리가 많이 사용되고 공식문서에서도 권장됨

### Enzyme 과 react-testing-library

리액트 공식문서에서 권장하는 라이브러리는 react-testing-library이다. 그리고, 대체방안으로 Enzyme이 있다고 언급을 하고있다.
Enzyme과 react-testing-library는 서로 다른 철학을 가지고 있다. Enzyme을 사용하여 테스트 코드를 작성할 때에는 컴포넌트의 내부 기능을 자주 접근한다. 예를들어 props,state를 확인하고 내장 메소드를 직접 호출하기도 한다.  
react-testing-library는 반면 렌더링 결과에 조금 더 집중을 한다. 실제 DOM에 대해서 신경을 더 많이 쓰고, 컴포넌트의 인스턴스에 대해서 신경쓰지 않고, 실제 화면에 무엇이 보여지는지, 그리고 어떠한 이벤트가 발생했을때 화면에 원하는 변화가 생겼는지 이런 것을 확인하기에 조금 더 최적화 되어있다. 조금 더 사용자의 관점에서 테스팅하기 좋다

### 리액트 프로젝트 생성

CRA를 통하여 프로젝트를 생성한다.

```
npx create-react-app rtl-tutorial
```

cra로 만든 프로젝트에는 Jest가 처음부터 적용되어있기 때문에 별도로 설치를 하지 않아도 된다. VSCode를 사용하면 IDE지원을 제대로 받기 위해 @types/jest를 설치한다.

```
npm install --save react-testing-library jest-dom @types/jest
```

jest-dom 은 jest확장으로서ㅡ DOM에 관련된 matcher를 추가해준다. src디렉토리에 setupTest.js 파일을 생성 후 코드 입력

```js
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';
```

react-testing-library에는 리액트에서는 DOM 시뮬레이션을 위한 JSDOM이라는 도구를 사용하여 document.body에 리액트 컴포넌트를 렌더링한다. clean-up-after-each를 불러오면, 테스트 케이스가 끝날때마다 기존에 가상의 화면에 남아있는 UI를 정리한다.
jest-dom/extend-expect를 불러와서 jest에서 DOM관련 matcher를 사용할 수 있게 해준다.

### 테스트 코드

username과 name을 props로 넣어주면 이를 렌더링해주는 Profile 컴포넌트

```jsx
//src/Profile.js

import React from 'react';

const Profile = ({ username, name }) => {
  return (
    <div>
      <b>{username}</b>&nbsp;
      <span>({name})</span>
    </div>
  );
};

export default Profile;
```

App에서 렌더링 후 테스트코드 작성

```js
// src/Profile.test.js
import React from 'react';
import { render } from 'react-testing-library';
import Profile from './Profile';

describe('<Profile />', () => {
  it('matches snapshot', () => {
    const utils = render(<Profile username="jy" name="재영이" />);
    expect(utils.container).toMatchSnapshot();
  });
  it('shows the props correctly', () => {
    const utils = render(<Profile username="jy" name="재영이" />);
    utils.getByText('jy'); // jy라는 텍스트를 가진 엘리먼트가 있는지 확인
    utils.getByText('(재영이)'); // (재영이) 라는 텍스트를 가진 엘리먼트 확인
    utils.getByText(/재/); // 정규식 /재/를 통과하는 엘리먼트가 있는지 확인
  });
});
```

이후 버전은 react-testing-library 지원이 아닌  
import { render } from '@testing-library/react' 사용

```
standard: 29.09.2019

invalid : $ yarn add react-testing-library jest-dom
valid: $ yarn add @testing-library/jest-dom @testing-library/react -D

invalid :

import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';
valid: import '@testing-library/jest-dom/extend-expect';

After setting valid, you can see "devDependencies" package.json

"@testing-library/jest-dom": "^4.1.0",
"@testing-library/react": "^9.2.0",
```

npm test로 테스트가 통과하는지 확인한다.
컴포넌트를 렌더링 할때는 render()라는 함수를 사용한다 이 함수가 호출되면 그 결과물에 DOM을 선택할 수 있는 다양한 쿼리들과 container가 포함된다. 여기서 container는 해당 컴포넌트의 최상위 DOM을 가르킨다. 이를 가지고 스냅샷 테스팅을 할 수도있다. getByText는 쿼리함수라고 부르며 이 함수를 사용하면 텍스트를 사용해서 원하는 DOM을 선택할 수 있다.

### 스냅샷 테스팅

스냅샷 테스팅은 렌더링된 결과가 이전에 렌더링한 결과와 일치하는지 확인하는 작업을 의미한다. 코드를 저장하면 src/**snapshot**/Profile.test.js/snap 이라는 파일이 만들어진다. 컴포넌트가 렌더링됐을 때 이 스냅샷과 일치하지 않으면 테스트가 실패한다. 만약에 스냅샷을 업데이트 하고싶다면 테스트가 실행되고 있는 콘솔창에서 u키를 누르면 된다.

### 다양한 쿼리

render함수를 실행하고 나면 결과물 안에는 다양한 쿼리 함수들이 있다. 이 쿼리 함수들은 react-testing-library 기반인 dom-testing-library에서 지원하는 함수들이다. 이 쿼리함수들은 Variant와 Queries의 조합으로 네이밍이 이루어져있다.

#### Variant

##### getBy

getBy\*로 시작하는 쿼리는 조건에 일치하는 DOM 엘리먼트 하나를 선택한다. 만약 없다면 에러가 발생한다.

##### getAllBy

getAllBy\*로 시작하는 쿼리는 조건에 일치하는 DOM 엘리먼트 여러개를 선택한다. 이 역시 하나도 없다면 에러가 발생한다.

##### queryBy

queryBy\*로 시작하는 쿼리는 조건에 일치하는 DOM 엘리먼트 하나를 선택한다. 존재하지 않아도 에러가 발생하지않음

##### queryAllBy

queryAllby\*로 시작하는 쿼리는 조건에 일치하는 DOM 엘리먼트 여러개를 선택하는데 존재하지 않아도 에러가 발생하지 않는다.

##### findBy

findBy\*로 시작하는 쿼리는 조건에 일치하는 DOM 엘리먼트가 하나가 나타날 때 까지 기다렸다가 해당 DOM을 선택하는 Promise를 반환한다. 기본 timeout인 4500ms이후에도 나타나지 않으면 에러가 발생한다.

##### findAllBy

findAllBy\*로 시작하는 쿼리는 조건에 일치하는 DOM 엘리먼트 여러개가 나타날때 까지 기다렸다가 해당 DOM을 선택하는 Promise를 반환한다. 4500ms이후에도 나타나지 않으면 에러 발생

#### Queries

##### ByLabelText

ByLabelText는 label이 있는 input의 label 내용으로 input을 선택한다.

```jsx
<label for="username-input">아이디</label>
<input id="username-input" />

const inputNode = getByLabelText('아이디')
```

##### ByPlaceholderText

ByPlaceholderText는 placeholder 값으로 input 및 textarea를 선택한다.

```jsx
<input placeholder="아이디" />;

const inputNode = getByPlaceholderText('아이디');
```

##### ByText

ByText는 엘리먼트가 가지고 있는 텍스트 값으로 DOM을 선택한다.

```jsx
<div>Hello World</div>;

const div = getByText('Hello World');
```

텍스트 값에 정규식을 넣어도 작동한다.

```js
const div = getByText(/^Hello/);
```

##### ByAltText

ByAltText는 alt속성을 가지고 있는 엘리먼트 (주로img)를 선택한다.

```jsx
<img src="/image.png" alt="good image">

const goodImage = getByAltText('good image')
```

##### ByTitle

ByTitle은 title속성을 가지고 있는 DOM혹은 title 엘리먼트를 지니고 있는 SVG를 선택할 때 사용한다. title 속성은 html에서 툴팁을 보여줘야 하는 상황에 사용함.

```jsx
<p>
  <span title="React">리액트</span>는 좋은 라이브러리
</p>

<svg>
  <title>Delete</title>
  <g><path/></g>
</svg>

const spanReact = getByTitle('React')
const svgDelete = getByTitle('Delete')
```

##### ByDisplayValue

ByDisplayValue 는 input, textarea, select가 지니고 있는 현재값을 가지고 엘리먼트를 선택한다.

```jsx
<input value="text" />;

const input = getBydisplayValue('text');
```

##### ByRole

ByRole은 특정 role값을 지니고 있는 엘리먼트를 선택한다.

```jsx
<span role="button">삭제 </span>;

const spanRemove = getByRole('button');
```

##### ByTestId

ByTestId는 다른 방법으로 선택하지 못할때 사용하는 방법으로, 특정 DOM에 직접 test할 때 사용할 id를 달아서 선택하는 것을 의미한다.

```jsx
<div data-testid="commondiv">흔한 div</div>;

const commonDiv = getByTestId('commondiv');
```

주의할것은 카멜케이스가 아니다 값을 설정할때 data-testid="..."이렇게 설정해야한다. 그리고 다른 방법으로 선택할 수 없을때에만 사용해야한다.

#### 어떤 쿼리를 사용할까?

일단 종류가 너무 많다. 일단 메뉴얼에서는 우선순위에 따라서 사용하는것을 권장하고있다.
1.getByLabelText
2.getByPlaceholderText
3.getByText
4.getByDisplayValue
5.getByAltText
6.getByTitle
7.getByRole
8.getByTestId

DOM의 querySelector도 사용할 수 있지만 이는 지양해야한다.

### Counter 컴포넌트 테스트 코드 작성

카운터 컴포넌트 만들기

```jsx
import React, { useState, useCallback } from 'react';

const Counter = () => {
  const [number, setNumber] = useState(0);

  const onIncrease = useCallback(() => {
    setNumber(number + 1);
  }, [number]);

  const onDecrease = useCallback(() => {
    setNumber(number - 1);
  }, [number]);

  return (
    <div>
      <h2>{number}</h2>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
};

export default Counter;
```

테스트 코드 작성

```js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('<Counter /', () => {
  it('matches snapshot', () => {
    const utils = render(<Counter />);
    expect(utils.container).toMatchSnapshot();
  });
  it('has a number and two buttons', () => {
    const utils = render(<Counter />);
    //버튼과 숫자가 있는지 확인
    utils.getByText('0');
    utils.getByText('+1');
    utils.getByText('-1');
  });
  it('increases', () => {
    const utils = render(<Counter />);
    const number = utils.getByText('0');
    const plusButton = utils.getByText('+1');
    // 클릭 이벤트 두번 발생시키기
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    expect(number).toHaveTextContent('2'); // jest-dom의 확장 matcher
    expect(number.textContent).toBe('2'); // textContent를 직접 비교
  });
  it('decreases', () => {
    const utils = render(<Counter />);
    const number = utils.getByText('0');
    const minusButton = utils.getByText('-1');
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    expect(number).toHaveTextContent('-2'); // jest-dom의 확장 matcher
  });
});
```

#### 이벤트 다루기

여기서 fireEvent()라는 함수를 불러와서 사용했다. 이 함수는 이벤트를 발생시켜준다

```js
fireEvent.이벤트이름(DOM, 이벤트객체);
```

클릭 이벤트의 경우 이벤트객체를 넣어주지 않아도 되지만, change같은 이벤트의 경우엔 넣어야한다.

```js
fireEvent.change(myInput, { target: { value: 'hello world' } });
```
