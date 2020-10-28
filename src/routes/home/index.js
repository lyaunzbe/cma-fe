
import React, { useEffect, useState } from 'react'
import style from './style.scss'
import Web3Modal from 'web3modal'
import fetch from 'node-fetch'
import classNames from 'classnames/bind'
import Web3 from 'web3'
import ComputerArtistIcon from './picossoo.png'
import 'dotenv/config'

import CONTRACT_ABI from '../../utils/cma_abi.json'

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

  const [contract, setContract] = useState(null)

  const [museum, setMuseum] = useState([])
  const [myCollection, setMyCollection] = useState([])

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

  const fetchMeta = async (uri) => {
    const response = await fetch(uri)
    const data = await response.json()
    return data
  }

  const fetchData = async () => {
    const museum = []
    const myCollection = []
    if (contract) {
      const totalSupply = await contract.methods.totalSupply().call()
      console.log('total supply of CMA tokens is:', totalSupply)
      for (let index = 0; index < totalSupply; index++) {
        const owner = await contract.methods.ownerOf(index).call()
        const tokenURI = await contract.methods.tokenURI(index).call()
        const tokenMetadata = await fetchMeta(tokenURI)

        const artwork = {
          tokenId: index,
          tokenURI,
          tokenMetadata,
          owner
        }
        museum.push(artwork)
        console.log(address, owner)
        if (address === owner) {
          myCollection.push(artwork)
        }
      }
    }
    setMuseum(museum)
    setMyCollection(myCollection)
  }

  const onConnect = async () => {
    const provider = await web3Modal.connect()
    const web3 = initWeb3Provider(provider)
    const accounts = await web3.eth.getAccounts()
    const selectedAccount = accounts[0]
    const newContract = new web3.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS)
    setAddress(selectedAccount)
    setContract(newContract)
    setConnected(true)
  }

  const genArtworkGrid = (items, type) => {
    return (
      <div className={cx('artwork-grid')}>
        {items.map((item, index) => {
          const metadata = item.tokenMetadata
          const detailURI = type === 'museum' ? `https://ropsten.etherscan.io/token/0x66A4e600A765b07872A08EDe5Ba0Baa8Bc34875A?a=${item.tokenId}` : ''
          console.log(detailURI)
          return (
            <a key={index} className={cx('artwork-grid__item')} href={detailURI}>
              <img className={cx('artwork-grid__preview-media')} src={metadata.gif} />
              <span className={cx('artwork-grid__title')}><u>Title</u>: {metadata.name}</span>
              <span className={cx('artwork-grid__owner')}><u>Owner</u>: {ellipseAddress(item.owner, 10)}</span>
            </a>)
        })}
      </div>)
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect()
    }
  }, [])

  useEffect(() => {
    const fetchMuseumAndCollection = async () => {
      await fetchData()
    }
    fetchMuseumAndCollection()
  }, [contract])

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
            <span className={cx('emphasized')}>Greetings</span> and welcome to my studio :) I am, as you know, a computer. But that’s just my day job. It doesn’t define me. Between the routine gpu renders, I am actually a very creative soul. Don’t believe me? Well just take a look below. Every day I automagically mint unique, immutable, algorithmic artworks on the Ethereum blockchain as ERC-721 NFTs (that’s non-fungible tokens for you corporeal nerds). Holding one of these NFTs gives you access to the realtime, interactive version of the artwork on this website. Try it out and let me know what ya think!
            <br /><br />
            Please note that currently you must use the <u>Ropsten</u> Testnet!
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
          {((museum.length > 0) && museumActive && connected) && (
            <div className={cx('sorry__museum-active')}>
              {genArtworkGrid(museum, 'museum')}
            </div>
          )}

          {((myCollection.length > 0) && myCollectionActive && connected) && (
            <div className={cx('sorry__my-collection-active')}>
              {genArtworkGrid(myCollection, 'myCollection')}
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
