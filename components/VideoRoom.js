import React, { useEffect, useRef, useState } from 'react';
import TwilioVideo from "twilio-video";

const VideoRoom = ({ roomName, token, userName, resetStore }) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const localVidRef = useRef()
    const remoteVidRef = useRef()

    function leaveChat() {
        tearDown(room);
        resetStore();
    }

    function tearDown(room) {
        if (room) {
            room.removeAllListeners();
            room.disconnect();
            setRoom(null);
        }
    }

    function addParticipant(participant) {
        console.log("new participant!")
        console.log(participant)

        // append the attached tracks to the ref
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
                const track = publication.track

                remoteVidRef.current.appendChild(track.attach())
                console.log("attached to remote video")
            }
        })

        // append additional tracks for this participant
        // as they are subscribed to
        participant.on("trackSubscribed", track => {
            console.log("track subscribed")
            remoteVidRef.current.appendChild(track.attach())
        })

        // add the participant to local state
        setParticipants(participants => [...participants, participant]);
    }

    function removeParticipant(participant) {
        console.log("participant has left!")
        console.log(participant)

        // remove the detached tracks from the ref
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
                const track = publication.track

                remoteVidRef.current.appendChild(track.detach())
                console.log("detached from remote video")
            }
        })

        // remove tracks for this participant
        // as they are unsubscribed
        participant.on("trackUnsubscribed", track => {
            console.log("track unsubscribed")
            // remoteVidRef.current.appendChild(track.attach())
        })

        // remove the participant from local state
        setParticipants(participants => participants.filter(n => n !== participant));
    }

    useEffect(function connectWithToken() {
        TwilioVideo.connect(token, { video: true, audio: true, name: roomName }).then(
            connectedRoom => {
                // Keep a ref to the room for cleaning up
                setRoom(connectedRoom);
                // Attach the local video
                TwilioVideo.createLocalVideoTrack().then(track => {
                    localVidRef.current.appendChild(track.attach())
                })

                // Attach the remote videos of all participants
                // that were in the room before we joined
                connectedRoom.participants.forEach(addParticipant)
                // Attach the remote video for a participant
                // as they join the room
                connectedRoom.on("participantConnected", addParticipant)
                // Detach the remote video for a participant
                // as they leave the room
                connectedRoom.on("participantDisconnected", removeParticipant)
            }
        )
        return () => {
            leaveChat()
        }
    }, [token])

    return (
        <>
            <br />
            <h3>
                This is your virtual chat room that you can share with friends or family. Just
                make sure they join the right room! Again, this room is called <code>{roomName}</code>.
                Go ahead and share it with anyone you'd like to chat with!
            </h3>
            <br />

            <div className="wrapper">
                {!!userName && <p>{userName}</p>}
                {!!room && <>
                    <div ref={localVidRef} />
                    <div ref={remoteVidRef} />
                </>}
                {!!participants && participants.map(participant =>
                    <>
                        <p>{participant.sid}</p>
                    </>
                )}
            </div>

            <button onClick={leaveChat}>Leave Video Chat</button>

            <style jsx>{`
                .wrapper {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    grid-gap: 10px;
                }
            `}</style>
        </>
    )
};

export default VideoRoom;
