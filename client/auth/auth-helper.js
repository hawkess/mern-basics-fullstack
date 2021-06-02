function authenticate(jwt, cb) {
  if (typeof window !== "undefined")
    sessionStorage.setItem("jwt", JSON.stringify(jwt));
  cb();
}

function isAuthenticated() {
  if (typeof window !== "undefined" && sessionStorage.getItem("jwt"))
    return JSON.parse(sessionStorage.getItem("jwt"));
  return false;
}

export { authenticate, isAuthenticated };
