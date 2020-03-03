---
title: '리액트 네이티브 영화앱 만들기'
date: '2020-03-04T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/rn_movie_app/'
category: 'react_native'
description: '리액트 네이티브 영화앱  만들기'
tags:
  - 'react-native'
---

## 네비게이션

리액트 네이티브는 네비게이션 기능을 지원하지 않는다. 따라서 오픈소스 라이브러리를 사용해야 한다.

- react-native-navigation
- react-navigation
- native-navigation
- react-native-router
- react-native-router-flux
  네비게이션을 사용하기위한 라이브러리 설치

```
npm install --save react-navigation react-native-gesture-handler react-native-reanimated
cd ios
pod install
```

네비게이션을 사용하기 위해 사용할 네비게이션과 화면을 미리 정의해야 한다. navigator.ts 파일을 만들고 앱전체에 사용할 네비게이션 미리 정의

```tsx
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import CheckLogin from '~/Screens/CheckLogin';
import Login from '~/Screens/Login';
import MovieHome from '~/Screens/MovieHome';
import MovieDetail from '~/Screens/MovieDetail';

const LoginNavigator = createStackNavigator({
  Login
});

const MovieNavigator = createStackNavigator({
  MovieHome,
  MovieDetail
});

const AppNavigator = createSwitchNavigator(
  {
    CheckLogin,
    LoginNavigator,
    MovieNavigator
  },
  {
    initialRouteName: 'CheckLogin'
  }
);

export default createAppContainer(AppNavigator);
```

createSwitchNavigator은 로그인 여부를 판단하고 로그인 여부에 따라 보여줄 화면을 전환하기 위해 사용할 네비게이션이다 로그인 여부에 따라 화면을 교체하여 표시한다.  
createStackNavigator은 영화 리스트 화면에서 영화를 선택하면 상세 페이지를 보여주기 위해 사용한다. 상세페이지 화면을 쌓아서 표시한다.  
createAppContainer는 네비게이션을 다루기 위한 state, 링크 등을 관리한다. 따라서 네비게이션을 사용할 경우, 항상 마지막은 createAppContainer로 네비게이션을 감싸서 제공한다.  
네비게이션을 사용하기 위해 App.tsx 설정

```tsx
import React from 'react';
import { StatusBar } from 'react-native';
import Navigator from '~/Screens/Navigator';

interface Props {}

const App = ({}: Props) => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Navigator />
    </>
  );
};
export default App;
```

## 체크로그인 컴포넌트

이 컴포넌트에서는 로그인 여뷰를 체크한다. 로그인 시 키를 생성하여 AsyncStorage에 저장한 후 단순히 키의 존재 여부로 로그인 여부를 체크한다.

```tsx
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #141414;
  justify-content: center;
  align-items: center;
`;

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

const CheckLogin = ({ navigation }: Props) => {
  AsyncStorage.getItem('key')
    .then(value => {
      if (value) {
        navigation.navigate('MovieNavigator');
      } else {
        navigation.navigate('LoginNavigator');
      }
    })
    .catch((error: Error) => {
      console.log(error);
    });

  return (
    <Container>
      <ActivityIndicator size="large" color="#E70915" />
    </Container>
  );
};

CheckLogin.navigationOptions = {
  header: null
};

export default CheckLogin;
```

Navigator.ts 파일에서 설정한 컴포넌트들은 기본적으로 navigation이라는 Props를 전달받는다. 이 Props의 함수인 navigation.navogate('화면 이름')을 이용하면 화면을 전환할 수 있다. CheckLogin 컴포넌트는 단순히 키의 유효성을 체크하는 컴포넌트이다.
네비게이션과 직접 연결이 되는 컴포넌트는 navigationOptions를 추가하여 네비게이션에 필요한 속성을 설정할 수 있다.  
단순히 로딩화면만 표시하기에 header를 표시하지 않도록 설정하였다.

## 로그인 컴포넌트

```tsx
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Linking } from 'react-native';
import styled from 'styled-components/native';

import Input from '~/Components/Input';
import Button from '~/Components/Button';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #141414;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.View`
  width: 100%;
  padding: 40px;
`;

const PasswordReset = styled.Text`
  width: 100%;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
`;

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

const Login = ({ navigation }: Props) => {
  return (
    <Container>
      <FormContainer>
        <Input style={{ marginBottom: 16 }} placeholder="이메일" />
        <Input
          style={{ marginBottom: 16 }}
          placeholder="비밀번호"
          secureTextEntry={true}
        />
        <Button
          style={{ marginBottom: 24 }}
          label="로그인"
          onPress={() => {
            console.log('test');
            AsyncStorage.setItem('key', 'JWT_KEY');
            navigation.navigate('MovieNavigator');
          }}
        />
        <PasswordReset
          onPress={() => {
            Linking.openURL('https://jaeyoung-son.github.io/');
          }}
        >
          비밀번호 재설정
        </PasswordReset>
      </FormContainer>
    </Container>
  );
};

Login.navigationOptions = {
  title: 'MOVIEAPP',
  headerTransparent: true,
  headerTintColor: '#E70915',
  headerTitleStyle: {
    fontWeight: 'bold'
  }
};

export default Login;
```

사용자 입력을 받는 input 컴포넌트와 로그인 버튼 역할을 하는 Button 컴포넌트를 불러와 사용했다. 단순히 웹 브라우저를 열도록 하기 위해 네이티브는 Linking 컴포넌트를 제공한다.  
login 컴포넌트에는 투명한 네비게이션 헤더를 설정했다.

## Input 컴포넌트

```tsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  height: 40px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: #333333;
`;

const InputField = styled.TextInput`
  flex: 1;
  color: #ffffff;
`;

interface Props {
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  style?: Object;
  clearMode?: boolean;
  onChangeText?: (text: string) => void;
}

const Input = ({
  placeholder,
  keyboardType,
  secureTextEntry,
  style,
  clearMode,
  onChangeText
}: Props) => {
  return (
    <Container style={style}>
      <InputField
        selectionColor="#ffffff"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ? keyboardType : 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        allowFontScaling={false}
        placeholderTextColor="#ffffff"
        placeholder={placeholder}
        clearButtonMode={clearMode ? 'while-editing' : 'never'}
        onChangeText={onChangeText}
      />
    </Container>
  );
};

export default Input;
```

인풋 컴포넌트는 단순히 네이티브의 TextInput 컴포넌트 구성에 필요한 데이터를 부모로부터 Props를 통해 전달받는다.

- selectionColor
  입력 필드에 내용을 복사하거나 붙여넣기 위해 사용하는 selection의 색상을 결정
- secureTextEntry
  비밀번호 입력과 같이 입력 내용을 숨길지 여부를 설정한다.
- keyboardType
  이메일, 숫자, 전화번호 등과 같이 키보드의 타입을 결정한다.
- autoCapitalize
  영어 입력 시 첫 문자를 대문자로 자동으로 변경할지 여부 설정
- autoCorrect
  사용자의 입력 내용의 철자가 틀렸을 경우 자동으로 수정할지 여부를 설정
- allowFontScaling
  사용자가 단말기 설정을 통해 수정한 폰트 크기를 적용할지 여부를 설정
- placegolderTextColor
  사용자의 입력 내용이 없을때 보여줄 placeholder의 색상
- clearButtonMode
  사용자의 입력 내용이 있을 때 오른쪽에 전체 삭제버튼을 표시할지 여부
- onChangeText
  입력창의 내용이 변경될 때 호출되는 콜백 함수

## 영화 리스트 데이터 타입

/@types/index.d.ts

```ts
interface IMovie {
  id: number;
  title: string;
  title_english: string;
  title_long: string;
  summary: string;
  synopsis: string;
  background_image: string;
  background_image_original: string;
  date_uploaded: string;
  date_uploaded_unix: number;
  description_full: string;
  genres: Array<string>;
  imdb_code: string;
  language: string;
  large_cover_image: string;
  medium_cover_image: string;
  mpa_rating: string;
  rating: number;
  runtime: number;
  slug: string;
  small_cover_image: string;
  state: string;
  url: string;
  year: number;
  yt_trailer_code: string;
}
```

폴더를 따로 뺀 후 데이터 호출시 받을 데이터타입 정의
