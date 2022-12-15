import { PropsOf } from "@chakra-ui/react";
import { FC } from "react";
import { MotionButton } from "@components/motion";

export const Button: FC<PropsOf<typeof MotionButton>> = ({ ...props }) => {
    return <MotionButton></MotionButton>
}
