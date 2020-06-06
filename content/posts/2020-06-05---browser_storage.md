---
title: '브라우저의 스토리지'
date: '2020-06-058T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/browser_storage/'
category: 'storage'
description: '브라우저의 storage와 간략 쿠키'
tags:
  - 'storage'
---

## 브라우저의 스토리지

스토리지 객체는단순한 key-value 저장소이며, 이는 객체와 비슷하다. 하지만 이 데이터들은 페이지 로딩에도 온전하게 유지된다. key와 value는 항상 문자열이며 정수로 키를 사용할 경우 이는 자동으로 string으로 변경된다 Storage.getItem() 과 Storage.setItem()ㅁ서드를 사용할 수 있다.

### 언제 사용할까?

데이터베이스를 사용하지 않고 데이터를 임시적인 용도로 저장 할 때 사용

- 대부분의 데이터는 디비에 저장하고 해당하는 사용처에 따라 쿠키, 세션스토리지, 로컬스토리지를 사용한다
- 대부분 임시적인 용도의 데이터나 캐시, history 기능을 위해 사용
- 글 작성 중간에 임시로 글을 저장하는 용도로도 많이 사용된다
- 방문자의 이동 경로를 저장하였다가 이동 시에 사용
- 서버에 저장할 필요가 없는 정보들을 저장 할 때 사용
- 보안적인 문제가 될 만한 것들을 저장할 때 사용은 안됨

### 값을 세팅하기

```js
localstorage.setting = ‘value’;
localstorage[‘setting’] = ‘value’
localstorage.setItem(‘setting’, ‘value’)
```

위와같이 값을 설정할 수 있는데 pitfaills와 관련된 사항을 막기 위해 Web Storage API(setItem, getItem, removeItem, key, length)를 사용하는것이 권장된다.

### Web Storage의 종류

- sessionStorage
  sessionStorage는 페이지의 세션이 유지되는 동안 사용할 수 있는 각 origin별로 별도의 스토리지를 관리한다. (페이지 리로딩 및 복원을 포함한, 브라우저가 열려있는 한 최대한 긴 시간동안)
- localStorage
  localStorage도 같은 일을 하지만, 브라우저가 닫히거나 다시 열려도 유지한다.

### 메서드들

- setItem(‘key’, ‘value’)
  해당 스토리지에 값을 세팅한다

```js
window.localStorage.setItem(’key’, ‘value’); // 값 세팅
```

- getItem(‘key’)
  해당 스토리지의 키를 가져온다

```js
window.localStorage.getItem(’key’); // 해당 키 가져오기
```

- removeItem(‘key’)
  해당 스토리지의 키를 지운다.

```js
window.localStorage.removeItem(’key’); // 해당 키 지우기
```

- clear()
  해당 스토리지의 키들을 모두 지운다.

```js
window.localStorage.clear(); // 전부 클리어
```

