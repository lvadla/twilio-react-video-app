import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import TwilioVideo from 'twilio-video';
import Video from './Video';

const VideoRoom = ({ roomName, token, removeToken }) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const { addToast } = useToasts();

    useEffect(function connectWithToken() {
        const participantConnected = participant => {
            console.log(`A remote participant joined: ${participant.identity}`);
            addToast(
                `A remote participant joined: ${participant.identity}`,
                { appearance: 'success' }
            );
            setParticipants(participants => [...participants, participant]);
        };
        const participantDisconnected = participant => {
            console.log(`A remote participant has left: ${participant.identity}`);
            addToast(
                `A remote participant has left: ${participant.identity}`,
                { appearance: 'warning' }
            );
            setParticipants(participants =>
                participants.filter(p => p !== participant)
            );
        };
        token && TwilioVideo.connect(token, { video: true, audio: true, name: roomName }).then(
            connectedRoom => {
                console.log(`Connected to Room "${connectedRoom.name}"`);
                addToast(
                    `Connected to Room "${connectedRoom.name}"`,
                    { appearance: 'success' }
                );

                connectedRoom.on('participantConnected', participantConnected);
                connectedRoom.on('participantDisconnected', participantDisconnected);
                connectedRoom.participants.forEach(participantConnected);

                // update local state from room
                setRoom(connectedRoom);
            }
        ).catch(error => {
            console.error(
                `Unable to connect to Room \n
                [${error.message}] \n
                Try checking that your webcam is plugged in or that you have given your browser the correct permissions`
            );
            addToast(
                `Unable to connect to Room [${error.message}]`,
                { appearance: 'error' }
            );
        });

        // if the local user is still connected to to the room, then
        // we should stop all tracks, disconnect, and wipe local state.
        // wiping local state will unmount the child Video components
        return () => {
            leaveChat();
        };
    }, [roomName, token])

    function leaveChat() {
        if (room) {
            console.log(`You have left the room "${roomName}"`);
            addToast(
                `You have left the room "${roomName}"`,
                { appearance: 'warning' }
            );
            if (room.localParticipant.state === 'connected') {
                room.localParticipant.tracks.forEach(function (trackPublication) {
                    trackPublication.track.stop();
                });
            }
            room.removeAllListeners();
            room.disconnect();
            setRoom(null);
            setParticipants([]);
        }
        // if the user elects to leave the chat,
        // we should wipe their token. this brings
        // them back to the "Join Video Chat" form where
        // they enter new room credentials
        removeToken();
    }

    return (
        <>
            <br />
            <h3>
                This is your virtual chat room that you can share with friends or family. Just
                make sure they join the right room! Again, this room is called <code>{roomName}</code>.
                Go ahead and share it with anyone you'd like to chat with!
            </h3>
            <br />

            {!!room && <>
                <div className="local">
                    <Video
                        key={room.localParticipant.sid}
                        user={room.localParticipant}
                    ></Video>
                </div>
                <div className="remote">
                    {!!participants && !!participants.length && <>
                        <h2>Other Participants:</h2>
                        <div className="wrapper">
                            {participants.map(participant =>
                                <Video
                                    key={participant.sid}
                                    user={participant}
                                ></Video>
                            )}
                        </div>
                    </>}
                </div>
            </>}

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
