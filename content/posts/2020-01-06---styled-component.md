---
title: "Styled_component"
date: "2020-01-06T10:43:32.169Z"
template: "post"
draft: false
slug: "/posts/styled-component/"
category: "styled_component"
description: "스타일드 컴포넌트 적용"
tags:
  - "styled_component"
---

# StyledComponent

### 스타일드 컴포넌트는 자바스크립트 파일 안에 스타일을 선언하는 방식이다. 이 방식을 'CSS-in-JS'라고 부르며 스타일드컴포넌트 이모션등이 대표적이다.
## Tagged 템플릿 리터럴
#### 스타일을 작성할 때 (백틱)을 사용하여 만든 문자열에 스타일 정보를 넣어준다. 여기서 사용한 문법을 Tagged 템플릿 리터럴이라고 부른다. 일반 템플릿 리터럴과 다른점은 템플릿 안에 자바스크립트 객체나 함수를 전달할 때 온전히 추출할 수 있다는것이다.
```jsx
import styled from 'styled-components';

const JyComponent = styled.div`
	font-size: 2rem;
`;
```
#### 스타일드 컴포넌트를 사용하여 스타일링 된 엘리먼트를 만들 때는 컴포넌트 파일의 상단에서 styled를 불러오고, styled.태그명을 사용하여 구현한다.
```jsx
const JyInput = styled('input')`
	bacground: red;
const STyledLink = styled(Link)`
	color: white;
`
```
#### 사용해야 할 태그명이 유동적이거나 특정 컴포넌트 자체에 스타일링 해 주고 싶다면 이와같이 구현한다.

```jsx
import styled, { css } from 'styled-components'
```
#### 위처럼 단순 변수의 형태가 아니라 여러줄의 스타일 구문을 조건부로 설정해야 하는 경우에는 styled뿐만 아니라 css를 불러와야 한다 중요!!
```css
&:hover {
  background: rgba(255, 255, 255, 0.9);
}
```
#### &문자를 사용하여 sass처럼 자기 자신 선택 가능
```css
${props => props.inverted && css`
    background: none;
    border: 2px solid white;
    color: white;
    &:hover {
      background: white;
      color: black;
    }
  `};
```
```jsx
<button>안녕하세요</button>
<button inverted={true}>재영하이</button>
```
#### 스타일 코드 여러 줄을 props에 따라 넣어 주어야 할 떄는 CSS를 styled-components에서 불러와야 한다. CSS를 사용하지 않고 작동 하기는 하나 해당 내용이 그저 문자열로만 취급되기 때문에 신택스 하이라이팅이 제대로 이루어지지 않고 Tagged템플릿 리터럴이 아니기 때문에 함수를 받아 사용하지 못해 해당 부분에서는 props값을 사용하지 못한다. props를 참조한다면 반드시 CSS로 감싸주어서 Tagged 템플릿 리터럴을 사용해주어야 한다.

### 이해하기 어려운 코드 (다시 봐야함)
```jsx
const sizes = {
  desktop: 1024,
  tablet: 768
};


const media = Object.keys(sizes).reduce((acc, labe) => {
  acc[label] = (...args) => css`
	@media (max-width: ${sizes[label] / 16}em)
{
	${css(...args)};
}
`;
  return acc; 
}, {});
```
#### 미디어쿼리를 미리 정의해준다
```jsx
const Box = styled.div`
	background: ...
...
...
	${media.desktop`width:768px;`}
	$(media.tablet`width:100%;`};
`;
```
