import { MotionBox, MotionGrid } from "@components/motion";
import { ImageEntry } from "@components/Image";
import { FC } from "react";
import { AnimatedText } from "@components/AnimatedText";
import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { Forceful } from "@utils/anims";

interface ImageDetailsProps {
    src: string;
    image: ImageEntry;
}

export const ImageDetails: FC<ImageDetailsProps> = ({ src, image: { title, explanation, copyright, date}}) => {
    return <>
        <MotionGrid
            className={"fw fh"}
            templateRows={"1fr 1.5em auto"}
        >
            <AnimatedText
                value={explanation}
                className={"rel flex j-flex-center a-flex-center overflow-hidden"}
                textBoxProps={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                }}
            />
            <AnimatedText
                value={copyright ?? "Public domain"}
                mt={"0.3em"}
                textBoxProps={{
                    key: copyright ?? "no-copyright",
                }}
            />
            <AnimatedText value={title} lineHeight={"1.2em"} fontSize="40px" fontWeight="bold"/>
        </MotionGrid>
        <Box
            className={"rel fh fw"}
        >
            <AnimatePresence mode={"popLayout"}>
                <MotionBox
                    key={`viewMode-${src}`}
                    bg={`url(${src})`}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{
                        ease: Forceful,
                        duration: 0.7,
                    }}
                    className={"fh fw"}
                    bgSize={"contain"}
                    bgRepeat={"no-repeat"}
                    bgPosition={"center"}
                />
            </AnimatePresence>
        </Box>
    </>
};
