import React from "react";

const ImageSlider = () => {
  const sliderStyle = {
    position: "relative",
    width: "80%",
    height: "600px",
    overflow: "hidden",
    marginBottom: "30px",
  };

  const imagesContainerStyle = {
    display: "flex",
    width: "400%", // Since we have 4 images, 100% x 4 = 400%
    animation: "slideAnimation 30s infinite", // Increased the duration to 30 seconds for slower speed
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const keyframesStyle = `
    @keyframes slideAnimation {
      0% { transform: translateX(0); }
      25% { transform: translateX(-100%); }
      50% { transform: translateX(-200%); }
      75% { transform: translateX(-300%); }
      100% { transform: translateX(0); }
    }
  `;

  return (
    <div style={sliderStyle}>
      <style>{keyframesStyle}</style>
      <div style={imagesContainerStyle}>
        <img
          style={imgStyle}
          src="https://www.techbooky.com/wp-content/uploads/2020/02/project-management.png"
          alt="Slider Image 1"
        />
        <img
          style={imgStyle}
          src="https://tse1.mm.bing.net/th?id=OIP.5isLRgyq6etfW0KhzhhNUwHaD8&pid=Api&P=0&h=180"
          alt="Slider Image 2"
        />
        <img
          style={imgStyle}
          src="https://www.projectmanager.com/wp-content/uploads/2019/08/190820_Blog_Feature_Collaboration_Software.jpg"
          alt="Slider Image 3"
        />
        <img
          style={imgStyle}
          src="https://via.placeholder.com/1500x300?text=Image+4"
          alt="Slider Image 4"
        />
      </div>
    </div>
  );
};

export default ImageSlider;
