import auth from "../controllers/auth";
import user from "../controllers/user";

import express from "express";

const router = express.Router();

router.route("/api/users").get(user.list).post(user.create);

router
  .route("/api/users/:userId")
  .get(auth.requireAuth, user.read)
  .put(auth.requireAuth, auth.hasAuth, user.update)
  .delete(auth.requireAuth, auth.hasAuth, user.remove);

router.param("userId", user.userById);

export default router;
