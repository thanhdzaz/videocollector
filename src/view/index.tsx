// ts
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom"
import {firestore} from "../firebase";

export const View = () => {

    const {id} = useParams();
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (id) {
            firestore.getByDoc('data', id).then(data => {
                setData(data);
            })
        }
    }, [id]);

    const showFullScreen = () => {
        // @ts-ignore
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (video.current?.requestFullscreen) {
                video.current?.requestFullscreen();
                // @ts-ignore
            } else if (video.current?.msRequestFullscreen) {
                // @ts-ignore
                video.current?.msRequestFullscreen();
                // @ts-ignore
            } else if (video.current?.mozRequestFullScreen) {
                // @ts-ignore
                video.current?.mozRequestFullScreen();
                // @ts-ignore
            } else if (video.current?.webkitRequestFullscreen) {
                // @ts-ignore
                video.current?.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                // @ts-ignore
                document.exitFullscreen();
                // @ts-ignore
            } else if (document.msExitFullscreen) {
                // @ts-ignore
                document.msExitFullscreen();
                // @ts-ignore
            } else if (document.mozCancelFullScreen) {
                // @ts-ignore
                document.mozCancelFullScreen();
                // @ts-ignore
            } else if (document.webkitExitFullscreen) {
                // @ts-ignore
                document.webkitExitFullscreen();
            }
        }
    }

    const [data, setData] = useState<any>(null);
    if (!data) {
        return <div>Không có dữ liệu...</div>
    }
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 10
    }}>
        {
            data.type === 'photos'
                ?
                (
                    <img src={data.src} alt=""/>
                )
                : (
                    <video ref={video} src={data.src} controls autoPlay loop></video>
                )
        }

        <a href={data.src} download>{data.name}</a>
        <button className={'full-screen-btn'} onClick={showFullScreen}>Toàn màn hình</button>
    </div>
}