---
title: "second_project"
date: "2020-01-24T10:43:32.169Z"
template: "post"
draft: false
slug: "/posts/sec_project/"
category: "project"
description: "위고플레이트 2차프로젝트"
tags:
  - "project"
---
# WegoPlate Project
## 1. 프로젝트 소개
### mangoplate 클론 (2주)
## 2. 사용한 기술
### HTML/SCSS/JavaSciript/React/ReactHooks/styled-compomnent/redux
## 3. 나의 역할
* ### 레스토랑 상세페이지
* ### 탑리스트 페이지 
* ### 맛집리스트 페이지

## 4. 프로젝트를 진행하며 잘했다고 느껴지는 부분
* ### 라이브러리에 의존하지 않고 자바스크립트로 이미지 캐러셀 해결
* ### 백앤드와 적극적으로 소통하며 리뷰부분 API주고받는 작업을 원활하게 끝냄
* ### 외관은 최대한 비슷하게 클론하기

## 5. 프로젝트를 진행하며 나온 문제들
### 5.1 상세 페이지
#### 상세 페이지 가장 처음 작업할 부분이 이미지 캐러셀 구현이었다. 라이브러리를 사용하지 않고 구현해보자 라는 목표를 가지고 시작했는데 처음부터 어려운 부분이 나와서 작업속도도 안나오고 막막했다.
```Jsx
const moveImg = px => {
    if (leftPx <= 0 && (imgList.length - 1) * -714 < leftPx) setLeft(px);
    else {
      setLeft(0);
    }
  };

<Wrapper>
      <AbsolDiv left={leftPx}>{imgMap}</AbsolDiv>
      <MoveBtn onClick={() => moveImg(leftPx + 714)} />
      <MoveBtn
        onClick={() => moveImg(leftPx - 714)}
        first={-935}
        second={-332}
        left={660}
      />
</Wrapper>

const MoveBtn = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ left }) => left || 0}px;
  margin-top: -16px;
  cursor: pointer;
  background-image: url("https://mp-seoul-image-develop-s3.mangoplate.com/web/resources/2018022864551sprites_desktop.png?fit=around|*:*&crop=*:*;*,*&output-format=png&output-quality=110");
  background-position: ${({ first }) => first || -935}px
    ${({ second }) => second || -281}px;
  width: 28px;
  height: 45px;
  opacity: 0.5;
  margin-left: 10px;

  &:hover {
    opacity: 1;
  }
`;
};
```
#### 스타일드 컴포넌트의 props를 활용하여 구현하였는데, 쭉 늘어진 imglist들을 overflowhidden 처리하고 부모 div크기를 한이미지의 크기만큼 하였고 온클릭 이벤트에 left값을 사진한장의 크기만큼 처리하도록 하였다.

#### 리뷰부분을 구현해야하는데 리뷰에서 평점을 좋다, 괜찮다, 나쁘다 세 가지로 분류하며 해당 평점을 클릭할때마다 그에 해당하는 리뷰가 나오고 더보기 기능이 있으며 백앤드 데이터와 연결을 원활하게 시켜야 했다.
```Jsx
const onClick = (key, num) => {
    setFilter({
      all: "false",
      good: "false",
      soso: "false",
      bad: "false"
    });
    setFilter({
      [key]: "true"
    });
    setRating([]);
    fetchData(`${API_URL}/restaurant/${props.params}/review?taste=${num}`).then(
      res => {
        setRating(res);
      }
    );
  };

<ButtonFilterBtn
    filter={reviewFilter.bad}
    onClick={() => onClick("bad", 3)}
    last={true}
   >
    별로<SpanFilterCount>({number.bad_count})</SpanFilterCount>
</ButtonFilterBtn>
```
#### 각각의 버튼에 온클릭 이벤트를 주고 인자로 filterState를 관리하는 key와 API호출에 필요한 num을 넘겨주어서 구분을 지어주었다. 고민을 많이 한 부분이어서 기능이 잘 구현되었을때 기분이 굉장히 좋았다. 백앤드와 의사소통을 하며 협업의 재미도 느낀 부분이었다.
### 더보기 기능
```jsx
useImperativeHandle(ref, () => ({
    moreOnClick() {
      console.log(ratingReview);
      fetchData(
        `http://10.58.7.97:8000/restaurant/${
          props.params
        }/review?taste=${stateCheck()}&offset=${ratingReview.offset + 1}`
      ).then(res => {
        const copy = Object.assign({}, ratingReview);
        if (copy.result !== res.result) {
          const concatArr = copy.result.concat(res.result);
          copy.result = concatArr;
          copy.offset = res.offset;
        }
        setRating(copy);
      });
    }
  }));

```
#### useImperativeHandle이라는 함수는 부모에서 자식의 메소드를 사용하기 위하여 찾아본 메소드인데 단순히 ref를 사용하여 끌어올릴 수 있을줄 알았는데 안되길래 찾아본 방법이다. 더보기를 누를 때 해당 리뷰가 좋아요인지 싫어요인지 괜찮아요인지 구분을 해야했고, 몇번째 데이터를 받아야하는지 구분을 했어야했는데, 백앤드에서 offset을 데이터가 바뀔때마다 보내주어서 그 offset데이터를 받아서 대입을 시켰다. 계속 누르면 마지막 데이터를 계속 받아서 if문을 걸어주었다.
```jsx
const stateCheck = () => {
    if (reviewFilter.all) return 4;
    else if (reviewFilter.good) return 1;
    else if (reviewFilter.soso) return 2;
    else if (reviewFilter.bad) return 3;
  };

const ratingText = index => {
    if (rate[index].rating === "good") return "맛있다";
    else if (rate[index].rating === "soso") return "괜찮다";
    else return "나쁘다";
  };
```
#### 해당 현재 상태를 확인하기 위하여 현재상태에 따라 리턴을 해주는 함수를 만들고 함수호출을 하여 api요청에 쓰거나 리뷰평가의 동적인 이미지 사용을 할때 사용하였다.

### 기록하고 싶은 코드
```jsx
const ToastContainer = toggle => {
  return <ToastView toggle={toggle} />;
};

const mapStateToProps = state => ({ show: state.showToast.show });
const mapDispatchToProps = dispatch => ({
  toggle: () => dispatch(toggle())
});

export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
```
#### 이번에 프로젝트를 하면서 처음으로 Redux를 적용했다. 액션이며 리듀서며 디스패치며 개념이 이해하기 어렵고 힘들었지만 간단한 기능은 적용 시킬 수 있었다. 상세페이지 index.js에서 useDispatch와 useSelector를 사용해서 connect를 하지 않고 전역 상태와 디스패치에 접근을 해서 사용을 했다. 개념이아직 명확하게 자리잡히지 않아서 더 공부해야 할 것 같다. 스타일드컴포넌트도 첫 사용이어서 어느정도 찾아보면서 사용하긴 했지만, 활용도가 무궁무진 하고 아주 효율적으로 쓸 수 있을것같다. 더 열심히 배워야겠다고 프로젝트를 진행하며 절실히 느꼈다.