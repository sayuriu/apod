import { FC, useRef } from "react";
import { MotionGrid, MotionImage } from "@components/motion";
import { MotionProps } from "framer-motion";
import { BoxProps } from "@chakra-ui/react";
export interface ImageEntry {
    date: string;
    hdurl?: string;
    url: string;
    explanation: string;
    title: string;
    copyright?: string;
}

interface ImageProps {
    src: string,
    onClick?: () => void;
}

export const Image: FC<ImageEntry & ImageProps & MotionProps & BoxProps> = ({
    src,
    title,
    explanation,
    url,
    hdurl,
    copyright,
    onClick = () => {},
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);
    return <MotionImage
            src={src}
            objectFit={"cover"}
            ref={ref}
            style={{
                aspectRatio: 1,
            }}
            animate={{
                gridArea: 'span 1 / span 1'
            }}
            // cl={{
            //     gridArea: 'span 2 / span 2'
            // }}
            transition={{
                ease: 'easeOut',
                duration: 0.7,
            }}
            onClick={onClick}
            {...props}
    />
}
