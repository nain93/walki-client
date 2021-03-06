import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import Config from "react-native-config";
import { theme } from "./src/styles/theme";
import STOARGE from "./src/constants/stoarge";
import { month, year } from "./src/common/getToday";

export const isLoggedInVar = makeVar(false);
export const isCoachVar = makeVar(true);
export const tokenVar = makeVar("");
export const coachColorVar = makeVar({
  coach: "",
  color: {
    main: "",
    sub: "",
    report: "",
    character: {
      main: "",
      sub: "",
    },
    chart: {
      main: "",
      sub: "",
    },
    primary: {
      tap: "",
      disable: "",
    },
  },
});
export const userNameVar = makeVar({
  name: "",
  profileImage: "",
});
export const alertTimeVar = makeVar({
  ampm: "",
  hour: 0,
  minute: 0,
});

export const statusVar = makeVar("");

export const stepVar = makeVar(0);

export const stepGoalVar = makeVar(0)

export const monthVar = makeVar([
  {
    year,
    month,
  },
]);

const { TOKEN, COACH, STATUS, TIME, ALARM_CHECK, TODAY_CHECK, TODAY, CHALLENGE_START_CHECK } = STOARGE;

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  await AsyncStorage.removeItem(TIME);
  await AsyncStorage.removeItem(STATUS);
  await AsyncStorage.removeItem(ALARM_CHECK);
  await AsyncStorage.removeItem(TODAY_CHECK);
  await AsyncStorage.removeItem(TODAY);
  await AsyncStorage.removeItem(CHALLENGE_START_CHECK);
  isLoggedInVar(false);
  userNameVar({});
  tokenVar("");
  stepVar(0)
  stepGoalVar(0)
  statusVar("home")
};

export const coachSelect = async (coach) => {
  await AsyncStorage.setItem(COACH, coach);
  isCoachVar(true);
  if (coach === "toki") {
    coachColorVar({ coach: "toki", ...theme.toki });
  } else if (coach === "booki") {
    coachColorVar({ coach: "booki", ...theme.booki });
  }
};

export const walkStatus = async (status) => {
  await AsyncStorage.setItem(STATUS, status);
  statusVar(status);
};

export const alertTimeSetting = async (time) => {
  await AsyncStorage.setItem(TIME, JSON.stringify(time));
  alertTimeVar({
    ...time,
  });
};

const httpLink = createHttpLink({
  uri: Config.BACKEND_URL,
});

export const authLink = setContext(({ headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${tokenVar()}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
