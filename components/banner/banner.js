import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./banner.module.css";

export default function Banner(props) {
  const { title, subtitle, imgUrl, videoId } = props;
  const router = useRouter();

  const handleOnPlay = () => {
    console.log("Play");
    router.push(`/video/${videoId}`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h2 className={styles.title}>{title}</h2>
          <h3 className={styles.subtitle}> {subtitle} </h3>
          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <Image
                src="static/play_arrow.svg"
                alt="play icon"
                width={32}
                height={32}
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
}
