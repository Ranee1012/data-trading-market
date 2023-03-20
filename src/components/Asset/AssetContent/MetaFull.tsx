import React, { ReactElement, useState, useEffect } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { getDummyWeb3 } from '@utils/web3'
import { Asset, Datatoken, LoggerInstance } from '@oceanprotocol/lib'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const [paymentCollector, setPaymentCollector] = useState<string>()
  const { isInPurgatory, assetState } = useAsset()

  useEffect(() => {
    async function getInitialPaymentCollector() {
      try {
        if (!ddo) return
        const web3 = await getDummyWeb3(ddo.chainId)
        const datatoken = new Datatoken(web3)
        setPaymentCollector(
          await datatoken.getPaymentCollector(ddo.datatokens[0].address)
        )
      } catch (error) {
        LoggerInstance.error('[MetaFull: getInitialPaymentCollector]', error)
      }
    }
    getInitialPaymentCollector()
  }, [ddo])

  function DockerImage() {
    const containerInfo = ddo?.metadata?.algorithm?.container
    const { image, tag } = containerInfo
    return <span>{`${image}:${tag}`}</span>
  }

  return ddo ? (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="生产方名称" content={ddo?.metadata?.author} />
      )}
      <MetaItem
        title="生产方地址"
        content={<Publisher account={ddo?.nft?.owner} />}
      />
      {assetState !== 'Active' && (
        <MetaItem title="数据资产状态" content={assetState} />
      )}
      {paymentCollector && paymentCollector !== ddo?.nft?.owner && (
        <MetaItem
          title="收益接收地址"
          content={<Publisher account={paymentCollector} />}
        />
      )}

      {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
        <MetaItem title="Docker镜像" content={<DockerImage />} />
      )}
      <MetaItem title="资产标识符（DID)" content={<code>{ddo?.id}</code>} />
    </div>
  ) : null
}
