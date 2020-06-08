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

### 브라우저의 스토리지 사용가능 검사

로컬스토리지를 지원하는 브라우저는 windows 객체에 localStorage라는 속성이 존재한다. 그러나 여러 이유로 에외가 발생할 수 있는데, 존재하더라도 다양한 브라우저가 로컬스토리지를 비활성화하는 설정을 제공하기 때문에 브라우저가 지원해도 스크립트에서 사용 하지 못할 수 있다.  
공식적으로 안내해주는 사용 가능한지 여부를 감지하는 함수

```js
function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException && // Firefox를 제외한 모든 브라우저
      (e.code === 22 || // Firefox
      e.code === 1014 || // Firefox를 제외한 모든 브라우저
      // 코드가 존재하지 않을 수도 있기 떄문에 이름 필드도 확인
      e.name === 'QuotaExceededError' || // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // 이미 저장된 것이있는 경우에만 QuotaExceededError를 확인
      storage &&
      storage.length !== 0
    );
  }
}
```

그냥 보기만 해보면 브라우저별로 까다롭다.
위 함수는 아래와 같이 사용한다.

```js
if (storageAvailable('localStorage')) {
  // 사용가능
} else {
  // 사용불가능
}
```

### 세션 스토리지와 새창(Window.open)

세션 스토리지는 탭 브라우징이나 새로 실행한 브라우저끼리는 별도의 저장 영역이다.
만약 window.open으로 새 창을 띄운다면 새로운 브라우저 컨텍스트로 인식하여 세션스토리지가 따로 생성,관리되지만 최초 데이터는 복사된다.

### 그렇다면 쿠키는?

- 클라이언트 로컬에 저장되는 key,value값이 들어있는 데이터 파일
- 서버에 저장되는 것이 아니기 때문에 보안과 상관없는 정보들에 사용
- 재 요청 시 저장된 값을 참조, 재사용
- 사용자의 하드에 저장되기 때문에 공공장소에서 해킹 등의 악용이 가능
- 클라이언트에 300개, 하나의 도메인에 20개의 값만 저장이 되며 하나의 쿠키는 4kb까지 저장 가능
- 이름,값,저장 기간, 경로 정보가 있어야하며 일정 시간동안 데이터를 저장할 수 있다.
- 클라이언트가 요청하지 않아도 브라우저 요청이 있을 경우 Request Header에 넣어서 자동으로 서버에 전송

### 웹 사이트에서의 쿠키

- 필수적인 쿠키: 페이지 탐색, 웹 사이트 보안 영역 접속, 기본기능 활성화
- 기능 쿠키: 접속자의 지역, 언어
- 성능 쿠키: 정보의 익명 수집, 보고
- 마케팅 쿠키: 방문 내역 추적

### 간략한 비교

스토리지API는 HTML5이후로 나왔다고 한다. 뭐 쿠키의 단점을 보완해서 나왔다고 하긴 하는데 비교해보면 다음과 가다.

1. Cookie

   - 후속 요청으로 서버로 다시 보내야하는 데이터를 저장. 만료는 유형에 따라 다르며 만료 기간은 서버 측 또는 클라이언트 측에서 설정할 수 있다.
   - 주로 서버측에서 읽기 위한 것이며, 스토리지는 클라이언트 측에서만 읽을 수 있다.
   - 크기는 4KB보다 작아야 한다.
   - 해당 쿠키에 대해 httpOnly 플래그를 true로 설정하여 쿠키를 안전하게 만들 수 있다. 이러면 클라이언트 측 액세스가 차단된다.

2. Local Storage
   - 만료일이 없는 데이터를 저장하고 js를 통해서만 지워진다.
   - 저장 용량 한도는 3가지 중 가장 높다
3. Session Storage
   - 세션스토리지 객체는 세션에 대해서만 데이터를 저장한다. 즉 탭이 닫힐 때까지만 저장
   - 데이턴느 서버로 전송되지 않는다.
   - 저장 용량 한도가 쿠키보다 크다 (최소5mb(

등등 쿠키의 경우 값을 저장하는 메서드나 지우는 메서드들을 시간과 관련해서 저장하고 지우는데, 쿠키를 사용할때 더 깊게 정리해봐야겠다.
