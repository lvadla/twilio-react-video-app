export default function JoinForm({ handleSubmit, setRoomName, setUserName, roomName, userName }) {
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="userName">
                        Display name:
                    </label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        onChange={e => setUserName(e.target.value)}
                        value={userName}
                        required
                    />
                </div>
                <br />
                <div className="field">
                    <label htmlFor="roomName">
                        Room to join:
                    </label>
                    <input
                        type="text"
                        id="roomName"
                        name="roomName"
                        onChange={e => setRoomName(e.target.value)}
                        value={roomName}
                        required
                    />
                </div>
                <br />
                <button type="submit">Join Video Chat</button>
            </form>
            <style jsx>{`
                .field {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    min-height: 1.375rem;
                }

                label {
                    flex: 0 1 45%;
                }

                input {
                    display: block;
                    flex: 1;
                    padding: 0.5rem;
                }

                button {
                    width: 100%;
                    display: inline-block;
                    text-align: center;
                    vertical-align: middle;
                    user-select: none;
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 1rem;
                    border: 2px solid rgba(0, 0, 0, .15);
                    border-radius: .25rem;
                    background-color: var(--primary-color);
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
