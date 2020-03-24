---
title: '이벤트 전파'
date: '2020-03-24T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/event_bubbling/'
category: 'javascript'
description: '자바스크립트 이벤트 버블링과 캡쳐링'
tags:
  - 'javascript'
---

## 이벤트 버블링 Event Bubbling

이벤트 버블링이란? 특정 화면 요소에서 이벤트가 발생했을 때 해당 이벤트가 더 상위의 화면 요소들로 전달되어 가는 특성 이름처럼 거품이 막 불어나듯 전파가 된다.  
여기서 상위 화면 요소란 트리 구조상 한 단계 위에있는 요소들을 가르키며 최상위 요소는 body

```html
<body>
  <div class="one">
    <div class="two">
      <div class="three"></div>
    </div>
  </div>
</body>
```

```js
const divs = document.querySelectorAll('div');
divs.forEach(function(div) {
  div.addEventListener('click', logEvent);
});

function logEvent(event) {
  console.log(event.currentTarget.className);
}
```

세가지 div에 모두 클릭이벤트를 등록하고 three클래스를 가진 최하위 div태그를 클릭하면

```
three
two
one
```

과 같은 결과가 나온다. 브라우저는 특정 화면 요소에서 이벤트가 발생했을 때 그 이벤트를 최상위에 있는 화면 요소까지 전파시킨다. 따라서, 클래스명 three -> two -> one 순서대로 태그에 등록된 이벤트들이 실행된다.  
주의해야 할 점은 각 태그마다 이벤트가 등록되어 있기 때문에 상위 요소로 이벤트가 전달되는 것을 확인할 수 있다. 특정 div태그에만 달려 있다면 위와 같은 동작 결과는 확인할 수 없다.

## 이벤트 캡쳐 Event Capture

이벤트 캡쳐는 이벤트 버블링과 반대 방향으로 진행되는 전파 방식이다.  
최상위 요소인 body 태그에서 해당 태그를 찾아 내려간다.

```html
<body>
  <div class="one">
    <div class="two">
      <div class="three"></div>
    </div>
  </div>
</body>
```

```js
const divs = document.querySelectorAll('div');
divs.forEach(function(div) {
  div.addEventListener('click', logEvent, {
    capture: true //기본값이 false
  });
});

function logEvent(e) {
  console.log(e.currentTarget.className);
}
```

three 클래스를 가진 디브를 클릭하면

```
one
two
three
```

라는 결과가 나온다.

### 전파방지 event.stopPropagation()

```js
function logEvent(event) {
  event.stopPropagation();
}
```

stopPropagation은 해당 이벤트가 전파가 되는것을 막는다. 이벤트 버블링의 경우에는 클릭한 요소의 이벤트만 발생시키고 상위 요소로 전파되는것을 막고 캡쳐의 경우에는 클릭한 요소의 최상위 요소의 이벤트만 동작시키고 하위 요소들로 전파하지 않는다. (앞선 예제에서 버블링에선 three가 찍히고 캡쳐링에성 one이 찍힘)

## 이벤트 위임 Event Delegation

위임을 한 문장으로 요약한다면 하위 요소에 각각 이벤트를 붙이지 않고 상위 요소에서 하위 요소의 이벤트들을 제어하는 방식이다.

```html
<h1>할일 목록</h1>
<ul class="itemList">
  <li>
    <label for="item1">이벤트 버블링 배우기</label>
  </li>
  <li>
    <label for="item2">이벤트 캡쳐링 배우기</label>
  </li>
</ul>
```

리스트 아이템이 많아지면 많아질수록 이벤트 리스너를 다는 작업이 번거로워 진다.

```js
const itemList = document.querySelector('.itemList');
itemList.addEventListener('click', function(event) {
  alert('click');
});
```

라벨에 이벤트를 추가하는 대신 상위 요소인 ul태그에 이벤트 리스너를 달고 하위에서 발생한 클릭 이벤트를 감지한다.  
브라우저가 어떻게 이벤트를 감지하고 어떤식으로 동작하는지 배울 수 있었던 정리였다.  
캡틴판교님의 이벤트 정리글을 보며 정리하였습니다.
