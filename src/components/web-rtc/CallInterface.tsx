import React, { useEffect, useRef, MouseEvent } from 'react'
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng'
import { useNavigate } from 'react-router-dom'

import { auth } from '../Data/firebase'
import cameraBtn from '../../assets/video-solid.svg'
import microphone from '../../assets/microphone-solid.svg'
import phone from '../../assets/phone-solid.svg'
import '../../sass/web-rtc/call_interface.scss'

let channelParameters: {
  localAudioTrack: IMicrophoneAudioTrack | null
  localVideoTrack: ICameraVideoTrack | null
  remoteAudioTrack: IRemoteAudioTrack | null
  remoteVideoTrack: IRemoteVideoTrack | null
  remoteUid: string | null
} = {
  localAudioTrack: null,
  localVideoTrack: null,
  remoteAudioTrack: null,
  remoteVideoTrack: null,
  remoteUid: null,
}

const CallInterface: React.FC<{ channelId: string }> = function ({
  channelId,
}) {
  const localPlayer = useRef<HTMLDivElement>(null)
  const remotePlayer = useRef<HTMLDivElement>(null)
  const mountObserver = useRef<Boolean>(false)
  const navigate = useNavigate()
  let options = {
    appId: import.meta.env.VITE_AGORA_APP_ID,
    channel: channelId,
    token: '',
    uid: auth.currentUser!.uid,
  }
  let agoraEngine: IAgoraRTCClient

  const joinRoomHandler = async function () {
    try {
      await agoraEngine.join(
        options.appId,
        options.channel,
        options.token,
        options.uid
      )
      channelParameters.localAudioTrack =
        await AgoraRTC.createMicrophoneAudioTrack()
      channelParameters.localVideoTrack =
        await AgoraRTC.createCameraVideoTrack()
      console.log(
        'Tracks:',
        channelParameters.localVideoTrack,
        channelParameters.localAudioTrack
      )
      await agoraEngine.publish([
        channelParameters.localAudioTrack,
        channelParameters.localVideoTrack,
      ])
      channelParameters.localVideoTrack.play(localPlayer.current!)
      mountObserver.current = true
    } catch (err: any) {
      console.log('Error:', err.message)
    } finally {
      console.log('publish success!')
    }
  }
  const leaveRoomHandler = async function () {
    channelParameters.localAudioTrack?.close()
    channelParameters.localVideoTrack?.close()
    await agoraEngine.leave()
    navigate('/channels', { replace: true })
  }

  async function startBasicCall() {
    try {
      agoraEngine = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      agoraEngine.on('user-published', async (user, mediaType) => {
        await agoraEngine.subscribe(user, mediaType)
        console.log('subscribe success')
        if (mediaType == 'video') {
          channelParameters.remoteVideoTrack = user.videoTrack!
          channelParameters.remoteAudioTrack = user.audioTrack!
          channelParameters.remoteUid = user.uid.toString()
          remotePlayer.current!.id = user.uid.toString()
          channelParameters.remoteUid = user.uid.toString()
          channelParameters.remoteVideoTrack.play(remotePlayer.current!)
        }
        if (mediaType == 'audio') {
          channelParameters.remoteAudioTrack = user.audioTrack!
          channelParameters.remoteAudioTrack.play()
        }
        agoraEngine.on('user-unpublished', user => {
          console.log(user.uid + 'has left the channel')
        })
      })
    } catch (err: any) {
      console.log('Error:', err.message)
    }
  }

  const toggleCamera = async function (e: MouseEvent<HTMLDivElement>) {
    const videoTrack = channelParameters.localVideoTrack

    if (videoTrack?.enabled) {
      videoTrack.setEnabled(false)
      e.currentTarget.style.backgroundColor = '#eb5757'
    } else {
      videoTrack?.setEnabled(true)
      e.currentTarget.style.backgroundColor = 'rgb(179, 102, 249, 0.9)'
    }
  }

  const toggleMic = async function (e: MouseEvent<HTMLDivElement>) {
    const audioTrack = channelParameters.localAudioTrack

    if (audioTrack?.enabled) {
      audioTrack.setEnabled(false)
      e.currentTarget.style.backgroundColor = '#eb5757'
    } else {
      audioTrack?.setEnabled(true)
      e.currentTarget.style.backgroundColor = 'rgb(179, 102, 249, 0.9)'
    }
  }

  useEffect(() => {
    // ;(async () => {
    //   const res = await fetch(
    //     `https://chat-application-nu-one.vercel.app/?uid=${
    //       auth.currentUser!.uid
    //     }`
    //   )
    //   const token = await res.json()
    //   options.token = token.token
    // })()
    fetch(
      `https://chat-application-nu-one.vercel.app/?uid=${
        auth.currentUser!.uid
      }&channelName=${channelId}`
    )
      .then(res => res.json())
      .then(data => {
        options.token = data.token
        startBasicCall()
        joinRoomHandler()
      })
    window.addEventListener('beforeunload', leaveRoomHandler)
    // console.log('Main:', mountObserver.current)

    return () => {
      window.removeEventListener('beforeunload', leaveRoomHandler)
      // console.log('After:', mountObserver.current)

      // if (mountObserver) {
      //   leaveRoomHandler()
      // }
    }
  }, [])

  return (
    <div className="call-interface">
      <div
        className="local-player player"
        id={options.uid}
        ref={localPlayer}
      ></div>
      <div className="remote-player player" ref={remotePlayer}></div>
      <div className="controls">
        <div
          className="control-container"
          id="camera-btn"
          onClick={toggleCamera}
        >
          <img src={cameraBtn} alt="camera" />
        </div>
        <div className="control-container" id="mic-btn" onClick={toggleMic}>
          <img src={microphone} alt="microphone" />
        </div>
        <div
          className="control-container"
          id="leave-btn"
          onClick={leaveRoomHandler}
        >
          <img src={phone} alt="leave" />
        </div>
      </div>
    </div>
  )
}

export default CallInterface
