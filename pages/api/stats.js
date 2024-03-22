import jwt from "jsonwebtoken";
import { findVideoIdByUser, insertStats, updateStats } from "@/lib/db/hasura";
import { verifyToken } from "@/lib/utils";

export default async function stats(req, res) {
  //   if (req.method === "POST") {
  // console.log({ cookies: req.cookies });
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send({});
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;
      if (videoId) {
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // const videoId = req.query.videoId;
        // console.log({ decodedToken });

        const userId = await verifyToken(token);

        const videoStats = await findVideoIdByUser(token, userId, videoId);
        const videoStatsExist = videoStats?.length > 0;
        console.log({ videoStatsExist });
        if (req.method === "POST") {
          const { watched = true, favourited } = req.body;
          if (videoStatsExist) {
            // update video
            const response = await updateStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            return res.send({
              message: "It works",
              // decodedToken,
              videoStatsExist,
              updateStats: response,
            });
          } else {
            // add video
            const response = await insertStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            return res.send({
              message: "It works",
              videoStatsExist,
              insertStats: response,
            });
          }
        } else {
          if (videoStatsExist) {
            return res.send(videoStats);
          } else {
            return res.status(404).send({ msg: "Video/Stats not found" });
          }
        }
      }
    }
  } catch (err) {
    console.error("There was something wrong /stats", err);
    return res.status(500).send({ done: false, error: err?.message });
  }

  // try {
  //   const token = req.cookies.token;
  //   if (!token) {
  //     return res.status(403).send({});
  //   } else {
  //     const { watched = true, favourited, videoId } = req.body;
  //     if (videoId) {
  //       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //       // const videoId = req.query.videoId;
  //       console.log({ decodedToken });

  //       const userId = decodedToken.issuer;

  //       const videoStats = await findVideoIdByUser(token, userId, videoId);
  //       const videoStatsExist = videoStats?.length > 0;
  //       console.log({ videoStatsExist });
  //       if (videoStatsExist) {
  //         // update video
  //         const response = await updateStats(token, {
  //           favourited,
  //           watched,
  //           userId,
  //           videoId,
  //         });
  //         return res.send({
  //           message: "It works",
  //           // decodedToken,
  //           videoStatsExist,
  //           updateStats: response,
  //         });
  //       } else {
  //         // add video
  //         const response = await insertStats(token, {
  //           favourited,
  //           watched,
  //           userId,
  //           videoId,
  //         });
  //         return res.send({
  //           message: "It works",
  //           videoStatsExist,
  //           insertStats: response,
  //         });
  //       }
  //     }
  //   }
  // } catch (err) {
  //   console.error("There was something wrong /stats", err);
  //   return res.status(500).send({ done: false, error: err?.message });
  // }
  //   } else {
  //     try {
  //       const token = req.cookies.token;
  //       if (!token) {
  //         return res.status(403).send({});
  //       } else {
  //         const { videoId } = req.body;
  //         if (videoId) {
  //           const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //           console.log({ decodedToken });

  //           const userId = decodedToken.issuer;

  //           const videoStats = await findVideoIdByUser(token, userId, videoId);
  //           const videoStatsExist = videoStats?.length > 0;
  //           console.log({ videoStatsExist });
  //           if (videoStatsExist) {
  //             return res.send(videoStats);
  //           } else {
  //             return res.status(404).send({ msg: "Video/Stats not found" });
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error("There was something wrong /stats", err);
  //       return res.status(500).send({ done: false, error: err?.message });
  //     }
  //   }
}
