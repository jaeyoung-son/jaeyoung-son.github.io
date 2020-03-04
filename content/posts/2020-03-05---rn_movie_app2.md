---
title: '리액트 네이티브 영화앱 만들기2'
date: '2020-03-05T12:10:32.169Z'
template: 'post'
draft: false
slug: '/posts/rn_movie_app2/'
category: 'react_native'
description: '리액트 네이티브 영화앱  만들기'
tags:
  - 'react-native'
---

## MovieHome 컴포넌트

```tsx
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import styled from 'styled-components/native';

import BitCatalogList from './BigCatalogList';
import SubCatalogList from './SubCatalogList';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #141414;
`;

const StyleButton = styled.TouchableOpacity`
  padding: 8px;
`;

const Icon = styled.Image``;

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

const MovieHome = ({ navigation }: Props) => {
  const _logout = () => {
    AsyncStorage.removeItem('key');
    navigation.navigate('LoginNavigator');
  };

  useEffect(() => {
    navigation.setParams({
      logout: _logout
    });
  }, []);

  return (
    <Container>
      <BitCatalogList
        url="https://yts.lt/api/v2/list_movies.json?sort_by=like_count&order_by=desc&limit=5"
        onPress={(id: number) => {
          navigation.navigate('MovieDetail', {
            id
          });
        }}
      />
      <SubCatalogList
        title="최신 등록순"
        url="https://yts.lt/api/v2/list_movies.json?sort_by=date_added&order_by=desc&limit=10"
        onPress={(id: number) => {
          navigation.navigate('MovieDetail', {
            id
          });
        }}
      />
      <SubCatalogList
        title="평점순"
        url="https://yts.lt/api/v2/list_movies.json?sort_by=rating&order_by=desc&limit=10"
        onPress={(id: number) => {
          navigation.navigate('MovieDetail', {
            id
          });
        }}
      />
      <SubCatalogList
        title="다운로드순"
        url="https://yts.lt/api/v2/list_movies.json?sort_by=download_count&order_by=desc&limit=10"
        onPress={(id: number) => {
          navigation.navigate('MovieDetail', {
            id
          });
        }}
      />
    </Container>
  );
};

interface INaviProps {
  navigation: NavigationScreenProp<NavigationState>;
}

MovieHome.navigationOptions = ({ navigation }: INaviProps) => {
  const logout = navigation.getParam('logout');

  return {
    title: 'MOVIEAPP',
    headerTintColor: '#E70915',
    headerStyle: {
      backgroundColor: '#141414',
      borderBottomWidth: 0
    },
    headerTitleStyle: {
      fontWeight: 'bold'
    },
    headerBackTitle: null,
    headerRight: (
      <StyleButton
        onPress={() => {
          if (logout && typeof logout === 'function') {
            logout();
          }
        }}
      ></StyleButton>
    )
  };
};

export default MovieHome;
```

로그아웃 기능 구현을 위해 AsyncStorage를 사용하고 로그아웃을 누르면 키를 제거하고 로그인 네비게이션으로 이동한다 useEffect를 사용하여 로그아웃 함수를 setParams를 사용하여 navigation에 매개변수를 설정한다. navigation을 사용하는 모든 부분에서 이 매개변수를 사용할 수 있다.
headerBackTitle 에 null을 대입함으로써 뒤로가기 버튼의 제목을 제거했다.

## BigCatalogList 컴포넌트

가장 상단에 표시된 영화 리스트 컴포넌트

```tsx
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import BigCatalog from '~/Components/BigCatalog';

const Container = styled.View`
  height: 300px;
  margin-bottom: 8px;
`;

interface Props {
  url: string;
  onPress: (id: number) => void;
}

const BigCatalogList = ({ url, onPress }: Props) => {
  const [data, setData] = useState<Array<IMovie>>([]);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setData(res.data.movies);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <Container>
      <FlatList
        horizontal={true}
        pagingEnabled={true}
        data={data}
        keyExtractor={(item, index) => {
          return `bigScreen-${index}`;
        }}
        renderItem={({ item, index }) => (
          <BigCatalog
            id={(item as IMovie).id}
            image={(item as IMovie).large_cover_image}
            year={(item as IMovie).year}
            title={(item as IMovie).title}
            genres={(item as IMovie).genres}
            onPress={onPress}
          />
        )}
      />
    </Container>
  );
};

export default BigCatalogList;
```

영화 리스트 데이터를 저장할 state가 필요해서 useState상태에 IMovie 타입의 배열 데이터를 저장하도록 선언했다. 이 리스트들은 FlatList를 사용하여 화면에 표시 FlatList는 가로로 스크롤이 되도록 horizontal을 설정하였고 가로로 스크롤을 할 때 한 리스트 아이템이 한 화면에 보이도록 pagingEnabled를 설정했다.

## BigCatalog 컴포넌트

```tsx
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  id: number;
  image: string;
  year: number;
  title: string;
  genres: Array<string>;
  onPress?: (id: number) => void;
}

const BigCatalog = ({ id, image, title, year, genres, onPress }: Props) => {
  return (
    <Container
      activeOpacity={1}
      onPress={() => {
        if (onPress && typeof onPress === 'function') {
          onPress(id);
        }
      }}
    >
      <CatalogImage
        source={{ uri: image }}
        style={{ width: Dimensions.get('window').width, height: 300 }}
      />
      <InfoContainer>
        <LabelYear>{year}년 개봉</LabelYear>
        <SubInfoContainer>
          <Background />
          <LabelTitle>{title} </LabelTitle>
          <LabelGenres> {genres.join(',')} </LabelGenres>
        </SubInfoContainer>
      </InfoContainer>
    </Container>
  );
};

export default BigCatalog;
```

부모로부터 받은 Props를 화면에 표시하는 컴포넌트. 화면에 표시할 이미지를 URL형식으로 받게된다. Image의 source에 uri를 사용하며 style을 이용하여 이미지 사이즈를 꼭 설정해야한다. 리액트네이티브에서 제공하는 Dimensions를 통해 단말기 화면의 전체 가로 사이즈를 가져와 이미지 사이즈에 적용하여 꽉 채우도록 했다.

## SubCatalogList 컴포넌트

```tsx
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import styled from 'styled-components/native';

interface Props {
  title: string;
  url: string;
  onPress: (id: number) => void;
}

const SubCatalogList = ({ title, url, onPress }: Props) => {
  const [data, setData] = useState<Array<IMovie>>([]);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setData(res.data.movies);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <InfoContainer>
        <Title> {title} </Title>
      </InfoContainer>
      <CatalogContainer>
        <FlatList
          horizontal={true}
          data={data}
          keyExtractor={(item, index) => {
            return `catalogList-${(item as IMovie).id}${index}}`;
          }}
          renderItem={({ item, index }) => (
            <CatalogImageContainer
              activeOpacity={1}
              onPress={() => {
                onPress((item as IMovie).id);
              }}
            >
              <CatalogImage
                source={{ uri: (item as IMovie).large_cover_image }}
                style={{ width: 136, height: 201 }}
              />
            </CatalogImageContainer>
          )}
        />
      </CatalogContainer>
    </Container>
  );
};

export default SubCatalogList;
```

useState로 컴포넌트에서 사용할 데이터를 정의하고 FlatList를 통해 가로 스크롤로 화면에 표시한다. pagingEnabled를 사용하지 않기에 스크롤이 가능한 컴포넌트

## MovieDetail 컴포넌트

```tsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import BigCatalog from '~/Components/BigCatalog';
import CastList from './CastList';
import ScreenShotList from './ScreenShotList';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

const MovieDetail = ({ navigation }: Props) => {
  const [data, setData] = useState<IMovieDetail>();

  useEffect(() => {
    const id = navigation.getParam('id');
    fetch(
      `https://yts.lt/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
    )
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setData(res.data.movie);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return data ? (
    <Container>
      <BigCatalog
        id={data.id}
        image={data.large_cover_image}
        year={data.year}
        title={data.title}
        genres={data.genres}
      />
      <SubInfoContainer>
        <ContainerTitle>영화 정보</ContainerTitle>
        <InfoContainer>
          <LabelInfo> {data.runtime}분 </LabelInfo>
          <LabelInfo> 평점:{data.rating} </LabelInfo>
          <LabelInfo> 좋아요:{data.like_count} </LabelInfo>
        </InfoContainer>
      </SubInfoContainer>
      <DescriptionContainer>
        <ContainerTitle>줄거리</ContainerTitle>
        <Description> {data.description_full} </Description>
      </DescriptionContainer>
      {data.cast && <CastList cast={data.cast} />}
      <ScreenShotList
        images={[
          data.large_screenshot_image1,
          data.large_screenshot_image2,
          data.large_screenshot_image3
        ]}
      />
    </Container>
  ) : (
    <LoadingContainer>
      <ActivityIndicator size="large" color="#E70915" />
    </LoadingContainer>
  );
};

MovieDetail.navigationOptions = {
  title: 'MOVIEAPP',
  headerTintColor: '#E70915',
  headerStyle: {
    backgroundColor: '#141414',
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    fontWeight: 'bold'
  },
  headerBackTitle: null
};

export default MovieDetail;
```

영화 ID를 네비게이션의 매개변수로 설정하여 상세 화면으로 이동하도록 하였다.
이렇게 네비게이션으로 화면을 이동할 때, 매개변수로 전달할 수 있으며, navigation.getParams로 전달받은 매개변수를 가져올 수 있다.
