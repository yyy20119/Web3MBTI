import PropTypes from "prop-types";
import React from "react";
import { useAccount } from 'wagmi'
import { useNetwork } from 'wagmi'
import networkMapping from "../../constants/networkMapping.json"
import abi from "../../constants/abi.json"
import mbti from "../../constants/mbti.json"
import { useEffect, useState } from "react"
import { useContractRead } from 'wagmi'
import Link from "next/link"
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router'



function ChianPage({ id }) {

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


  const { data, isFetching, isSuccess } = useContractRead({
    address: networkMapping[id]['contractAddress'],
    abi: abi,
    functionName: 'getMBTIResult',
    args: [account.address],
  })



  return (
    <div id="mainContainer">
      <h1 className="text-2xl font-semibold text-indigo-600">Web3MBTI</h1>
      <div>
        {isConnected ? (
          (chainId in networkMapping) ? (
            (isSuccess && data > 0) ? (
              <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
                <p className="text-2xl font-bold mb-4">Your MBTI is:</p>
                <p className="text-3xl font-bold text-blue-500 mb-4">{mbti[data].type}</p>
                <p className="text-gray-700">{mbti[data].description}</p>
              </div>
            ) : (
              isFetching ? (<div>loading...</div>) :
                (<div>
                  Please finish the questions.<br></br><br></br>
                  👉 <Link href="/questions"><Button color="primary">Get Started</Button></Link>
                </div>)
            )
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

export async function getServerSideProps(context) {
  const { id } = context.query
  return {
    props: {
      id
    }
  }
}

ChianPage.propTypes = {
  id: PropTypes.any,
};


export default ChianPage;
