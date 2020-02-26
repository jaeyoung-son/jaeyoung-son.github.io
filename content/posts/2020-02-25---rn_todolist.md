---
title: '리액트 네이티브 할일목록앱'
date: '2020-02-25T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/rn_todolist/'
category: 'react_native'
description: '리액트 네이티브 할일목록앱 만들기'
tags:
  - 'react-native'
---

## AsyncStorage 설치 및 생성

AsyncStorage 란 앱애서의 스토리지로 브라우저의 스토리지와 유사한 개념이다. 앱을 종료하고 다시 실행해도, 할 일 리스트를 표시하기 위해 데이터를 앱 내에 저장하기위한 용도. 0.6 이후의 버전의 리액트 네이티브 에서 AsyncStorage를 사용하기 위해 설치를 하여햐 한다.

```
npm install --save @react-native-community/async-storage
```

설치한 후 ios에서 필요한 라이브러리 설치

```
cd ios
pod install
```

리액트 네이티브 0.6 버전 이후에는 라이브러리가 자동으로 연결된다. 하지만 이전 버전을 사용한다면 명령어를 통해 라이브러리를 연결해줘야한다.

```
react-native link @react-native-community/async-storage
```

## Context

전역 데이터를 저장하기 위해 Context를 사용한다. 데이터 타입을 정의하기 위해 파일을 생성한다
src/Context/TodoListContext/@types/index.d.ts

```jsx
interface ITodoListContext {
  todoList: Array<string>;
  addTodoList: (todo: string) => void;
  removeTodoList: (index: number) => void;
}
```

Props의 타입을 정의할 때는 같이 한 파일에서 정의하여 해당 파일 안에서만 타입을 사용할 수 있었다. 하지만 @types/index.d.ts 파일을 만들고 해당 파일 안에 타입을 정의하면 프로젝트 전반에 걸쳐서 타입을 사용할 수 있다.

Context 정의

```jsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

const TodoListContext =
  createContext <
  ITodoListContext >
  {
    todoList: [],
    addTodoList: (todo: string): void => {},
    removeTodoList: (index: number): void => {}
  };

const TodoListContextProvider = ({ children }: Props) => {
  const [todoList, setTodolist] = useState < Array < string >> [];

  const addTodoList = (todo: string): void => {
    const list = [...todoList, todo];
    setTodolist(list);
    AsyncStorage.setItem('todoList', JSON.stringify(list));
  };

  const removeTodoList = (index: number): void => {
    let list = [...todoList];
    list.splice(index, 1);
    setTodolist(list);
    AsyncStorage.setItem('todoList', JSON.stringify(list));
  };

  const initData = async () => {
    try {
      const list = await AsyncStorage.getItem('todoList');
      if (list !== null) {
        setTodolist(JSON.parse(list));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <TodoListContext.Provider
      value={{
        todoList,
        addTodoList,
        removeTodoList
      }}
    >
      {children}
    </TodoListContext.Provider>
  );
};

export { TodoListContextProvider, TodoListContext };
```

createContext로 context를 생성하고, state데이터를 context안에 저장한다.
Context를 사용하기 위해서는 우선 공통 부모 컴포넌트에서 context의 프로바이더를 사용한다. 공통 부모 컴포넌트에서 프로바이더를 사용하기 위해서는 context의 프로바이더 컴포넌트를 만들고 공통 부모 컴포넌트의 부모 컴포넌트로서 사용한다. TodoListContextProvider는 context의 프로바이더 컴포넌트이다. 자식 컴포넌트는 children 매개변수를 통해 전달받는다.
initData함수는 앱이 시작될 때, AsyncStorage에 저장된 데이터를 불러와 Context의 값을 초기화하기 위한 함수이다. setItem과 getItem은 모두 Promise 함수이다. 이 함수에서는 값을 바로 초기화하기 위해 async-await를 사용하여 동기화 처리를 한다.

## Todo 컴포넌트 만들기

```jsx
import React from 'react';
import styled from 'styled-components/native';
import TodoListView from './TodoListView';
import AddTodo from './AddTodo';

const Container = styled.View`
  flex: 1;
`;

interface Props {}

const Todo = ({}: Props) => {
  return (
    <Container>
      <TodoListView />
      <AddTodo />
    </Container>
  );
};

export default Todo;
```

할 일 리스트를 보여줄 TodoListView컴포넌트와 할 일을 추가할 수 있는 AddTodo 컴포넌트를 가지고 있다.

## TodoListView

```jsx
import React from 'react';
import styled from 'styled-components/native';
import Header from './Header';
import TodoList from './TodoList';

const Container = styled.SafeAreaView`
  flex: 1;
`;

interface Props {}

const TodoListView = ({}: Props) => {
  return (
    <Container>
      <Header />
      <TodoList />
    </Container>
  );
};

export default TodoListView;
```

단순히 앱 이름을 표시하기 위한 Header 컴포넌트와 할일 리스트를 표시할 TodoList 컴포넌트를 가지고 있다.

## Header 컴포넌트

```jsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const TitleLabel = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

interface Props {}

const Header = ({}: Props) => {
  return (
    <Container>
      <TitleLabel>Todo List App</TitleLabel>
    </Container>
  );
};

export default Header;
```

## TodoList 컴포넌트

```jsx
import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {TodoListContext} from '~/Context/TodoListContext';
import EmptyItem from './EmptyItem';
import TodoItem from './TodoItem';

const Container = styled(FlatList)``;

interface Props {}

const TodoList = ({}: Props) => {
  const {todoList, removeTodoList} = useContext<ITodoListContext>(
    TodoListContext,
  );
  return (
    <Container
      data={todoList}
      keyExtractor={(item, index) => {
        return `todo-${index}`;
      }}
      ListEmptyComponent={<EmptyItem />}
      renderItem={({item, index}) => (
        <TodoItem
          text={item as string}
          onDelete={() => removeTodoList(index)}
        />
      )}
      contentContainerStyle={todoList.length === 0 && {flex: 1}}
    />
  );
};

export default TodoList;
```

함수형 컴포넌트에서 Context를 사용하기 위해서는 훅의 useContext함수를 불러와 사용하고자 하는 Context를 초기값으로 설정하고 해당 context에서 사용하고자 하는 값들을 불러와 사용할 수 있다. 앞에서 만든 Context인 TodoListContext를 useContext의 초기값으로 설정하였고 TodoListContext 안에서 사용하고자 하는 todoList 변수와 removeTodoList 함수를 불러왔다.
TodoList 컴포넌트는 리액트 네이티브의 리스트 뷰 중 하나인 FlatList 컴포넌트를 사용했다. FlatList는 Props를 전달하여 사용할 수 있다.
data: 리스트 뷰에 표시할 데이터의 배열  
keyExtractor: 반복적으로 동일한 컴포넌트를 표시하기 위해 컴포넌트에 키 값을 설정해야 하는데, FlatList에서 반복적으로 표시하는 Item에 키 값을 설정하기 위한 속성  
ListEmptyComponent: 주어진 배열에 데이터가 없을 경우 표시되는 컴포넌트  
renderItem: 주어진 배열에 데이터를 사용하여 반복적으로 표시될 컴포넌트  
contentContainerStyle: 표시할 떼이터가 없는 경우, ListEmptyComponenet의 컴포넌트가 화면에 표시된다. 하지만 이 컴포넌트도 하나의 리스트 아이템으로 표시ㅏ되기 때문에, 전체화면으로 표시되지 않는다. 이 컴포넌트를 전체 화면으로 표시하기 위해 flex:1 설정
