import { expressjwt } from "express-jwt";
import "dotenv/config";

export const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET || "fallback_secret_for_dev", // Use a fallback only if .env fails
  algorithms: ["HS256"],
  requestProperty: "auth", // This puts the user ID in req.auth.id
});