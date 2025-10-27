import { expressjwt } from 'express-jwt';
import 'dotenv/config';
export const requireSignin = expressjwt({ 
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});