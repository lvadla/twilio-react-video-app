import { useEffect, useRef } from 'react';
export default function Video({ user }) {
    const audioRef = useRef();
    const videoRef = useRef();
    let audioTrack = null;
    let videoTrack = null;

    useEffect(() => {
        async function setUpTracks() {
            // first, we need to get our track publications from the user object
            let audioPublication = Array.from(user.audioTracks.values())[0];
            let videoPublication = Array.from(user.videoTracks.values())[0];

            if (!!audioPublication.track) {
                audioTrack = audioPublication.track;
                audioRef.current.appendChild(audioTrack.attach());
            }
            if (!!videoPublication.track) {
                videoTrack = videoPublication.track;
                videoRef.current.appendChild(videoTrack.attach());
            }

            user.on("trackSubscribed", trackSubscribed);
            user.on("trackUnsubscribed", trackUnsubscribed);
        }
        setUpTracks();

        return () => {
            user.removeAllListeners();
            trackUnsubscribed(audioTrack);
            trackUnsubscribed(videoTrack);
            user = null;
        };
    }, []);

    function trackSubscribed(track) {
        if (track.kind === "video") {
            videoTrack = track;
            videoRef.current.appendChild(videoTrack.attach());
        }
        if (track.kind === "audio") {
            audioTrack = track;
            audioRef.current.appendChild(audioTrack.attach());
        }
    }

    function trackUnsubscribed(track) {
        if (track && track.kind === "video" && track === videoTrack) {
            videoTrack.detach().forEach(n => n.remove());
            videoTrack = null;
        }
        if (track && track.kind === "audio" && track === audioTrack) {
            audioTrack.detach().forEach(n => n.remove());
            audioTrack = null;
        }
    }

    return <>
        (!!user && <div class="container" id={user.sid}>
            <h1>{user.identity}</h1>
            <audio ref={audioRef} />
            <video ref={videoRef} />
        </div>)
        <style jsx > {`
            video {
                width: 100%;
            }

            h1 {
                font-weight: 500;
            }
        `}</style>
    </>
}
