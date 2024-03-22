import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import clsx from "classnames";
import { getVideoById } from "@/lib/videos";
import Navbar from "@/components/navbar/navbar";
import styles from "../../styles/video.module.css";
import Like from "@/components/icons/like-icon";
import DisLike from "@/components/icons/dislike-icon";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  //   const res = await fetch('https://.../posts')
  // data to fetch from API

  //   const video = {
  //     title: "Dune: Part Two",
  //     publishTime: "Dec 12, 2023",
  //     description:
  //       "The saga continues as award-winning filmmaker Denis Villeneuve embarks on “Dune: Part Two,” the next chapter of Frank Herbert’s celebrated novel Dune, with an expanded all-star international ensemble cast. The film, from Warner Bros. Pictures and Legendary Pictures, is the highly anticipated follow-up to 2021’s six-time Academy Award-winning “Dune.” ",
  //     channelTitle: "Warner Bros. Pictures",
  //     viewCount: "16,135,652",
  //   };

  //   const videoId = "U2Qp5pL3ovA";
  const videoId = context.params.videoId;

  const videoArray = await getVideoById(videoId);

  //   const posts = await res.json()

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()

  const listVideos = ["U2Qp5pL3ovA", "YUzQa_1RCE", "hJ658qV-xAg&t=2s"];

  // Get the paths we want to pre-render based on posts
  const paths = listVideos.map((videoId) => ({
    params: { videoId },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default function Video({ video }) {
  const router = useRouter();
  const [likeSelected, setLikeSelected] = useState(false);
  const [dislikeSelected, setDislikeSelected] = useState(false);

  const videoId = router.query.videoId;

  useEffect(() => {
    const getRating = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {});
      const data = await response.json();
      console.log("getRating data", data);
      if (data?.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setLikeSelected(true);
        } else if (favourited === 0) {
          setDislikeSelected(true);
        }
      }
    };
    getRating();
  }, [videoId]);

  const runRating = async (ratingValue) => {
    return await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId, favourited: ratingValue }),
    });
  };

  const handleToggleLike = async () => {
    const val = !likeSelected;
    setLikeSelected(val);
    setDislikeSelected(likeSelected);

    const ratingValue = val ? 1 : 0;
    const response = await runRating(ratingValue);
    console.log("response handleToggleLike", response.json());
  };

  const handleToggleDislike = async () => {
    const val = !dislikeSelected;

    setDislikeSelected(val);
    setLikeSelected(dislikeSelected);

    const ratingValue = !val ? 1 : 0;
    const response = await runRating(ratingValue);
    console.log("response handleToggleLike", response.json());
  };

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics = ({ viewCount } = { viewCount: 0 }),
  } = video;

  return (
    <div style={styles.container} className={robotoSlab.className}>
      {/* Video Page {router.query.videoId} */}
      <Navbar username={"Dani"} />

      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        contentLabel="Watch the video"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="player"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="390"
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=1`}
          frameborder="0"
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={likeSelected} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={dislikeSelected} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime} </p>
              <p className={styles.title}>{title} </p>
              <p className={styles.description}>{description} </p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle} </span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Views: </span>
                <span className={styles.channelTitle}>
                  {statistics.viewCount}{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
