import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log({ decodedToken });

    const userId = decodedToken?.issuer;

    return userId;
  } else return null;
}
