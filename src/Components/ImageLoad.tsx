import { useRef, useState } from 'react';
import { useIntersection } from './intersectionObserver';
import blurimg from '../assets/images/blurimg.jpg';
import classnames from 'classnames';

function ImageLoad(props) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useIntersection(imgRef, () => setIsInView(true));

  const handleOnLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {isInView && (
        <>
          {/* Blur (placeholder) image */}
          <img
            src={blurimg}
            alt="blur"
            className={classnames(
              'absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500',
              { 'opacity-0': isLoaded } , // fade out when loaded ,
              props.className
            )}
          />

          {/* Actual image */}
          <img
            src={props.url}
            alt={props.alt || 'image'}
            onLoad={handleOnLoad}
            className={classnames(
              'w-full h-full object-cover transition-opacity duration-500',
              {
                'opacity-0': !isLoaded, // fade in once loaded
              },
              props.className
            )}
          />
        </>
      )}
    </div>
  );
}

export default ImageLoad
