import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styled from "styled-components";
import axios from "axios";
import Loading from "../../components/Loading";
import WeatherLogo from "../../../assets/icons/sun.png";
import SpaceLogo from "../../../assets/icons/bar.png";
import { theme } from "../../styles/theme";
import Config from "react-native-config";
import StatusHome from "./StatusHome";
import * as Location from 'expo-location';
import translate from 'translate-google-api';
import Smartlook from 'smartlook-react-native-wrapper';



const Home = ({ navigation }) => {
  const [ready, setReady] = useState(true);
  const [weather, setWeather] = useState({
    temp: 0,
    condition: '',
  });
  const [city, setCity] = useState("")
  const [transCity, setTransCity] = useState("")
  const [weatherPic, setWeatherPic] = useState("");

  // const Location = "강남구";
  const SMARTLOOK_API_KEY = '8858648cf1d106460c611d4f3c6f1dcc806d7bb0';

  const load = async () => {
    const result = await getLocation();
    WeatherSetter(result);
  };
  const WeatherSetter = () => {
    if (weather.condition === "맑음") {
      setWeatherPic(require("../../../assets/icons/cloud.png"));
    } else if (weather.condition === "clouds") {
      setWeatherPic(require("../../../assets/icons/cloud.png"));
    } else if (weather.condition === "비") {
      setWeatherPic(require("../../../assets/icons/rain.png"));
    } else if (weather.condition === "태풍") {
      setWeatherPic(require("../../../assets/icons/thunderstrom.png"));
    } else if (weather.condition === "눈") {
      setWeatherPic(require("../../../assets/icons/snow.png"));
    } else {
      weather.condition === "안개";
      setWeatherPic(require("../../../assets/icons/mist.png"));
    }
  };
  useEffect(() => {
    Smartlook.setUserIdentifier('Input test');
    Smartlook.setupAndStartRecording(SMARTLOOK_API_KEY);

    return () => Smartlook.stopRecording();
  }, []);
  const [currentDate, setcurrentDate] = useState("");
  const [currentTime, setcurrentTime] = useState("");

  useEffect(() => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    hours = hours % 12;
    hours = hours < 10 ? "0" + hours : hours;
    let ampm = hours >= 12 ? "시" : "PM";
    minutes = minutes < 10 ? "0" + minutes : minutes;
    setcurrentDate(month + "월" + " " + date + "일");
    setcurrentTime(hours + ":" + minutes + ampm);
    getLocation();
    load();
  }, []);

  const getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const locationData = await Location.getCurrentPositionAsync();
      const latitude = locationData["coords"]["latitude"];
      const longitude = locationData["coords"]["longitude"];

      const API_KEY = Config.API_KEY;
      // const result = await axios.get(Config.WEATHER_API);
      const result = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)

      const temp = Math.round(result.data.main.temp);
      const condition = result.data.weather[0].main;
      const city = result.data.name
      const coWeather = weather.condition
   
    const resultt = await translate([city, coWeather], {
      from: "en",
      to: "ko",
    },console.log(resultt, '번역'));
      // console.log(result, "결과");
      // console.log(temp, "1");
      // console.log(condition, "2");
      // console.log(city, "도시")
      setCity(city)
      setWeather({
        temp,
        condition,
      });
      console.log(weather.condition);
    } catch (error) {
      // Alert.alert("위치를 찾을 수가 없습니다.", "앱을 껏다 켜볼까요?")
    } finally {
      setReady(false);
    }
  };
  
  if (ready) {
    return (
      <Container style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        <Loading />
      </Container>
    );
  }

  return (
    <Container style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
      <TopStatus>
        <View>
          <CurrentDate>{currentDate}</CurrentDate>
          <CurrentTime>{currentTime}</CurrentTime>
        </View>
        <WeatherStatus>
          <LocationSpace>
            <CurrentTemperature>{weather.temp}</CurrentTemperature>
            <CurrentCity>{city}</CurrentCity>
          </LocationSpace>
          <Text style={{ fontSize: 36 }}>°</Text>
          <BarSpace>
            <WeatherImage source={SpaceLogo} resizeMode={"contain"} />
          </BarSpace>
          <WeatherSpace>
            <WeatherImage source={WeatherLogo} resizeMode={"contain"} />
            <CurrentText>{weather.condition}</CurrentText>
          </WeatherSpace>
        </WeatherStatus>
      </TopStatus>
      <StatusHome navigation={navigation} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 30px;
  background-color: #f3f3f3;
`;

const TopStatus = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const WeatherStatus = styled.View`
  flex-direction: row;
`;
const LocationSpace = styled.View`
  align-items: flex-end;
  padding-bottom: 5px;
  justify-content: space-between;

`;
const WeatherSpace = styled.View`
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;
  padding-top: 3px;
`;

const BarSpace = styled.View`
  justify-content: center;
  margin: 0px;
`;

const CurrentDate = styled.Text`
  font-size: 16px;
  font-weight: bold;

`;

const CurrentTime = styled.Text`
  font-size: 36px;
  font-weight: bold;

`;

const CurrentText = styled.Text`
  font-size: 12px;
  color: ${theme.grayScale.gray3};
`;
const CurrentCity = styled.Text`
font-size: 8px;
justify-content: center;
color: ${theme.grayScale.gray3};
`
const CurrentTemperature = styled.Text`
  font-size: 36px;
`;

const WeatherImage = styled.Image`
  width: 40px;
  height: 40px;
`;

export default Home;
