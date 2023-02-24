import React, { useEffect, useRef } from 'react'
import AgoraRTM, { RtmClient, RtmChannel, RtmMessage } from 'agora-rtm-sdk'
import { useNavigate } from 'react-router-dom'

import { auth } from '../Data/firebase'
import cameraBtn from '../../assets/video-solid.svg'
import microphone from '../../assets/microphone-solid.svg'
import phone from '../../assets/phone-solid.svg'
import '../../sass/web-rtc/call_interface.scss'

const CallInterface: React.FC = function () {
  const userOne = useRef<HTMLVideoElement>(null)
  const userTwo = useRef<HTMLVideoElement>(null)

  const appId = import.meta.env.VITE_AGORA_APP_ID
  const token = ''
  const uid = auth.currentUser!.uid

  let client: RtmClient
  let channel: RtmChannel

  let localStream: MediaStream
  let remoteStream: MediaStream
  let peerConnection: RTCPeerConnection

  const servers = {
    iceServers: [
      {
        urls: [
          'stun: stun1.1.google.com:19302',
          'stun:stun2.1.google.com:19302',
        ],
      },
    ],
  }

  const handleMessageFromPeer = async function (
    message: RtmMessage,
    memberId: string
  ) {
    const parsedMessage: RtmMessage & { type: string; [prop: string]: any } =
      JSON.parse(message.text!)
    if (parsedMessage.type === 'offer') {
      createAnswer(memberId, parsedMessage.offer)
    }
    if (parsedMessage.type === 'answer') {
      addAnswer(parsedMessage.answer)
    }
    if (parsedMessage.type === 'candidate') {
      if (peerConnection) {
        peerConnection.addIceCandidate(parsedMessage.candidate)
      }
    }
    console.log('Message:', message)
  }

  const handleUserJoined = async function (memberId: string) {
    console.log('WORKS!')
    console.log('A new user joined the channel:', memberId)
    createOffer(memberId)
  }

  const init = async function () {
    client = AgoraRTM.createInstance(appId)
    const res = await client.login({ uid })

    client.on('ConnectionStateChanged', async (newState, reason) => {
      console.log(
        `RTM client connection state changed to ${newState} with reason ${reason}`
      )
    })
    channel = client.createChannel('main10')
    await channel.join()
    channel.on('MemberJoined', handleUserJoined)
    channel.on('MemberLeft', () => {
      userTwo.current!.style.display = 'none'
    })
    client.on('MessageFromPeer', handleMessageFromPeer)
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    userOne.current!.srcObject = localStream
  }

  const createPeerConnection = async function (memberId: string) {
    peerConnection = new RTCPeerConnection()
    remoteStream = new MediaStream()

    userTwo.current!.srcObject = remoteStream
    userTwo.current!.style.display = 'block'

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      userOne.current!.srcObject = localStream
    }

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream)
    })

    peerConnection.addEventListener('track', e => {
      e.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track)
      })
    })
    peerConnection.addEventListener('icecandidate', e => {
      if (e.candidate) {
        client.sendMessageToPeer(
          {
            text: JSON.stringify({ type: 'candidate', candidate: e.candidate }),
          },
          memberId
        )
      }
    })
  }

  const createOffer = async function (memberId: string) {
    await createPeerConnection(memberId)

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'offer', offer: offer }) },
      memberId
    )
  }

  const createAnswer = async function (
    memberId: string,
    offer: RTCSessionDescriptionInit
  ) {
    await createPeerConnection(memberId)

    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'answer', answer: answer }) },
      memberId
    )
  }
  const addAnswer = async function (answer: RTCSessionDescriptionInit) {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer)
    }
  }
  const leaveChannel = async function () {
    await channel.leave()
    await client.logout()
  }
  const toggleCamera = async function () {
    const videoTrack = localStream
      .getTracks()
      .find(track => track.kind === 'video')!

    if (videoTrack?.enabled) {
      videoTrack.enabled = false
    } else {
      videoTrack.enabled = true
    }
  }
  const toggleMic = async function () {
    const audioTrack = localStream
      .getTracks()
      .find(track => track.kind === 'audio')!

    if (audioTrack?.enabled) {
      audioTrack.enabled = false
    } else {
      audioTrack.enabled = true
    }
  }

  window.addEventListener('beforeunload', leaveChannel)

  useEffect(() => {
    init()

    return () => {
      console.log('running')
      const tracks = localStream?.getTracks()
      if (tracks) {
        console.log('works')
        tracks.forEach(track => {
          track.stop()
        })
      }
    }
  }, [])
  const navigate = useNavigate()

  return (
    <div className="call-interface">
      <div id="videos">
        <video
          className="video-player"
          ref={userOne}
          autoPlay
          playsInline
        ></video>
        <video
          className="video-player user-two"
          ref={userTwo}
          autoPlay
          playsInline
        ></video>
      </div>
      <div id="controls">
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
          onClick={() => {
            leaveChannel()
            navigate('/channels', { replace: true })
          }}
        >
          <img src={phone} alt="leave" />
        </div>
      </div>
    </div>
  )
}

export default CallInterface
