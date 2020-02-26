---
title: '리액트 네이티브 할일목록앱2'
date: '2020-02-26T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/rn_todolist_2/'
category: 'react_native'
description: '리액트 네이티브 할일목록앱 만들기'
tags:
  - 'react-native'
---

## EmptyItem 컴포넌트

```jsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Label = styled.Text``;

interface Props {}

const EmptyItem = ({}: Props) => {
  return (
    <Container>
      <Label>하단에 "+" 버튼을 눌러 새로운 할 일을 등록하자</Label>
    </Container>
  );
};

export default EmptyItem;
```

데이터가 없을 때, 데이터를 추가하도록 안내하는 문구를 가운데 정렬로 표시

## TodoItem 컴포넌트

```jsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  background-color: #fff;
  margin: 4px 16px;
  padding: 8px 16px;
  border-radius: 8px;
  align-items: center;
`;

const Label = styled.Text`
  flex: 1;
`;

const DeleteButton = styled.TouchableOpacity``;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
`;

interface Props {
  text: string;
  onDelete: () => void;
}

const TodoItem = ({ text, onDelete }: Props) => {
  return (
    <Container>
      <Label>{text}</Label>
      <DeleteButton onPress={onDelete}>
        <Icon source={require('~/Assets/Images/remove.png')} />
      </DeleteButton>
    </Container>
  );
};

export default TodoItem;
```

이 컴포넌트는 부모 컴포넌트로부터 데이터 하나를 전달받아 화면에 표시한다. 식제 아이콘을 선택하였을 시, 삭제 함수를 전달받아 삭제하도록 설정했다.

## AddTodo 컴포넌트

```jsx
import React, { useState } from 'react';
import AddButton from './AddButton';
import TodoInput from './TodoInput';

interface Props {}

const AddTodo = ({}: Props) => {
  const [showInput, setShowInput] = useState < boolean > false;

  return (
    <>
      <AddButton onPress={() => setShowInput(true)} />
      {showInput && <TodoInput hideTodoInput={() => setShowInput(false)} />}
    </>
  );
};

export default AddTodo;
```

할 일 추가를 위한 컴포넌트 할 일 추가 버튼을 눌렀을 때, 할 일을 입력하는 컴포넌트를 화면에 표시하고, 할 일을 입력하는 컴포넌트에서 할 일 입력을 완료하면, 해당 컴포넌트를 숨길 수 있도록 설정한다.

## AddButton 컴포넌트

```jsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
  position: absolute;
  bottom: 0;
  align-self: center;
  justify-content: flex-end;
`;

const ButtonContainer = styled.TouchableOpacity`
  box-shadow: 4px 4px 8px #999;
`;

const Icon = styled.Image``;

interface Props {
  onPress?: () => void;
}

const AddButton = ({ onPress }: Props) => {
  return (
    <Container>
      <ButtonContainer onPress={onPress}>
        <Icon source={require('~/Assets/Images/add.png')} />
      </ButtonContainer>
    </Container>
  );
};

export default AddButton;
```

단순한 추가 버튼 컴포넌트이며 부모로부터 전달받은 함수를 이미지 버튼이 선택되었을 때, 호출할 수 있게 연결

## TodoInput 컴포넌트

```jsx
import React from 'react';
import styled from 'styled-components/native';
import Background from './Background';
import TextInput from './TextInput';

const Container = styled.KeyboardAvoidingView`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: flex-end;
`;

interface Props {
  hideTodoInput: () => void;
}

const TodoInput = ({ hideTodoInput }: Props) => {
  return (
    <Container behavior="padding">
      <Background onPress={hideTodoInput} />
      <TextInput hideTodoInput={hideTodoInput} />
    </Container>
  );
};

export default TodoInput;
```

화면을 어둡게 처리할 Background 컴포넌트와, 텍스트를 입력받을 TextInput 컴포넌트를 가지고 있다.

## Background 컴포넌트

```jsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.TouchableWithoutFeedback`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const BlackBackground = styled.View`
  background-color: #000;
  opacity: 0.3;
  width: 100%;
  height: 100%;
`;

interface Props {
  onPress: () => void;
}

const Background = ({ onPress }: Props) => {
  return (
    <Container onPress={onPress}>
      <BlackBackground />
    </Container>
  );
};

export default Background;
```

## Context에 데이터를 추가하는 TextInput 컴포넌트

```jsx
import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { TodoListContext } from '~/Context/TodoListContext';

const Input = styled.TextInput`
  width: 100%;
  height: 40px;
  background-color: #fff;
  padding: 0 8px;
`;

interface Props {
  hideTodoInput: () => void;
}

const TextInput = ({ hideTodoInput }: Props) => {
  const { addTodoList } = useContext < ITodoListContext > TodoListContext;

  return (
    <Input
      autoFocus={true}
      autoCapitalize="none"
      autoCorrect={false}
      placeholder="할 일 입력하기"
      returnKeyType="done"
      onSubmitEditing={({ nativeEvent }) => {
        addTodoList(nativeEvent.text);
        hideTodoInput();
      }}
    />
  );
};

export default TextInput;
```

useContext를 사용하여 Context를 사용하도록 설정하였다. useContext의 초기값으로 만든 TodoListContext를 전달하고, 전역 데이터인 할 일 리스트에 데이터를 추가하기 위해 addTodoList 함수를 할당받았다.
