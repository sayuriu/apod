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
    useEffect(() => {
        if (isSelected && inImageViewMode && imageRef.current) {
            imageRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    })
    return <MotionBox
        ref={imageRef}
        className={"rel"}
        style={{
            zIndex: 0,
        }}
        animate={{
            aspectRatio: 2 / 2,
        }}
        onClick={() => {
            if (imageRef.current)
                imageRef.current?.scrollIntoView();
            onImageClick?.(index);
        }}
        bg={`url(${src})`}
        backgroundSize={"cover"}
        initial={{
            filter: 'brightness(1)',
        }}
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
