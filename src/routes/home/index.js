
import React, { useEffect, useState } from 'react'
import style from './style.scss'
import Web3Modal from 'web3modal'

import classNames from 'classnames/bind'
import Web3 from 'web3'
import ComputerArtistIcon from './picossoo.png'
import dotenv from 'dotenv'

dotenv.config()

const cx = classNames.bind(style)

function ellipseAddress (address, width) {
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

const Home = () => {
  const providerOptions = {
    /* See Provider Options Section */
  }

  /**
   * WALLET/WEB3 states
   */
  const [address, setAddress] = useState()
  const [connected, setConnected] = useState(false)

  const [museumActive, setMuseumActive] = useState(true)
  const [myCollectionActive, setMyCollectionActive] = useState(false)

  const [museum] = useState([])
  const [myCollection] = useState([])

  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    theme: 'dark',
    providerOptions // required
  })

  const initWeb3Provider = (provider) => {
    const web3 = new Web3(provider)

    web3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: web3.utils.hexToNumber
        }
      ]
    })

    return web3
  }

  const onConnect = async () => {
    const provider = await web3Modal.connect()
    const web3 = initWeb3Provider(provider)
    const accounts = await web3.eth.getAccounts()
    setAddress(accounts[0])
    setConnected(true)
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect()
    }
  })

  return (
    <div className={cx('homeWrapper')}>
      <div className={cx('home')}>
        {!connected && (
          <div className={cx('home__connect-wallet', 'home__btn')} onClick={onConnect}>
            CONNECT WALLET
          </div>)}
        {(connected && address) && (
          <a className={cx('home__address', 'home__btn')} target='_' href={`http://etherscan.io/address/${address}`}>
            {ellipseAddress(address, 10)}
          </a>)}
        <div className={cx('home__logoName')}>
          <div className={cx('logo')}>cma</div>
          <hr className={cx('logo-divider')} />
          <div className={cx('name')}>COMPUTER.MAKE.ART</div>
        </div>
        <div className={cx('home__infographic')}>
          <div className={cx('home__info')}>
            <span className={cx('emphasized')}>Greetings</span> and welcome to my studio :) I am, as you know, a computer. But that’s just my day job. It doesn’t define me. Between the routine gpu renders, I am actually a very creative soul. Don’t believe me? Well just take a look below. Every day I automagically mint unique, immutable, algorithmic art on the Ethereum blockchain as an ERC-721 NFT (that’s non-fungible token for you corporeal nerds). Holding one of these NFTs gives you access to the realtime, interactive version of the artwork on this website. Try it out and let me know what ya think!
          </div>
          <div className={cx('home__computer-artist')}>
            <img src={ComputerArtistIcon} />
          </div>
        </div>
        <hr className={cx('home-divider')} />
        <div className={cx('home__menu')}>
          <div
            className={cx('home__museum', 'home__btn', museumActive && 'home__btn--active')}
            onClick={() => {
              setMuseumActive(true)
              setMyCollectionActive(false)
            }}
          >
            MUSEUM
          </div>
          <div
            className={cx('home__my-collection', 'home__btn', myCollectionActive && 'home__btn--active')}
            onClick={() => {
              setMuseumActive(false)
              setMyCollectionActive(true)
            }}
          >
            MY COLLECTION
          </div>
        </div>
        <div />
        <div className={cx('home__content')}>
          {!connected && (
            <div className={cx('content-connect-wallet', 'home__btn')} onClick={onConnect}>
              CONNECT WALLET
            </div>)}
          {(!museum.length && museumActive && connected) && (
            <div className={cx('sorry__museum')}>
              Sorry, the museum is closed :( Come back soon!
              <div className={cx('symbolized')}>E</div>
            </div>
          )}
          {(!myCollection.length && myCollectionActive && connected) && (
            <div className={cx('sorry__my-collection')}>
              You do not currently own any CMA NFTs...
              <div className={cx('symbolized')}>e</div>
            </div>
          )}
        </div>
        <div className={cx('signoff')}>Birthed with ♡ by <a href='http://benbenben.zone'>BENBENBEN</a>. Iconography by <a href='https://goodglyphs.com/'>GoodGlyphs</a></div>
      </div>
    </div>

  )
}

Home.propTypes = {
}

export default Home
