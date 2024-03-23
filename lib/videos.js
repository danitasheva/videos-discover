import videoTestData from "../data/videos.json";
import { getWatchedVideos, getMyListVideos } from "./db/hasura";

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const response = await fetch(
    `https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`
  );

  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT;
    const data = isDev ? videoTestData : await fetchVideos(url);

    if (data?.error) {
      console.error("YouTube API error", data.error);
      return [];
    }

    return data?.items?.map((item) => {
      const id = item.id?.videoId || item.id;
      return {
        title: item?.snippet?.title,

        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: item.snippet.description,
        publishTime: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (err) {
    console.error("Something went wrong", err);
    return [];
  }
};

export const getVideos = async (searchQuery) => {
  const URL = `search?part=snippet&type=video&maxResults=${5}&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = async () => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`;
  return getCommonVideos(URL);
};

export const getVideoById = async (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};
