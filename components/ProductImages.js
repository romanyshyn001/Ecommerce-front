import { useState } from "react";
import { styled } from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background-color: #fff;
`;
const BigImages = styled.img`
  max-width: 400px;
  height: 400px;
  object-fit: contain;
  background-color: #fff;
`;
const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
  align-items: center;

  /* align-items: center;
  align-content:center */
`;

const ImageButton = styled.div`
  ${(props) =>
    props.active
      ? `
    border-color: #ccc`
      : `
    border-color: Transparent;
     `}
  border: 2px solid #ccc;
  height: 50px;
  padding: 2px;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  /* align-items: center;
  align-content:center */
`;

const BigImageWrapper = styled.div`
  text-align: center;
`;

export default function ProductImage({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  return (
    <>
      <BigImageWrapper>
        <BigImages src={activeImage} />
      </BigImageWrapper>
      <ImageButtons>
        {images.map((image) => (
          <ImageButton
            key={images}
            active={image === activeImage}
            onClick={() => setActiveImage(image)}
          >
            <Image src={image} alt="image" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}
