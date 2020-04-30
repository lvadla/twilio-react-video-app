import { useCallback, useState } from 'react';
import Head from 'next/head'
import { ToastProvider } from 'react-toast-notifications'
import JoinForm from '../components/JoinForm'
import VideoRoom from '../components/VideoRoom'

export default function Home() {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');

  const removeToken = useCallback(() => {
    setToken('');
    setUserName('');
    setRoomName('');
  }, []);

  const handleRoomNameChange = useCallback(function updateRoomName(e) {
    setRoomName(e.target.value);
  }, []);

  const handleUserNameChange = useCallback(function updateUserName(e) {
    setUserName(e.target.value);
  }, []);

  const handleSubmit = useCallback(async function fetchToken(e) {
    e.preventDefault();
    const init = {
      body: JSON.stringify({
        identity: userName,
        room: roomName
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      referrerPolicy: "no-referrer"
    };

    try {
      const response = await fetch(
        "https://mahogany-snail-6871.twil.io/token-creation",
        init
      );

      const result = await response.json();
      setToken(result.token);
    } catch (error) {
      console.error(error);
    }
  }, [roomName, userName]);

  return (
    <ToastProvider>
      <div className="home">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="title">
            No nonsense <a href="https://www.twilio.com/video">video chat</a>
          </h1>

          <p className="description">
            Get started by editing <code>pages/index.js</code>
          </p>

          {!!token
            ? <VideoRoom
              token={token}
              removeToken={removeToken}
              roomName={roomName}
            /> :
            <JoinForm
              handleSubmit={handleSubmit}
              userName={userName}
              handleUserNameChange={handleUserNameChange}
              roomName={roomName}
              handleRoomNameChange={handleRoomNameChange}
            />
          }

        </main>

        <footer>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
          </a>
        </footer>

        <style jsx>{`
        .home {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: var(--secondary-color);
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-transform: uppercase;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: var(--secondary-color);
          border-color: var(--secondary-color);
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

        <style jsx global>{`
      :root {
        --main-bg-color: #FFFFFF;
        --main-color: #1f1235;
        --sub-h-color: #1b1425;
        --primary-color: #ff6e6c;
        --secondary-color: #67568c;
        --tertiary-color: #fbdd74;
      }

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          padding: 2rem;
          background-color: #fff;
          border: 0;
          border-radius: 0.375rem;
          box-shadow: 0 15px 45px -5px rgba(10, 16, 34, 0.15);
          margin: 0 auto 2rem;
        }
      `}</style>
      </div>
    </ToastProvider>
  )
}
