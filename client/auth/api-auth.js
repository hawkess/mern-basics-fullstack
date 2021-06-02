import auth from "../apis/auth";
import { remove } from "../user/api-user";

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

export { login, logout };
