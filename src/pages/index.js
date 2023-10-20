import React from "react";
import { useAccount } from 'wagmi'
import { useNetwork } from 'wagmi'
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';



function HomePage() {

  const account = useAccount()
  const { chain } = useNetwork()
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState()
  const router = useRouter();

  useEffect(() => {
    setIsConnected(account.isConnected)
    if (chain != undefined) {
      setChainId(chain.id)
    }
    if (isConnected && (chainId in networkMapping)) {
      router.push(`/home/${chainId}`)
    }
  },
    [account, chain]
  )



  return (
    <div id="mainContainer">
      <h1 className="text-2xl font-semibold text-indigo-600">Web3MBTI</h1>
      <div>
        {isConnected ? (
          (chainId in networkMapping) ? (
            <div>Loading...</div>
          ) : (
            <div>Please switch to the right network.</div>
          )
        ) : (
          <div>Please connect your wallet.</div>
        )}
      </div>
    </div>
  )
}


export default HomePage;
