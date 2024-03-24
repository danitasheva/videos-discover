import Link from "next/link";
import Card from "./card";
import clsx from "classnames";
import styles from "./section-cards.module.css";
export default function SectionCards(props) {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, index) => {
          return (
            <Link key={video.id} href={`/video/${video.id}`}>
              <Card
                key={index}
                id={index}
                imgUrl={video.imgUrl}
                size={size}
                shouldScale={false}
                title={video.title}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
