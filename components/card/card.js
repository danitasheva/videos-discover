import React from "react";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import classNames from "classnames";
import styles from "./card.module.css";

export default function Card(props) {
  const {
    imgUrl = "/static/dune-part-tw.jpg",
    size = "medium",
    id,
    shouldScale = true,
  } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };
  const handleOnError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const shouldHover = shouldScale && {
    whileHover: { ...scale },
  };

  return (
    <div className={styles.container}>
      <motion.div
        // whileHover={{ ...scale }}
        {...shouldHover}
        whileTap={{ scale: 0.8 }}
        style={{ x: 0 }}
        className={classNames(styles.imgMotionWrapper, classMap[size])}
      >
        <Image
          src={imgSrc}
          alt="Image"
          layout="fill"
          objectFit="cover"
          className={styles.cardImg}
          onError={handleOnError}
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
        />
      </motion.div>
    </div>
  );
}
