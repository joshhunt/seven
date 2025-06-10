import cookie from "js-cookie";
import { useHistory } from "react-router-dom";

const removePendingChildCookie = () => {
  cookie.remove("playerId");
};

export default removePendingChildCookie;
