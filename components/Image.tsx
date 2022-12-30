import { FC, useEffect, useRef } from "react";
import { MotionBox, MotionGrid, MotionImage } from "@components/motion";
import { AnimatePresence, MotionProps } from "framer-motion";
import { BoxProps, transition } from "@chakra-ui/react";
import { SlowDown } from "@utils/anims";
import { Nullable } from "@utils/common";
export interface ImageEntry {
    date: string;
    hdurl?: string;
    url: string;
    explanation: string;
    title: string;
    copyright?: string;
}

interface ImageProps {
    index: number;
    src: string;
    onClick?: () => void;
    isSelected?: boolean;
    isHovered?: boolean;
    onImageClick?: (index: number) => void;
    inImageViewMode: boolean;
}

export const Image: FC<ImageProps & Exclude<BoxProps, MotionProps> & MotionProps> = ({
    src,
    index,
    isHovered,
    isSelected,
    onImageClick,
    inImageViewMode,
    ...props
}) => {
    const imageRef = useRef<HTMLDivElement>(null);
    const imageSpanRatio = useRef<[number, number]>([1, 1]);
    if (isSelected && inImageViewMode && imageRef.current) {
        imageRef.current.scrollIntoView({
            behavior: 'smooth',
        });
    }
    useEffect(() => {
        const image = document.createElement('img');
        image.src = src;
        image.onload = () => {
            const minDim = Math.min(image.width, image.height);
            imageSpanRatio.current = [image.naturalWidth, image.naturalHeight].map(x => Math.ceil(x / minDim)) as [number, number];
        }
    }, [])
    return <MotionBox
        ref={imageRef}
        className={"rel"}
        style={{
            zIndex: 0,
        }}
        initial={{
            filter: 'brightness(1)',
            aspectRatio: 1,
            gridArea: "span 1 / span 1"
        }}
        animate={{
            aspectRatio: 1,// inImageViewMode ? 1 : imageSpanRatio.current.reduce((a, b) => a / b),
            gridArea: // inImageViewMode ?
                    "span 1 / span 1" //:
                    //`span ${imageSpanRatio.current[0]} / span ${imageSpanRatio.current[1]}`,
        }}
        onClick={() => {
            if (imageRef.current)
                imageRef.current?.scrollIntoView();
            onImageClick?.(index);
        }}
        bg={`url(${src})`}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        transition={transition}

        {...props}
    >
        <AnimatePresence>
            {isSelected && <MotionBox
                className={"abs fh fw t0 l0 z2"}
                layoutId={"currentImage"}
                key={"currentImage"}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 1,
                    ease: SlowDown,
                }}
                border={"4px solid white"}
            />}
            {isHovered && <MotionBox
                className={"abs fh fw t0 l0 z1"}
                layoutId={"currentHover"}
                key={"currentHover"}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 1,
                    ease: SlowDown,
                }}
                border={"4px solid #f00"}
            />}
        </AnimatePresence>
    </MotionBox>
}
