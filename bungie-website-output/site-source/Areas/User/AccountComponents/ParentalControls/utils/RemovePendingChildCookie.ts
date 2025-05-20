import cookie from "js-cookie";

const removePendingChildCookie = () => {
  cookie.remove("playerId");
};

export default removePendingChildCookie;
