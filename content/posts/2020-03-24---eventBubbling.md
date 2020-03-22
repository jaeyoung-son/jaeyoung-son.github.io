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

```html
<body>
  <div class="one">
    <div class="two">
      <div class="three"></div>
    </div>
  </div>
</body>
```
