import express from "express";
import user from "../controllers/user";

const router = express.Router();

router.route("/api/users").get(user.list).post(user.create);

router
  .route("/api/users/:userId")
  .get(user.read)
  .put(user.update)
  .delete(user.remove);

router.param("userId", user.userById);

export default router;
