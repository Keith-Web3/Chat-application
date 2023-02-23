import React, { useEffect, useRef } from 'react'
import AgoraRTM, { RtmClient, RtmChannel, RtmMessage } from 'agora-rtm-sdk'

import { auth } from '../Data/firebase'
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
    await client.login({ uid })

    channel = client.createChannel('main8')
    await channel.join()
    channel.on('MemberJoined', handleUserJoined)
    client.on('MessageFromPeer', handleMessageFromPeer)

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })

    userOne.current!.srcObject = localStream
  }

  const createPeerConnection = async function (memberId: string) {
    peerConnection = new RTCPeerConnection()
    remoteStream = new MediaStream()

    userTwo.current!.srcObject = remoteStream

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
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

  useEffect(() => {
    init()
  }, [])

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
          className="video-player"
          ref={userTwo}
          autoPlay
          playsInline
        ></video>
      </div>
    </div>
  )
}

export default CallInterface
