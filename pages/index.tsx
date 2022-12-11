import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { AssetLoader } from '../utils/loader';
import { MotionBox } from '../components/motion';

interface ImageEntry {
    date: string;
    hdurl: string;
    url: string;
    explanation: string;
    title: string;
    copyright: string;
}

const Home: NextPage = () => {
    const [images, setImages] = useState<string[]>([]);
    const [imageEntries, setImageEntries] = useState<Record<string, ImageEntry>>({});
    const [progress, setProgress] = useState(0);
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
            for (const item of downloaded) {
                if (item.metadata.mimeType === 'image/jpeg') {
                    setImages(images => [...images, URL.createObjectURL(new Blob([item.resolved as ArrayBuffer], { type: 'image/jpeg' }))]);
                }
                if (item.metadata.mimeType === 'application/json') {
                    setImageEntries((imageEntries) => ({ ...imageEntries, ...item.resolved as Record<string, ImageEntry> }));
                }
            }
        })
    }, []);
    return <MotionBox h={"100vh"} w={"100vw"} bg="red">
        {}
    </MotionBox>

}

export default Home
