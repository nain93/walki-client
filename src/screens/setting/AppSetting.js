import React, { useEffect, useState } from "react";
import { View, Text, AppState, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { H1Text, theme, Body1Text, Body3Text } from "../../styles/theme";
import AndroidOpenSettings from "react-native-android-open-settings";
import { check, PERMISSIONS } from "react-native-permissions";
import PushNotification from "react-native-push-notification";
import { coachColorVar } from "../../../apollo";

const AppSetting = ({ navigation }) => {
  const [notiCheck, setNotiCheck] = useState(true);
  const [detailCheck, setDetailCheck] = useState(true);

  useEffect(() => {
    if (Platform.OS === "android") {
      PushNotification.checkPermissions((permissions) => {
        setNotiCheck(permissions.alert);
      });
      check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then((check) => {
        if (check === "granted") {
          setDetailCheck(true);
        } else if (check === "blocked") {
          setDetailCheck(false);
        }
      });
    }
  }, [])

  const handleOnOfPush = () => {
    if (Platform.OS === "android") {
      openDroidSetting(AndroidOpenSettings.appNotificationSettings).then(() => {
        PushNotification.checkPermissions((permissions) => {
          setNotiCheck(permissions.alert);
        });
      });
    }
  };
  const handleOnOfInfo = () => {
    if (Platform.OS === "android") {
      openDroidSetting(AndroidOpenSettings.appDetailsSettings).then(() => {
        check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then((check) => {
          if (check === "granted") {
            setDetailCheck(true);
          } else if (check === "blocked") {
            setDetailCheck(false);
          }
        });
      });
    }
  };

  const openDroidSetting = (settingFunc) => {
    return new Promise((resolve, reject) => {
      const listener = (state) => {
        if (state === "active") {
          changeListener?.remove()
          resolve();
        }
      };
      const changeListener = AppState.addEventListener("change", listener);
      try {
        settingFunc();
      } catch (e) {
        changeListener?.remove()
        reject(e);
      }
    });
  };

  const { gray1, gray2, gray3, gray6 } = theme.grayScale;
  return (
    <Container>
      <Wrap>
        <H1Text>?????????</H1Text>
        <View>
          <SettingWrap onPress={handleOnOfPush}>
            <Body1Text style={{ color: gray2 }}>????????????</Body1Text>
            <Text style={{ color: coachColorVar().color.main }}>
              {notiCheck ? "ON" : "OFF"}
            </Text>
          </SettingWrap>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: gray6,
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Body3Text
              style={{
                color: gray3,
              }}
            >
              {`?????? ????????? ?????? ????????? ???????????? ?????? > walki > ????????? \n?????? ????????? ??? ????????????.`}
            </Body3Text>
          </View>

          <SettingWrap
            style={{
              borderBottomWidth: 1,
              borderBottomColor: gray6,
              paddingTop: 20,
              paddingBottom: 20,
            }}
            onPress={handleOnOfInfo}
          >
            <Body1Text style={{ color: gray2 }}>??? ?????? ?????? ??????</Body1Text>
            <Text style={{ color: coachColorVar().color.main }}>
              {detailCheck ? "ON" : "OFF"}
            </Text>
          </SettingWrap>
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderBottomColor: gray6,
              paddingTop: 20,
              paddingBottom: 20,
            }}
            onPress={() => navigation.navigate("OpenSource")}
          >
            <Body1Text style={{ color: gray2 }}>???????????? ????????????</Body1Text>
          </TouchableOpacity>
        </View>

        <Version>
          <Body1Text style={{ color: gray1 }}>??????</Body1Text>
          <Text style={{ color: gray3 }}>1.0.0</Text>
        </Version>
      </Wrap>
    </Container>
  );
};

const Container = styled.View`
  padding: 0 30px;
  flex: 1;
`;

const Wrap = styled.View`
  justify-content: space-around;
  flex: 0.6;
`;

const SettingWrap = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Version = styled.View`
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default AppSetting;
