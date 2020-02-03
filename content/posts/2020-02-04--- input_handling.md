---
title: '다중 인풋 핸들링'
date: '2020-02-04T10:43:32.169Z'
template: 'post'
draft: false
slug: '/posts/javascript_input/'
category: 'javascript'
description: '다중 인풋 핸들링 하기'
tags:
  - 'javascript'
---

## 인풋창 핸들링

어드민 페이지 회원가입 기능을 구현 하는 중에 여러 개의 인풋창을 핸들링 하려다 보니 비동기의 문제나 여러 문제가 생겼다. 허선생님의 도움을 받아 해결해나가는 과정을 기록

### 구현 내용

10가지의 인풋창이 있고 아이디 입력창은 5글자 미만이면 인풋창의 보더색이 바뀌며 헬퍼 텍스트가 나오며 각각의 인풋창의 조건은 다르다. submit버튼을 누르면 조건을 확인하고 보낸다.

### 스텝

훅스에서 다중 인풋창 상태관리를 위해서 useReducer를 사용한다
리듀서 함수 정의

```js
const reducer = (state, action) => {
  return {
    ...state,
    [action.name]: action.value
  };
};
```

useReducer 정의

```js
const [inputState, dispatch] = useReducer(reducer, {
  id: '',
  password: '',
  rePassword: '',
  phoneNumber: '',
  sellerName: '',
  sellerNameEng: '',
  csNumber: '',
  sellerSite: '',
  kakaoId: '',
  instaId: ''
});
```

validators 객체 정의

```js
const validators = {
  id: value => !(value.length > 5) && '5이상으로 쓰세요',
  password: value => !(value.length > 8) && '8이상으로 쓰세요',
  rePassword: value => !(value === inputState.password) && '안맞아요'
};

const [errors, setErrors] = useState([]);
```

함수 값을 가진 객체를 정의한다, errors 상태 정의

```js
const setValidationResult = (key, data) => {
  let nextState = errors.filter(error => error.key !== key);
  if (data) {
    nextState = nextState.concat({
      key,
      message: data
    });
  }
  setErrors(nextState);
};
```

조건에따라 setErrors 해주는 함수 정의

```js
  const checkBeforeSubmit = () => {
    for (let key in validators) {
      const validator = validators[key];
      const value = inputState[key];
      const result = validator(value, inputState);
      setValidationResult(key, result);
    }
```

제출 전 확인하는 함수 정의

```js
const onChange = e => {
  dispatch(e.target);
  const { name, value } = e.target;
  const validator = validators[name];
  const result = validator(value, inputState);
  setValidationResult(name, result);
};
```

인풋에 넣을 온체인지 이벤트 정의

```jsx
<InfoInput
  img="\f007"
  placeholder="아이디"
  name="id"
  type="text"
  value={inputState.id}
  onChange={onChange}
  errors={errors}
/>
```

infoinput컴포넌트에 props 전달

```jsx
const InfoInput = props => {
  const { img, placeholder, name, type, onChange, errors = [] } = props;

  const [error, setError] = useState('');

  useEffect(() => {
    const message = errors
      .filter(error => error.key === name)
      .concat({ message: '' })[0].message;

    setError(message);
  }, [name, errors]);
```

infoinput 컴포넌트 props 받고 상태 정의

```jsx
return (
    <DivInputIcon>
      <IInputIcon img={img} check={!!error} />
      <InputAccount
        placeholder={placeholder}
        name={name}
        type={type}
        autoComplete="off"
        onChange={onChange}
        check={!!error}
      />
      {error && <PErrorMsg>{error}</PErrorMsg>}
    </DivInputIcon>
```

각 스타일드컴포넌트에 값 전달하며 에러메시지 조건부로 렌더링

```js
const setValidationResult = (key, data) => {
    let nextState = errors.filter(error => error.key !== key);
    if (data) {
      nextState = nextState.concat({
        key,
        message: data,
      });
    }
    setErrors(prevState => {
      return [...prevState, ...nextState];
    });
```

이전 값을 설정하고 다음값에서setError를 할때 이전 값이 반영되기 전에 다음 함수가 실행이 되서 밀렸다. setError에서 바로 값을 바꾸는 것이 아니라 인자에 객체가 아닌 함수를 넣어서 이전값을 인자로 받고 이전값에 다음 값을 더해주었다.
