---
title: '리액트 테스팅'
date: '2020-04-12T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/test_develop/'
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
