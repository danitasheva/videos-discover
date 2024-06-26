import { magicAdmin } from "@/lib/magic";
import { clearTokenCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/utils";

export default async function logout(req, res) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    const token = req.cookies.token;

    const userId = await verifyToken(token);

    clearTokenCookie(res);

    try {
      await magicAdmin.users.logoutByIssuer(userId);
    } catch (error) {
      console.error("Error occurred while logging out magic user", error);
    }
    //redirects user to login page
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "User is not logged in" });
  }
}
