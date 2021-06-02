import userapi from "../apis/user";

const create = async (user) => {
  try {
    const res = await userapi.post("", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(user),
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

const list = async (token) => {
  try {
    const res = await userapi.get("", {
      cancelToken: token,
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, creds, token) => {
  try {
    const res = await userapi.get(params.userId, {
      cancelToken: token,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer" + creds.t,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, creds, user) => {
  try {
    const res = await userapi.delete(params.userId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer" + creds.t,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

const update = async (params, creds, user) => {
  try {
    const res = await userapi.put(params.userId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer" + creds.t,
      },
      data: JSON.stringify(user),
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export { create, list, read, remove, update };
