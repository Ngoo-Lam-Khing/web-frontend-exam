import { useState, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';

import LogoImgMobile from '../assets/mobile/Logo-01.png';
import LogoImgDesktop from '../assets/desktop/Logo-01.png';
import CharacterImgMobile from '../assets/mobile/character-01.png';
import CharacterImgDesktop from '../assets/desktop/character-01.png';
import LeftEyeImgMobile from '../assets/mobile/LeftEye.png';
import LeftEyeImgDesktop from '../assets/desktop/LeftEye.png';
import RightEyeImgMobile from '../assets/mobile/RightEye.png';
import RightEyeImgDesktop from '../assets/desktop/RightEye.png';
import { useEyeOffset } from '../composables/useEye';

import './Banner.css';

const LEFT_EYE_RANGE = { xMin: -15, xMax: 4, yMin: -1.5, yMax: 6 };
const RIGHT_EYE_RANGE = { xMin: -9, xMax: 7, yMin: -1, yMax: 6 };
export default function Banner() {
  const isMobile = useMediaQuery('(max-width: 375px)');
  const [loaded, setLoaded] = useState(false);
  const bannerStyle = loaded
    ? {}
    : {
        opacity: 0,
        position: 'absolute' as const,
        left: 0,
        top: 0,
      };

  const leftEyeRef = useRef<HTMLElement | null>(null);
  const rightEyeRef = useRef<HTMLElement | null>(null);
  const leftEyePos = useEyeOffset(leftEyeRef, LEFT_EYE_RANGE);
  const rightEyePos = useEyeOffset(rightEyeRef, RIGHT_EYE_RANGE);
  const leftEyeStyle = {
    transform: `translate(${leftEyePos.x}px, ${leftEyePos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };
  const rightEyeStyle = {
    transform: `translate(${rightEyePos.x}px, ${rightEyePos.y}px)`,
    transition: 'transform 0.1s ease-out',
  };

  return (
    <section className="banner">
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: '100%',
            height: 'auto',
            // mobile: 375/238 ≈ 1.576, desktop: 1440/823 ≈ 1.750
            aspectRatio: isMobile ? '375 / 238' : '1440 / 823',
            maxWidth: isMobile ? '375px' : '1440px',
            margin: '0 auto',
            display: 'block',
          }}
        />
      )}
      <div className="character" style={bannerStyle}>
        <picture className="left-eye" style={leftEyeStyle} ref={leftEyeRef}>
          <source srcSet={LeftEyeImgDesktop} media="(min-width: 376px)" />
          <img src={LeftEyeImgMobile} alt="left eye" />
        </picture>
        <picture className="right-eye" style={rightEyeStyle} ref={rightEyeRef}>
          <source srcSet={RightEyeImgDesktop} media="(min-width: 376px)" />
          <img src={RightEyeImgMobile} alt="right eye" />
        </picture>
        <picture className="figure">
          <source srcSet={CharacterImgDesktop} media="(min-width: 376px)" />
          <img src={CharacterImgMobile} alt="character" onLoad={() => setLoaded(true)} />
        </picture>
      </div>
      <picture className="logo">
        <source srcSet={LogoImgDesktop} media="(min-width: 376px)" />
        <img src={LogoImgMobile} alt="logo" />
      </picture>
    </section>
  );
}
