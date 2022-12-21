import { ImageEntry } from "@components/image";
import { FC, useEffect, useRef, useState } from "react";
import { Nullable, whichWider } from "@utils/common";
import { AnimatePresence } from "framer-motion";
import { MotionBox, MotionGrid } from "@components/motion";
import { Image } from "@components/image";
import { Forceful, SlowDown } from "@utils/anims";

interface ImageGridProps {
    images: Array<ImageEntry & { src: string }>;
    selectedImage?: Nullable<number>;
    onImageClick?: (index: number) => void;
    inImageViewMode: boolean
}

export const ImageGrid: FC<ImageGridProps> = ({ inImageViewMode, selectedImage, images, onImageClick }) => {
    const [viewMode, setViewMode] = useState<'vh' | 'vw'>('vw');
    useEffect(() => {
        setViewMode(whichWider()  === 'width' ? 'vh' : 'vw');
    }, []);
    const transition = {
        duration: 0.7,
        ease: Forceful,
    }
    const [currentlyHovered, setCurrentlyHovered] = useState<Nullable<number>>(null);
    return <MotionGrid
        templateColumns={`repeat(auto-fill, minmax(20${viewMode}, 1fr))`}
        transition={transition}
        layout
    >
        {images.sort(() => -1).map((image, index) =>
            <Image
                key={image.src}
                index={index}
                src={image.src}
                isSelected={selectedImage === index}
                isHovered={selectedImage !== index && currentlyHovered === index}
                onHoverStart={() => {
                    setCurrentlyHovered(index);
                }}
                onHoverEnd={() => {
                    setCurrentlyHovered(null);
                }}
                onImageClick={onImageClick}
                inImageViewMode={inImageViewMode}
            />
        )}
    </MotionGrid>
}
