import cookies from "js-cookie";
import { takeEvery } from "redux-saga/effects";

export function logoutSaga() {
  cookies.remove("authorizationToken");
  window.location.reload();
}

export default function* rootSaga() {
  yield takeEvery("USER_LOGOUT", logoutSaga);
}
