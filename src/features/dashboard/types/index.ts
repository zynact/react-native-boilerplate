import type { NavigationProp, RouteProp } from '@react-navigation/native';

export type DashboardStackParamList = {
  DashboardHome: undefined;
};

export type DashboardNavigationProp<T extends keyof DashboardStackParamList> = NavigationProp<
  DashboardStackParamList,
  T
>;

export type DashboardRouteProp<T extends keyof DashboardStackParamList> = RouteProp<
  DashboardStackParamList,
  T
>;

export interface DashboardScreenProps<T extends keyof DashboardStackParamList> {
  navigation: DashboardNavigationProp<T>;
  route: DashboardRouteProp<T>;
}
