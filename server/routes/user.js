import express from "express";
import user from "../controllers/user";

const router = express.Router();

router.route("/api/users").get(user.list).post(user.create);

router
  .route("/api/users/:userId")
  .get(auth.requireAuth, user.read)
  .put(auth.requireAuth, auth.hasAuth, user.update)
  .delete(auth.requireAuth, auth.hasAuth, user.remove);

router.param("userId", user.userById);

export default router;
