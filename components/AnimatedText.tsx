import { FC } from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { AnimatePresence, MotionProps } from "framer-motion";
import { MotionBox } from "@components/motion";
import { Forceful } from "@utils/anims";

interface TextProps {
    value: string;
    animateMode?: "wait" | "sync" | "popLayout";
    textBoxProps?: Exclude<BoxProps, MotionProps> & MotionProps;
}

export const AnimatedText: FC<TextProps & Exclude<BoxProps, MotionProps> & MotionProps> = ({ value, animateMode, textBoxProps, ...overrideProps }) => {
    return <Box
        className={"rel fw fh overflow-hidden"}
        {...overrideProps}
    >
        <AnimatePresence mode={animateMode ?? "wait"}>
            <MotionBox
               key={value}
               initial={{ y: "100%" }}
               animate={{ y: "0%" }}
               exit={{ y: "-100%" }}
               transition={{
                   duration: 1,
                   ease: Forceful,
               }}
                {...textBoxProps}
            >{value}</MotionBox>
        </AnimatePresence>
    </Box>
}
