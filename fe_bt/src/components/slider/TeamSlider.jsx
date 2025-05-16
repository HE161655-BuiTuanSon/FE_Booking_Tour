import React, { useState, useEffect } from "react";

function TeamSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="team-slider">
      <img
        src={images[currentIndex]}
        alt={`Team ${currentIndex}`}
        className="slide-image"
      />
    </div>
  );
}

export default TeamSlider;
