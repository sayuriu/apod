import type { NextPage } from 'next';
import { Component, FC, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from "@chakra-ui/react";
import { AssetLoader } from '@utils/loader';
import { Forceful } from "@utils/anims";

import { AnimatePresence, LayoutGroup, MotionProps, useMotionValue } from "framer-motion";
import { MotionGrid, MotionButton, MotionImage, MotionFlex, MotionBox } from '@components/motion';
import { joinClasses, joinModuleClasses, Nullable, waitAsync, whichWider } from "@utils/common";
import { ImageGrid } from "@components/ImageGrid";
import { ImageEntry } from "@components/Image";

import styles from '@styles/Home.module.scss';
import imageEntries from "public/data.json";
import { AnimatedText } from "@components/AnimatedText";

const transition = {
    ease: Forceful,
    duration: 0.7,
};

const Home: NextPage = () => {
    const [images, setImages] = useState<(ImageEntry & { src : string })[]>([]);
    const [progress, setProgress] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState<Nullable<number>>(null);
    const [inImageViewMode, setInImageViewMode] = useState(false);
    const prevImageIndex = useRef<Nullable<number>>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dependencies = Object.keys(imageEntries).map(url => ({ url: `images/${url}` }));

    const setImageIndex = (prevIndex: Nullable<number>, nextIndex: Nullable<number>) => {
        prevImageIndex.current = prevIndex;
        if (nextIndex === null)
        {
            waitAsync(500).then(() => setInImageViewMode(false));
            return null;
        }
        if (prevIndex !== null)
            return (prevIndex + (nextIndex > prevIndex ? 1 : images.length - 1)) % images.length;
        waitAsync(500).then(() => setInImageViewMode(true));
        return nextIndex;
    }

    const fromWhatDirection = () => {
        if (prevImageIndex.current === null || currentImageIndex === null)
            return 'right';
        return prevImageIndex.current > currentImageIndex ? 'left' : 'right';
    };

    useEffect(() => {
        let loader: Nullable<AssetLoader> = null;
        (async () => {
            loader = new AssetLoader(dependencies, {
                responseType: 'arraybuffer',
                mimeType: 'image/jpeg',
            });
            loader.onProgressUpdate = setProgress;
            const downloaded = await loader.download();
            for (const { metadata: { mimeType }, url, resolved } of downloaded) {
                if (mimeType === 'image/jpeg') {
                    setImages(images => [...images, {
                        src: URL.createObjectURL(new Blob([resolved as ArrayBuffer], { type: 'image/jpeg' })),
                        ...imageEntries[url.split('/').pop()! as keyof typeof imageEntries],
                    }]);
                }
            }
            await waitAsync(2000);
            setProgress(1.01);
        })();
        return () => {
            if (loader)
                loader.destroy();
        };
    }, []);
    return <MotionGrid
        h={"100vh"}
        w={"100vw"}
        className={"grid rel overflow-hidden"}
        animate={{
            gridTemplateRows: currentImageIndex !== null ?
                `clamp(calc(0px + 80vh), 80vh, calc(0px + 80vh)) 1fr` :
                `clamp(calc(60px + 0vh), 5vh, calc(100px + 0vh)) 1fr`
        }}
        transition={{ ...transition, duration: 1 }}
        templateColumns={"1fr"}
    >
        <AnimatePresence>
            {progress <= 1  &&
                <>
                <MotionFlex key={"load-top"}
                    className={"abs l0 z1 fw flex flex-col-rev"}
                    initial={{
                        top: "0vh",
                        height: "50vh"
                    }}
                    transition={transition}
                    exit={{
                        top: "-50vh",
                    }}
                    borderBottom={"1px solid #eef"}
                    fontSize={"calc(1.5rem + 1vw)"}
                    bg={"#eef"}
                >{Number((progress * 100).toFixed(2))}%</MotionFlex>
                <MotionBox key={"load-bottom"}
                    className={"abs l0 z1 fw"}
                    initial={{
                        bottom: "0vh",
                        height: "50vh"
                    }}
                    transition={transition}
                    exit={{
                        bottom: "-50vh",
                    }}
                    bg={"#eef"}
                >
                    <Box h={3} w={`${progress * 100}%`} bg={"#000"}/>
                </MotionBox>
            </>}
        </AnimatePresence>
        <MotionGrid
            h={"100%"}
            w={"100%"}
            className={"rel flex a-flex-strech"}
            templateRows={'1fr clamp(60px, 5vh, 100px)'}
            templateColumns={'1fr'}
            color={"#f00"}
            bg={"#000"}
        >
            <MotionGrid
                className={"fh fw rel overflow-hidden"}
                templateColumns={"2fr 1.3fr"}
                gap="3"
                initial={{
                   background: "#000",
                }}
                animate={{
                    background: currentImageIndex !== null ? "#000" : "#fff",
                }}
                transition={transition}
            >
                {currentImageIndex !== null && (({title, explanation, copyright, date}: ImageEntry) => <>
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
                                key={`viewMode-${currentImageIndex}`}
                                bg={`url(${images[currentImageIndex].src})`}
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                transition={transition}
                                className={"fh fw"}
                                bgSize={"contain"}
                                bgRepeat={"no-repeat"}
                                bgPosition={"center"}
                            />
                        </AnimatePresence>
                    </Box>
                </>)(images[currentImageIndex])}
            </MotionGrid>
            <MotionFlex
                className={"rel fw"}
                justifyContent={inImageViewMode ? "center" : "flex-start"}
            >
                <MotionButton
                    h={"100%"}
                    borderRadius={0}
                    transition={transition}
                    onClick={() => setCurrentImageIndex(prevIndex => setImageIndex(prevIndex, prevIndex !== null ? prevIndex - 1 : null))}
                >
                    Prev
                </MotionButton>
                <MotionButton
                    h={"100%"}
                    borderRadius={0}
                    transition={transition}
                    onClick={() => setCurrentImageIndex(prevIndex => setImageIndex(prevIndex, prevIndex !== null ? prevIndex + 1 : null))}
                >
                    Next
                </MotionButton>
                <MotionButton
                    h={"100%"}
                    borderRadius={0}
                    transition={transition}
                    onClick={() => {
                        setCurrentImageIndex(prevIndex => setImageIndex(prevIndex, null));
                        setInImageViewMode(false);
                    }}
                >
                    Close
                </MotionButton>
            </MotionFlex>
        </MotionGrid>
        { progress >= 1 &&
            <MotionGrid
                ref={containerRef}
                layout
                className={joinClasses(
                    "rel fw z0",
                    "overflow-none-x",
                    joinModuleClasses(styles)("container"),
                )}
                scrollBehavior={"smooth"}
                transition={transition}
            >
                <ImageGrid
                    inImageViewMode={inImageViewMode}
                    images={images}
                    selectedImage={currentImageIndex}
                    onImageClick={(index) => {
                        setCurrentImageIndex(index);
                        setInImageViewMode(true);
                    }}
                />
            </MotionGrid>
        }
    </MotionGrid>
}
export default Home;
