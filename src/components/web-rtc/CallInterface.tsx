import React, { MouseEvent, useEffect, useRef } from 'react'
import AgoraRTM, { RtmClient, RtmChannel, RtmMessage } from 'agora-rtm-sdk'
import { useNavigate } from 'react-router-dom'

import { auth } from '../Data/firebase'
import cameraBtn from '../../assets/video-solid.svg'
import microphone from '../../assets/microphone-solid.svg'
import phone from '../../assets/phone-solid.svg'
import '../../sass/web-rtc/call_interface.scss'

const CallInterface: React.FC<{ channelId: string }> = function ({
  channelId,
}) {
  const userOne = useRef<HTMLVideoElement>(null)
  const userTwo = useRef<HTMLVideoElement>(null)

  const navigate = useNavigate()

  const appId = import.meta.env.VITE_AGORA_APP_ID
  let token = ''
  const uid = auth.currentUser!.uid

  let client: RtmClient
  let channel: RtmChannel

  let localStream: MediaStream
  let remoteStream: MediaStream
  let peerConnection: RTCPeerConnection
  let backupCandidate: RTCIceCandidate
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.1.google.com:19302',
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
      await createAnswer(memberId, parsedMessage.offer)
    }
    if (parsedMessage.type === 'answer') {
      await addAnswer(memberId, parsedMessage.answer)
    }
    if (parsedMessage.type === 'candidate') {
      console.log(
        'Adding icecandidate, Remote description:',
        peerConnection!.currentRemoteDescription,
        peerConnection!.remoteDescription
      )
      await peerConnection!.addIceCandidate(
        new RTCIceCandidate(parsedMessage.candidate)
      )
      console.log('icecandidate added!')
    }
    console.log('Message:', message)
    console.log(parsedMessage)
  }

  const handleUserJoined = async function (memberId: string) {
    console.log('A new user joined the channel:', memberId)
    createOffer(memberId)
  }

  const init = async function () {
    client = AgoraRTM.createInstance(appId)
    await client.login({ uid, token })
    try {
      channel = client.createChannel(channelId)
      await channel!.join()
      channel.on('MemberJoined', handleUserJoined)
      channel.on('MemberLeft', () => {
        userTwo.current!.style.display = 'none'
      })
      client.on('MessageFromPeer', handleMessageFromPeer)
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      userOne.current!.srcObject = localStream!
    } catch (err: any) {
      console.log('ErrorMsg:', err.message)
    }

    client!.on('ConnectionStateChanged', async (newState, reason) => {
      console.log(`${reason}: connection state changed to ${newState}`)
      if (reason === 'REMOTE_LOGIN') {
        console.log('multiple login detected kindly logout and login back')
        return
      }

      console.log(`${reason}: connection state changed to ${newState}`)
    })
  }

  const createPeerConnection = async function (memberId: string) {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()

    userTwo.current!.srcObject = remoteStream!
    userTwo.current!.style.display = 'block'

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      userOne.current!.srcObject = localStream!
    }

    localStream!.getTracks().forEach(track => {
      peerConnection!.addTrack(track, localStream!)
    })

    peerConnection.addEventListener('track', e => {
      e.streams[0].getTracks().forEach(track => {
        console.log('peertrack:', track)
        remoteStream!.addTrack(track)
      })
    })
    peerConnection.addEventListener('icecandidate', e => {
      if (e.candidate) {
        backupCandidate = e.candidate
      }
    })
  }

  const createOffer = async function (memberId: string) {
    try {
      await createPeerConnection(memberId)

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      client.sendMessageToPeer(
        { text: JSON.stringify({ type: 'offer', offer: offer }) },
        memberId
      )
    } catch (err: any) {
      console.log('ErrorMsg:', err.message)
    }
  }

  const createAnswer = async function (
    memberId: string,
    offer: RTCSessionDescriptionInit
  ) {
    console.log('offer:', offer)
    try {
      await createPeerConnection(memberId)

      await peerConnection.setRemoteDescription(offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      client.sendMessageToPeer(
        { text: JSON.stringify({ type: 'answer', answer: answer }) },
        memberId
      )
      client.sendMessageToPeer(
        {
          text: JSON.stringify({
            type: 'candidate',
            candidate: backupCandidate,
          }),
        },
        memberId
      )
      console.log(
        'Remote description after offer:',
        peerConnection!.currentRemoteDescription,
        peerConnection!.remoteDescription
      )
      // if (backupCandidate) {
      //   await peerConnection!.addIceCandidate(
      //     new RTCIceCandidate(backupCandidate)
      //   )
      //   console.log('ice-candidate added')
      // }
    } catch (err: any) {
      console.log('ErrorMsg:', err.message)
    }
  }
  const addAnswer = async function (
    memberId: string,
    answer: RTCSessionDescriptionInit
  ) {
    console.log(
      'Remote description:',
      peerConnection!.currentRemoteDescription,
      peerConnection!.remoteDescription
    )
    if (!peerConnection!.currentRemoteDescription) {
      await peerConnection!.setRemoteDescription(answer)
    }
    client.sendMessageToPeer(
      {
        text: JSON.stringify({
          type: 'candidate',
          candidate: backupCandidate,
        }),
      },
      memberId
    )
  }
  const leaveChannel = async function () {
    await channel?.leave()
    await client?.logout()
  }
  const toggleCamera = async function (e: MouseEvent<HTMLDivElement>) {
    const videoTrack = localStream
      ?.getTracks()
      .find(track => track.kind === 'video')!

    if (videoTrack?.enabled) {
      videoTrack.enabled = false
      e.currentTarget.style.backgroundColor = '#eb5757'
    } else {
      videoTrack.enabled = true
      e.currentTarget.style.backgroundColor = 'rgb(179, 102, 249, 0.9)'
    }
  }
  const toggleMic = async function (e: MouseEvent<HTMLDivElement>) {
    const audioTrack = localStream
      ?.getTracks()
      .find(track => track.kind === 'audio')!
    console.log(localStream)

    if (audioTrack?.enabled) {
      audioTrack.enabled = false
      e.currentTarget.style.backgroundColor = '#eb5757'
    } else {
      audioTrack.enabled = true
      e.currentTarget.style.backgroundColor = 'rgb(179, 102, 249, 0.9)'
    }
  }

  window.addEventListener('beforeunload', leaveChannel)

  useEffect(() => {
    fetch(`https://chat-application-nu-one.vercel.app/?uid=${uid}`)
      .then(res => res.json())
      .then((data: { token: string }) => (token = data.token))
      .then(() => init())
      .catch(err => alert('Error:' + err.message))

    userOne.current!.muted = true

    return () => {
      const tracks = localStream?.getTracks()
      if (tracks) {
        tracks.forEach(track => {
          track.stop()
        })
        leaveChannel()
      }
    }
  }, [])
  // useEffect(() => {
  //   ;(async () => {
  //     localStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     })
  //   })()
  // })

  return (
    <div className="call-interface">
      <div id="videos">
        <video
          className="video-player user-one"
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
