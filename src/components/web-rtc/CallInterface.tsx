import React, { useEffect, useRef } from 'react'

import '../../sass/web-rtc/call_interface.scss'

const CallInterface: React.FC = function () {
  const userOne = useRef<HTMLVideoElement>(null)
  const userTwo = useRef<HTMLVideoElement>(null)

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

  const init = async function () {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })

    userOne.current!.srcObject = localStream
    createOffer()
  }
  const createOffer = async function () {
    peerConnection = new RTCPeerConnection()
    remoteStream = new MediaStream()

    userTwo.current!.srcObject = remoteStream
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream)
    })

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    peerConnection.addEventListener('track', e => {
      e.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track)
      })
    })
    peerConnection.addEventListener('icecandidate', e => {
      if (e.candidate) {
        console.log('New ICE Candidate', e.candidate)
      }
    })

    console.log(offer)
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
