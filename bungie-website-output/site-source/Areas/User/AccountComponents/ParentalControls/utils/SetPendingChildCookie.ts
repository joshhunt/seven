import cookie from "js-cookie";

const setPendingChildCookie = () => {
  const url = new URL(window.location.href);
  const requestingChildId = url.searchParams.get("playerId");
  /*TODO: Update expiry with real one set by product*/
  if (requestingChildId) {
    cookie.set("playerId", requestingChildId, { expires: 7 });
  }
};

export default setPendingChildCookie;
