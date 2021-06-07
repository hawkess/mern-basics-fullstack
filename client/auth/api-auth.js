import auth from "../apis/auth";

let sessionJwt;

const login = async (user) => {
  try {
    const res = await auth.post("/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: JSON.stringify(user),
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

const logout = async () => {
  try {
    const res = await auth.get("/logout");
    return res;
  } catch (err) {
    console.log(err);
  }
};

function authenticate(jwt, expiry, noRedirect) {
  sessionJwt = {
    token: jwt,
    expiry: expiry,
  };
  if (!noRedirect) {
  }
}

export { authenticate, login, logout };
