import React from 'react'
import { nanoid } from 'nanoid'

import googleImg from '../../assets/Google.svg'
import facebookImg from '../../assets/Facebook.svg'
import twitterImg from '../../assets/Twitter.svg'
import githubImg from '../../assets/Github.svg'

function SocialProfiles({ eventListener, keys }) {
  return (
    <div className="social-profiles">
      {[googleImg, facebookImg, twitterImg, githubImg].map((img, idx) => (
        <img
          src={img}
          alt="social"
          key={nanoid()}
          onClick={eventListener?.(keys[idx])}
        />
      ))}
    </div>
  )
}

export default SocialProfiles
