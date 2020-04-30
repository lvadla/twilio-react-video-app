import { useEffect, useRef, useState } from 'react';

export default function Video({ user }) {
    const audioRef = useRef();
    const videoRef = useRef();
    const [audioTracks, setAudioTracks] = useState([]);
    const [videoTracks, setVideoTracks] = useState([]);

    useEffect(function storeAVTracksForUser() {

        let initialAudioTracks = Array.from(user.audioTracks.values())
            .map(publication => publication.track)
            .filter(track => track !== null)
        let initialVideoTracks = Array.from(user.videoTracks.values())
            .map(publication => publication.track)
            .filter(track => track !== null)
        setAudioTracks(initialAudioTracks);
        setVideoTracks(initialVideoTracks);

        function trackSubscribed(track) {
            if (track.kind === "video") {
                setVideoTracks(tracks => [...tracks, track]);
            }
            if (track.kind === "audio") {
                setAudioTracks(tracks => [...tracks, track]);
            }
        }

        function trackUnsubscribed(track) {
            if (track.kind === "video") {
                setVideoTracks(tracks => tracks.filter(n => n !== track));
            }
            if (track.kind === "audio") {
                setAudioTracks(tracks => tracks.filter(n => n !== track));
            }
        }

        // add new tracks to local state as they are subscribed to
        user.on("trackSubscribed", trackSubscribed);
        user.on("trackUnsubscribed", trackUnsubscribed);

        return () => {
            setAudioTracks([]);
            setVideoTracks([]);
            user.removeAllListeners();
        };
    }, [user]);

    useEffect(function attachVideoToDOM() {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    useEffect(function attachAudioToDOM() {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);

    return <>
        {!!user && <div className="container">
            <h1>{user.identity}</h1>
            <audio ref={audioRef} />
            <video ref={videoRef} />
        </div>}
        <style jsx>{`
            video {
                width: 100%;
            }

            h1 {
                font-weight: 500;
            }
        `}</style>
    </>
}
