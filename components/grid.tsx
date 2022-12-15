import { Box, Grid } from "@chakra-ui/react";
import { Image, ImageEntry } from "@components/image";
import { FC, useState } from "react";
import { Nullable } from "@utils/common";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { ImageDetails } from "@components/imageDetails";
import { MotionBox, MotionGrid } from "@components/motion";
import { Forceful, SlowDown } from "@utils/anims";

interface ImageGridProps {
    images: Record<string, string>;
    entries: Record<string, ImageEntry>;
    selectedImage?: Nullable<string>;
    onImageClick?: (key: string) => void;
}

export const ImageGrid: FC<ImageGridProps> = ({ selectedImage, images, entries, onImageClick }) => {
    const [currentlyHovered, setCurrentlyHovered] = useState<Nullable<string>>(null);
    return <MotionGrid
        gridTemplateColumns={"repeat(auto-fill, minmax(240px, 1fr))"}
        style={{

        }}

    >
        {Object.entries(entries).map(([key, entry]) =>
            <MotionBox
                key={key}
                className={"rel"}
                style={{
                    zIndex: 0,
                }}
                animate={{
                    aspectRatio: 1,
                }}
                onClick={() => {
                    onImageClick?.(key);
                }}
                bg={`url(${images[key]})`}
                backgroundSize={"cover"}
                initial={{
                    filter: 'brightness(1)',
                }}
                transition={{
                    duration: 0.7,
                    ease: Forceful,
                }}
                onHoverStart={() => {
                    setCurrentlyHovered(key);
                }}
                onHoverEnd={() => {
                    setCurrentlyHovered(null);
                }}
            >
                <AnimatePresence>
                    <AnimatePresence>
                        {selectedImage === key && <MotionBox
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
                        {selectedImage !== key && currentlyHovered === key && <MotionBox
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
                </AnimatePresence>
            </MotionBox>
        )}
    </MotionGrid>
}
