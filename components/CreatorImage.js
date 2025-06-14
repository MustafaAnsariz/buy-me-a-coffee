"use client";

const CreatorImage = ({ src, alt, className }) => {
  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = "/default-avatar.png";
      }}
    />
  );
};

export default CreatorImage;