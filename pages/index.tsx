import type { NextPage } from 'next'
import { FC, useEffect, useRef, useState } from 'react'
import { Box } from "@chakra-ui/react";
import { AnimatePresence, LayoutGroup, MotionProps, useMotionValue } from "framer-motion";
import { MotionGrid, MotionButton, MotionImage, MotionFlex, MotionBox } from '@components/motion';
import { joinClasses, joinModuleClasses, Nullable, waitAsync } from "@utils/common";
import { AssetLoader } from '@utils/loader';
import { Forceful } from "@utils/anims";

import styles from '@styles/Home.module.scss'
import imageEntries from "public/data.json";
import { ImageGrid } from "@components/grid";
import { ImageEntry } from "@components/image";

const transition = {
    ease: Forceful,
    duration: 0.7,
}

const Home: NextPage = () => {
    const [images, setImages] = useState<Record<string, string>>({});
    const [progress, setProgress] = useState(0);
    const [currentImage, setCurrentImage] = useState<Nullable<string>>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gridWidth, setGridWidth] = useState(1);
    const dependencies = Object.keys(imageEntries).map(
        url => ({
            url: `images/${url}`,
        })
    );
    useEffect(() => {
        const listener = () => {
            if (containerRef.current) {
                setGridWidth(window.getComputedStyle(containerRef.current).gridTemplateColumns.split(' ').length);
            }
        }
        listener();
        window.addEventListener('resize', listener);
        (async () => {
            const loader = new AssetLoader(dependencies, {
                responseType: 'arraybuffer',
                mimeType: 'image/jpeg',
            });
            loader.onProgressUpdate = setProgress;
            const downloaded = await loader.await();
            for (const { metadata: { mimeType }, url, resolved } of downloaded) {
                if (mimeType === 'image/jpeg') {
                    setImages(images => ({
                        ...images,
                        [url.split('/').pop()!]: URL.createObjectURL(new Blob([resolved as ArrayBuffer], { type: 'image/jpeg' }))
                    }));
                }
            }
            await waitAsync(2000);
            setProgress(1.01);
        })();
        return () => {
            window.removeEventListener('resize', listener);
        }
    }, []);
    return <MotionGrid
        h={"100vh"}
        w={"100vw"}
        className={"grid rel overflow-hidden"}
        animate={{
            gridTemplateRows: currentImage ?
                `clamp(calc(0px + 80vh), 80vh, calc(0px + 80vh)) 1fr` :
                `clamp(calc(60px + 0vh), 5vh, calc(100px + 0vh)) 1fr`
        }}
        transition={{ ...transition, duration: 1 }}
        templateColumns={"1fr"}
    >
        <AnimatePresence>
            {progress <= 1 && <>
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
            <MotionBox
                className={"fh fw rel overflow-hidden"}
                initial={{
                   background: "#000",
                }}
                animate={{
                    background: currentImage ? "#000" : "#fff",
                }}
                transition={transition}
            >
                <AnimatePresence>
                    {currentImage && (({title, explanation, copyright, date}: ImageEntry) => <>
                        <MotionBox bg={images[currentImage]}></MotionBox>
                        <MotionBox>
                            <MotionBox>{copyright ?? "Public domain"}</MotionBox>
                            <MotionBox as={"h3"}>{title}</MotionBox>
                            <MotionBox>{explanation}</MotionBox>
                        </MotionBox>
                    </>)(imageEntries[currentImage as keyof typeof imageEntries])}
                </AnimatePresence>
            </MotionBox>
            <MotionFlex>
                <MotionButton h={"100%"} borderRadius={0}>aaaaa</MotionButton>
                <MotionButton h={"100%"} borderRadius={0}>aaaaa</MotionButton>
                <MotionButton h={"100%"} onClick={() => setCurrentImage(null)} borderRadius={0}>Close</MotionButton>
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
                // initial={{ opacity: 0 }}
                // animate={{ opacity: progress > 1 ? 1 : 0 }}
                transition={transition}
            >
                <ImageGrid images={images} entries={imageEntries} selectedImage={currentImage} onImageClick={setCurrentImage}/>
            </MotionGrid>
        }
    </MotionGrid>
}
export default Home
