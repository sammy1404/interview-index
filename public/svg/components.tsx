import React from 'react'

const tick = () => {
  return (
    <div>
        <svg width="800px" height="800px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <rect width="16" height="16" id="icon-bound" fill="none" />
            <path d="M11,2c0-0.6-0.4-1-1-1H9.4C9.2,0.4,8.7,0,8,0S6.8,0.4,6.6,1H6C5.4,1,5,1.4,5,2v2h6V2z M13,2h-1v2h1v10H3V4h1V2H3 C1.9,2,1,2.9,1,4v10c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V4C15,2.9,14.1,2,13,2z M7,9.7L5.2,8L3.8,9.4L7,12.6l5.2-5.7l-1.5-1.3L7,9.7 z" />
        </svg>
    </div>
  )
}

const cross = () => {
  return (
    <div>
        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>cross-checkbox</title>
            <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM9.76 20.256q0 0.832 0.576 1.408t1.44 0.608 1.408-0.608l2.816-2.816 2.816 2.816q0.576 0.608 1.408 0.608t1.44-0.608 0.576-1.408-0.576-1.408l-2.848-2.848 2.848-2.816q0.576-0.576 0.576-1.408t-0.576-1.408-1.44-0.608-1.408 0.608l-2.816 2.816-2.816-2.816q-0.576-0.608-1.408-0.608t-1.44 0.608-0.576 1.408 0.576 1.408l2.848 2.816-2.848 2.848q-0.576 0.576-0.576 1.408z"></path>
        </svg>
    </div>
  )
}

const arrow = () => {
  return (
    <div>
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
  )
}

export { tick, cross, arrow }