import { NavigationActions, StackActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function reset(index, route) {
  _navigator.dispatch(
    StackActions.reset({
      index,
      actions: [NavigationActions.navigate({ routeName: route })],
    })
  );
}

function push(route) {
  _navigator.dispatch(StackActions.push(route));
}

function pop(count) {
  _navigator.dispatch(StackActions.pop(count));
}

export default {
  navigate,
  reset,
  push,
  pop,
  setTopLevelNavigator,
};
