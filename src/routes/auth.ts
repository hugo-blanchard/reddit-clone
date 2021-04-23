import { Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import User from "../entities/User";
import auth from "../middleware/auth";
import user from "../middleware/user";

const mapErrors = (errors: Object[]) =>
  errors.reduce((acc: any, err: any) => {
    acc[err.property] = Object.values(err.constraints)[0];
    return acc;
  }, {});

const router = Router();

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    // Validate data
    const user = new User({ email, username, password });

    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      return res.status(400).json(mapErrors(validationErrors));
    }

    let doesExistErrors: any = {};

    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser) doesExistErrors.email = "Email is already taken";
    if (usernameUser) doesExistErrors.username = "Username is already taken";

    if (Object.keys(doesExistErrors).length > 0) {
      return res.status(400).json(doesExistErrors);
    }

    // Create the user
    await user.save();

    // Return the user
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = "Username must not be empty";
    if (typeof username !== "string") errors.username = "Username must be a string";
    if (isEmpty(password)) errors.password = "Password must not be empty";
    if (typeof password !== "string") errors.password = "Password must be a string";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ username: "User not found" });

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) return res.status(401).json({ password: "Password is incorrect" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET!);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const me = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );

  return res.status(200).json({ success: true });
};

router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", user, auth, logout);

export default router;
