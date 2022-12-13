import type { NextPage } from 'next'
import { FC, useEffect, useRef, useState } from 'react'
import { AssetLoader } from '@utils/loader';
import { MotionBox, MotionImage } from '@components/motion';
import styles from '@styles/Home.module.scss'
import { joinClasses, joinModuleClasses } from "@utils/common";
import { Forceful } from "@utils/anims";

interface ImageEntry {
    date: string;
    hdurl: string;
    url: string;
    explanation: string;
    title: string;
    copyright: string;
}

const Home: NextPage = () => {
    const [images, setImages] = useState<Record<string, string>>({});
    const [imageEntries, setImageEntries] = useState<Record<string, ImageEntry>>({});
    const [progress, setProgress] = useState(0);
    const [currentImage, setCurrentImage] = useState<string>();
    const dependencies = [
        ...[
            'images/22466-22467anaVantuyne900.jpg',
            'images/art001e000672-orig1024c.jpg',
            'images/art001e002132_apod1024.jpg',
            'images/Butterfly_HubbleOstling_960.jpg',
            'images/Cave_Copyright_APOD1024.png',
            'images/DoubleCluster_Lease_960.jpg',
            'images/earthset-snap01.png',
            'images/Gum_Lima_960.jpg',
            'images/iotruecolor_galileo_960.jpg',
            'images/LastRingPortrait_Cassini_1080.jpg',
            'images/LDN1251v7social1024.png',
            'images/Leonids2022_Hongyang_960.jpg',
            'images/M16Pillar_WebbOzsarac_960.jpg',
            'images/Mars_Moon_fullsize_TGlenn1024.jpg',
            'images/Mars-Stereo.png',
            'images/NGC7293-TommasoStella2022WEB1024.jpg',
            'images/Pleiades_Estes_1080.jpg',
            'images/potm2211a_1024.jpg',
            'images/rippledsky_dai_960.jpg',
            'images/STSCI-H-p1827h-NGC6744_1024x925.jpg',
            'images/SupernumeraryRainbows_Entwistle_960.jpg',
        ].map(url => ({ url })),
        ...[{
            url: 'data.json',
            overrideOptions: {
                responseType: 'json' as 'json',
                mimeType: 'application/json',
            }
        }]
    ]
    useEffect(() => {
        const loader = new AssetLoader(dependencies, {
            responseType: 'arraybuffer',
            mimeType: 'image/jpeg',
        });
        loader.onProgressUpdate = setProgress;
        loader.await().then(downloaded => {
            for (const { metadata: { mimeType }, url, resolved } of downloaded) {
                if (mimeType === 'image/jpeg') {
                    setImages(images => ({
                        ...images,
                        [url.split('/').pop()!]: URL.createObjectURL(new Blob([resolved as ArrayBuffer], { type: 'image/jpeg' }))
                    }));
                }
                if (mimeType === 'application/json') {
                    setImageEntries((imageEntries) => ({ ...imageEntries, ...resolved as Record<string, ImageEntry> }));
                }
            }
        })
    }, []);
    return <MotionBox
        h={"100vh"}
        w={"100vw"}
        className={"overflow-hidden"}
    >
        { progress === 1 &&
            <MotionBox
                layout
                className={joinClasses(
                    "fw fh",
                    "overflow-auto-x",
                    joinModuleClasses(styles)("container"),
                )}
            >
                {Object
                    .entries(imageEntries)
                    .map(([key, entry]) =>
                        <GridImage
                            src={images[key]}
                            image={entry}
                            imageClickCB={() => setCurrentImage(key)}
                            key={`grid-image-${key}`}
                            active={currentImage === key}
                        />
                )}
            </MotionBox>
        }
    </MotionBox>
}

interface GridImageProps {
    src: string;
    image: ImageEntry;
    imageClickCB?: (image: ImageEntry) => void;
    active?: boolean;
}
const GridImage: FC<GridImageProps> = ({ active, src, image, imageClickCB }) => {
    const transition = {
        ease: Forceful,
        duration: 0.7,
    }
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const img = ref.current as HTMLImageElement;
        const { naturalWidth, naturalHeight } = img;
        const [spanX, spanY] = [naturalWidth, naturalHeight].map(v => Math.ceil(v / Math.min(naturalWidth, naturalHeight)));
    }, []);
    return <MotionBox
            className={joinModuleClasses(styles)("grid-image-container")}
            layout
            onClick={() => imageClickCB?.(image)}
        >
        <MotionImage
            src={src}
            ref={ref}
            initial={{ gridColumn: "span 2" }}
            animate={{
                gridColumn: active ? "span 1" : "span 2",
            }}
            transition={transition}
            layout
            className={joinModuleClasses(styles)("image")}
        />
    </MotionBox>
}

export default Home
