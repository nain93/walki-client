import React, { useState } from "react";
import styled from "styled-components";
import { Body3Text, H3Text, theme } from "../../styles/theme";
import { Dimensions, View } from "react-native";
import tokiImg from "../../../assets/images/toki_character.png";
import bookiImg from "../../../assets/images/booki_character.png";
import LongButton from "../../components/LongButton";
import { useMutation, gql, useQuery } from "@apollo/client";
import { coachSelect } from "../../../apollo";
import Loading from "../../components/Loading";
import { d2p, h2p } from "../../common/utils";
import { getBottomSpace } from "react-native-iphone-x-helper";

const TokiBookiSelect = ({ navigation }) => {
  const [isClick, setIsClick] = useState("");
  const PUT_MEMBER_MUTATION = gql`
    mutation putMember($member: MemberInput) {
      putMember(member: $member) {
        coach {
          name
        }
      }
    }
  `;

  const GET_COACHES_QUERY = gql`
    query getCoaches {
      getCoaches {
        id
      }
    }
  `;

  const [putMemberMutation] = useMutation(PUT_MEMBER_MUTATION, {
    onCompleted: (data) => console.log(data, "data"),
  });
  const { data, loading } = useQuery(GET_COACHES_QUERY);

  const handleGoToNext = async () => {
    if (!loading) {
      if (isClick === "toki") {
        await putMemberMutation({
          variables: {
            member: {
              coachId: data.getCoaches[0].id,
            },
          },
        });
        await coachSelect("toki");
      } else if (isClick === "booki") {
        await putMemberMutation({
          variables: {
            member: {
              coachId: data.getCoaches[1].id,
            },
          },
        });
        await coachSelect("booki");
      }
    }
    navigation.navigate("BeforeStart");
  };


  return (
    <>
      <Container >
        <TokiBox selected={isClick === "toki"} onPress={() => setIsClick("toki")}>
          <Wrapper>
            <TokiBookiImg source={tokiImg} resizeMode="contain" />
            <TitleBox>
              <TokiTitle selected={isClick === "toki"}>?????? ??????</TokiTitle>
              <Desc>????????? ???????????? ?????????????</Desc>
            </TitleBox>
          </Wrapper>
        </TokiBox>
        <BookiBox selected={isClick === "booki"} onPress={() => setIsClick("booki")}>
          <Wrapper>
            <TokiBookiImg source={bookiImg} resizeMode="contain" />
            <TitleBox>
              <BookiTitle selected={isClick === "booki"}>?????? ??????</BookiTitle>
              <Desc>????????? ????????? ?????????????</Desc>
            </TitleBox>
          </Wrapper>
        </BookiBox>
      </Container>
      <LongButton
        handleGoToNext={handleGoToNext}
        disabled={!isClick}
        btnBackColor={theme.grayScale.black}
      >
        ?????? ??????
      </LongButton>
    </>
  );
};

const Container = styled.View`
  margin-top: ${d2p(20)}px;
  margin-bottom: auto;
`;

const TokiBookiStyle = styled.TouchableOpacity`
  width: 100%;
  height: ${d2p(122)}px;
  background-color: ${theme.grayScale.gray7};
  margin-bottom: ${d2p(10)}px;
  border-radius: 16px;
  padding: 10px 40px;
`;

const TokiBox = styled(TokiBookiStyle)`
  border: ${(props) =>
    props.selected ? `2px solid ${theme.toki.color.main}` : "none"};
`;

const BookiBox = styled(TokiBookiStyle)`
  border: ${(props) =>
    props.selected ? `2px solid ${theme.booki.color.main}` : "none"};
`;

const Wrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TokiBookiImg = styled.Image`
  width: 80px;
  height: 91px;
`;

const TitleBox = styled.View`
  width: 60%;
`;

const NameTitle = styled(H3Text)`
  margin-bottom: 10px;
`;

const Desc = styled(Body3Text)`
  color: ${theme.grayScale.gray3};
`;

const TokiTitle = styled(NameTitle)`
  color: ${(props) =>
    props.selected ? theme.toki.color.main : theme.grayScale.gray1};
`;

const BookiTitle = styled(NameTitle)`
  color: ${(props) =>
    props.selected ? theme.booki.color.main : theme.grayScale.gray1};
`;

export default TokiBookiSelect;
