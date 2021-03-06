import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import LongButton from "../../components/LongButton";
import { H2Text, theme } from "../../styles/theme";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { coachColorVar, userNameVar } from "../../../apollo";
import deleteIcon from "../../../assets/icons/delete.png";
import { d2p } from "../../common/utils";

const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;

const EditName = ({
  navigation,
  route: {
    params: { name, profileImage },
  },
}) => {
  const PUT_MEMBER_MUTATION = gql`
    mutation putMember($member: MemberInput) {
      putMember(member: $member) {
        name
      }
    }
  `;
  const { register, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      name,
    },
  });
  const inputWatch = watch("name");
  const newName = getValues("name");
  const [errorMessage, setErrorMessage] = useState(null);
  const InputRef = useRef();

  const [putMemberMutation, { loading, data, error }] = useMutation(
    PUT_MEMBER_MUTATION,
    {
      onCompleted: (data) => {
        userNameVar({
          name: data.putMember.name,
          profileImage,
        });
      },
    }
  );

  const dismissKeyBoard = () => {
    Keyboard.dismiss();
  };

  const handleGoToNext = () => {
    if (inputWatch === name || inputWatch === "") {
      return;
    }
    if (!loading) {
      putMemberMutation({
        variables: {
          member: {
            name: newName,
          },
        },
      });
      navigation.goBack();
    }
  };

  const handleDeleteInput = () => {
    setValue("name", "");
  };

  useEffect(() => {
    InputRef?.current?.focus();
  }, []);

  useEffect(() => {
    register("name", {
      required: true,
      minLength: 3,
    });
    register("name", {
      required: true,
      maxLength: 8,
    });
    register("name", {
      required: true,
      pattern: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/,
    });
  }, [register]);

  useEffect(() => {
    if (newName.length < 3) {
      setErrorMessage("최소 3글자 이상 입력해야합니다.");
      return;
    }
    if (newName.length > 8) {
      setErrorMessage("최대 8글자 까지 가능합니다.");
      return;
    }
    if (/\s/g.test(newName)) {
      setErrorMessage("띄어쓰기 입력은 불가능합니다");
      return;
    }
    if (!regex.test(newName)) {
      setErrorMessage("특수문자 입력은 불가능합니다");
      return;
    }
    setErrorMessage("");
  }, [newName]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyBoard}>
      <Container>
        <HeaderTitle>이름 변경</HeaderTitle>
        <NameInputWrap>
          <NameInput
            ref={InputRef}
            defaultValue={newName ? newName : ""}
            onChangeText={(text) => setValue("name", text)}
            onSubmitEditing={handleSubmit(handleGoToNext)}
          />
          <TouchableOpacity onPress={handleDeleteInput}>
            <Image
              source={deleteIcon}
              style={{ width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </NameInputWrap>
        {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : <></>}
        <AlertText>
          {`한글 및 영문, 숫자만 사용 가능하며 \n최대 8글자까지만 등록 가능합니다`}
        </AlertText>
        <LongButton
          handleGoToNext={handleSubmit(handleGoToNext)}
          disabled={errorMessage || inputWatch === name}
          btnBackColor={coachColorVar().color.main}
          loading={loading}
        >
          변경하기
        </LongButton>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.View`
  flex: 1;
  padding-top: ${d2p(16)}px;
  padding-left: ${d2p(38)}px;
  padding-right: ${d2p(38)}px;
  align-items: center;
`;

const HeaderTitle = styled(H2Text)`
  margin: 15px 0px;
`;

const NameInputWrap = styled.View`
  flex-direction: row;
  width: 100%;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.grayScale.gray7};
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid ${theme.grayScale.gray5};
  padding: 0 10px;
`;

const NameInput = styled.TextInput`
  width: 80%;
`;

const ErrorText = styled.Text`
  color: red;
  text-align: left;
  width: 100%;
  margin-bottom: 15px;
`;

const AlertText = styled.Text`
  color: black;
  text-align: left;
  width: 100%;
  margin-bottom: 15px;
`;

export default EditName;
