const getErrMessage = (err) => {
  let message = "";
  if (err.code) {
    if (err.code === 11000 || err.code === 11001) {
      message = getUniqueErrMessage(err);
    } else {
      message = "Something went wrong.";
    }
  } else {
    for (let e in err.errors) {
      message = err.errors[e].message
        ? err.errors[e].message
        : "Something went wrong.";
    }
  }

  return message;
};

const getUniqueErrMessage = (err) => {
  let message = "";
  try {
    let field = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.message.lastIndexOf("_1")
    );
    message =
      field.charAt(0).toUpperCase() + field.slice(1) + " already exists.";
  } catch (exc) {
    message = "Unique attribute already exists.";
  }
  return message;
};

export default { getErrMessage, getUniqueErrMessage };
