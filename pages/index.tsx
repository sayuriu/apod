import type { NextPage } from 'next'
import { FC, useEffect, useRef, useState } from 'react'
import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { MotionBox, MotionImage } from '@components/motion';
import { joinClasses, joinModuleClasses, waitAsync } from "@utils/common";
import { AssetLoader } from '@utils/loader';
import { Forceful } from "@utils/anims";

import styles from '@styles/Home.module.scss'
import imageEntries from "public/data.json";

interface ImageEntry {
    date: string;
    hdurl?: string;
    url: string;
    explanation: string;
    title: string;
    copyright?: string;
}

const transition = {
    ease: Forceful,
    duration: 0.7,
}

const Home: NextPage = () => {
    const [images, setImages] = useState<Record<string, string>>({});
    const [progress, setProgress] = useState(0);
    const [currentImage, setCurrentImage] = useState<string>();
    const containerRef = useRef<HTMLDivElement>(null);
    const dependencies = Object.keys(imageEntries).map(
        url => ({
            url: `images/${url}`,
        })
    );
    useEffect(() => {
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
    }, []);
    return <MotionBox
        h={"100vh"}
        w={"100vw"}
        className={"rel overflow-hidden"}
    >
        <AnimatePresence>
            {progress <= 1 && <>
                <MotionBox key={"load-top"}
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
                    bg={"#eef"}
                ></MotionBox>
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
        { progress >= 1 &&
            <MotionBox
                ref={containerRef}
                layout
                className={joinClasses(
                    "rel fw fh z0",
                    "overflow-auto-x",
                    joinModuleClasses(styles)("container"),
                )}
                // initial={{ opacity: 0 }}
                // animate={{ opacity: progress > 1 ? 1 : 0 }}
                transition={transition}
            >
                {Object
                    .entries(imageEntries)
                    .map(([key, entry], index) =>
                        <GridImage
                            src={images[key]}
                            image={entry}
                            imageClickCB={() => setCurrentImage(key)}
                            key={`grid-image-${key}`}
                            active={currentImage === key}
                            index={index}
                        />
                    )
                }
            </MotionBox>
        }
    </MotionBox>
}

interface GridImageProps {
    src: string;
    image: ImageEntry;
    imageClickCB?: (image: ImageEntry) => void;
    active?: boolean;
    index: number;
}
const GridImage: FC<GridImageProps> = ({ index, active, src, image, imageClickCB }) => {
    const [span, setSpan] = useState([1, 1]);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const img = ref.current as HTMLImageElement;
        img.onload = () => {
            const { naturalWidth, naturalHeight } = img;
            setSpan([naturalWidth, naturalHeight].map(v => Math.ceil(v / Math.min(naturalWidth, naturalHeight))));
        }
        img.onerror = () => {
            console.log('Missing', image.url);
        }
    }, []);
    return <MotionBox
            className={joinClasses(
                "rel",
                joinModuleClasses(styles)("grid-image-container")
            )}
            initial={{
                gridArea: `span ${span[1]} / span ${span[0]}`,
                aspectRatio: span[0] / span[1],
            }}
            animate={{
                gridArea: `span ${span[1]} / span ${span[0]}`,
                aspectRatio: span[0] / span[1],
            }}
            placeItems={"center"}
            layout
            transition={transition}
            onClick={() => imageClickCB?.(image)}
        >
        <MotionImage
            src={src}
            ref={ref}
            initial={{
                gridArea: "1 / 1 / 2 / 2",
            }}
            animate={{
                gridArea: active ? "1 / 1 / 2 / 2" : "1 / 1 / 3 / 3",
                objectFit: active ? "contain" : "cover",
            }}
            transition={transition}
            layout
            className={joinClasses(
                "fw fh",
                joinModuleClasses(styles)("image")
            )}
        />
        <MotionBox gridArea="1 / 1 / 3 / 3" color={"#fff"}>{index}</MotionBox>
    </MotionBox>
}

export default Home
