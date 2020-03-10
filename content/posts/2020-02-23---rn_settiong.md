---
title: '리액트 네이티브 초기 설정'
date: '2020-02-22T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/rn_setting/'
category: 'react_native'
description: '리액트 네이티브 초기 설정하기'
tags:
  - 'react-native'
---

## 왓치맨

왓치맨은 특정 디렉토리나 파일을 감시하다가, 변경이; 발생하면, 특정 동작을 실행(trigger)하도록 역할을 한다. 리액트 네이티브는 소스코드의 변경이 발생하면 자동적으로 빌드하고 디바이스 또는 시뮬레이터에 업로드하기 위해 왓치맨을 사용한다

```
brew install watchman
```

## 리액트 네이티브 CLI

리액트 네이티브를 시작하는 방법은 엑스포 CLI와 리액트 네이티브 CLI 두 가지 방법이 있다. 엑스포 CLI는 리액트 네이티브에서 자주 사용되는 오픈소시 네이티브 모듈(위치정보, 사진, 센서 등)을 패키지로 묶어서 제공한다. 엑스포 CLI를 통해 개발하면, 실제 서비스에 불필요한 네이티브 모듈도 포함되어 파일 사이즈가 커지는 문제가 있다

```
npm install -g react-native-cli
```

## Xcode

ios 모바일 앱을 개발하기 위해서는 맥OS와 ios개발 툴인 Xcode가 필요하다.

## 코코아포드

코코아포드는 ios 개발에 사용되는 의존성 관리자이다. 오브젝티브-C나 스위프트로 ios를 개발할 때 사용되는 라이브러리를 설치하거나 관리할 때 사용된다. 노드와 노드 패키지 관리자 관계와 비슷한 관계이다.

```
sudo gem install cocoapods
```

## 자바 개발 킷

안드로이드를 개발하기 위해서는 안드로이드의 개발 언어인 자바가 필요하다. 자바로 개발하기 위해서는 자바 개발 킷(JDK)을 설치해야한다.

```
brew tap AdoptOpenJDK/openjdk
```

다음 홈브루 명렁어로 자바 개발킷 설치

```
brew cask install adoptopenjdk8
```

## 안드로이드 스튜디오

ios 모바일 앱을 개발하기 위해서 ios 개발 툴인 Xcode가 필요하듯이 안드로이드 모바일 앱을 개발하기 위해 안드로이드 스튜디오가 필요하다.

#### 안드로이드 스튜디오의 환경 변수 설정

~/.zshrc

```
export ANDROID_HOME=/자신의 안드로이드SDK 위치/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 리액트 네이티브 프로젝트 생성

리액트 네이티브는 버전이 업데이트될 때, 문제를 일으킬 가능성이 있으므로, 리액트 네이티브로 프로젝트를 진행할 때는 버전을 고정하고 사용하는것이 좋다.

```
npm config set save-exact=true
```

리액트 네이티브 CLI를 사용하여 프로젝트 생성

```
react-native init MyApp
```

프로젝트 생성 후 명령어로 ios 시뮬레이터 실행

```
cd MyApp
react-native run-ios
react-native run-android
```
