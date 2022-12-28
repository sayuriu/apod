import { PropsOf } from "@chakra-ui/react";
import { FC } from "react";
import { MotionButton } from "@components/motion";

export const AnimatedButton: FC<PropsOf<typeof MotionButton>> = ({ ...props }) => {
    return <MotionButton></MotionButton>
}
