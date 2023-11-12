import { UserToken } from "../types/types.js";
import * as fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const __dirname : string = path.dirname(new URL(import.meta.url).pathname);
console.log(__dirname);
const privateKey: string = fs.readFileSync(`${__dirname}/private_key.pam`, 'utf-8');
const publicKey: string = fs.readFileSync(`${__dirname}/public_key.pam`, 'utf-8');

export const signJWT = (object: UserToken, options: any) => {
  try {
    const token: string = jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    }); 
    return token;
  } catch(err) {
    throw err;
  }
}

// export const verifyJWT = (token: string) => {
//   try {
//     jwt.verify(token, publicKey, (err, decoded) => {
//       if(err) {
//         return {
//           valid: false,
//           decoded: null,
//         }
//       } else {
//         return {
//           valid: true,
//           expired: false,
//           decoded,
//         };
//       }
//     });
//   } catch(err) {
//     return {
//       valid: false,
//       decoded: null,
//     }
//   }
// }
