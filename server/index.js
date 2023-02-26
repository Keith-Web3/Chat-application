const express = require('express')
const { RtmTokenBuilder, RtmRole } = require('agora-access-token')
require('dotenv').config()

const PORT = 8080

const APP_ID = process.env.VITE_AGORA_APP_ID
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE

const app = express()

const nocache = function (req, resp, next) {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  resp.header('Expires', '-1')
  resp.header('Pragma', 'no-cache')
  next()
}

const generateAccessToken = function (req, resp) {
  resp.header('Access-Control-Allow-Origin', '*')

  let uid = req.query.uid
  if (!uid || uid === '') uid = 0

  let role = RtmTokenBuilder.Role
  if (req.query.role === 'publisher') {
    role = RtmRole.PUBLISHER
  }

  let expireTime = req.query.expireTime
  if (!expireTime || expireTime === '') {
    expireTime = 3600
  } else {
    expireTime = parseInt(expireTime, 10)
  }
  const currentTime = Math.floor(Date.now() / 1000)
  const privilegeExpireTime = currentTime + expireTime

  const token = RtmTokenBuilder.buildToken(
    APP_ID,
    APP_CERTIFICATE,
    uid,
    role,
    privilegeExpireTime
  )

  return resp.json({ token: token, appId: APP_ID, appCert: APP_CERTIFICATE })
}

app.get('/', nocache, generateAccessToken)

app.listen(PORT, () => {
  console.log(APP_ID, APP_CERTIFICATE)
  console.log(`Listening to port: ${PORT}`)
})
