---
title: "안녕하세요 재영입니다."
date: "2018-01-14T10:43:32.169Z"
template: "post"
draft: false
slug: "/posts/helloJY"
category: "hello git"
description: "재영이"
tags:
  - "terminal"
---

이전 컴에서는 npm install 할 때 permission denied가 안 떴는데, 새 맥북에서는 sudo를 붙여야만 install이 가능하다.
아마 이전의 컴에서 관리자 권한 없이 install 할 수 있도록 세팅했었던 것 같다.

wecoder 분들 보면서 불편해 보이는게 몇 가지 있었는데 
1. 첫 번째가 sudo 붙여서 install 하는 것
2. git push 할 때 매번 username, pw 쓰는 것!

1번에 대해 드디서 포스팅 하는데, 2번은 [git ssh 세팅](https://yeri-kim.github.io/posts/settings/)
에 작성해 놓았으니 참고하면 좋겠다.


### npm install 에러
global로 node modules를 설치할 때, 특정 폴더가 관리자 권한으로만 접근 가능해서 설치가 되지 않는다.

```
npm ERR! Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
npm ERR!  [Error: EACCES: permission denied, access '/usr/local/lib/node_modules'] {
npm ERR!   stack: "Error: EACCES: permission denied, access '/usr/local/lib/node_modules'",
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'access',
npm ERR!   path: '/usr/local/lib/node_modules'
npm ERR! }
```

### node_modules 폴더 권한 바꾸기

아래의 명령어로 현재 나의 user로 소유 권한을 바꾸는 명령어이다. 어쩌면 각자 경로가 다를 수도 있으니 에러 메시지를 잘 확인하자!
```
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### referench
* https://timonweb.com/posts/install-npm-packages-without-sudo/