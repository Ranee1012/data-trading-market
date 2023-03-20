import React, { ReactElement, useEffect, useState } from 'react'
import Status from '@shared/atoms/Status'
import styles from './index.module.css'
import WalletNetworkSwitcher from '../WalletNetworkSwitcher'
import { useGraphSyncStatus } from '@hooks/useGraphSyncStatus'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  networkId,
  accountId,
  isAssetNetwork
}: {
  networkId: number
  accountId: string
  isAssetNetwork?: boolean
}): ReactElement {
  const { isGraphSynced, blockGraph, blockHead } = useGraphSyncStatus(networkId)
  const [state, setState] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [showFeedback, setShowFeedback] = useState<boolean>(false)

  useEffect(() => {
    setShowFeedback(
      !accountId || isAssetNetwork === false || isGraphSynced === false
    )
    if (accountId && isAssetNetwork && isGraphSynced) return
    if (!accountId) {
      setState('error')
      setTitle('未连接账户')
      setMessage('请连接您的钱包')
    } else if (isAssetNetwork === false) {
      setState('error')
      setTitle('未连接数据资产所在的网络')
      setMessage('请连接您的钱包')
    } else if (isGraphSynced === false) {
      setState('warning')
      setTitle('数据未同步')
      setMessage(
        `该数据仅同步到了以太坊区块 ${blockGraph} (${blockHead})。交易可能失败，请稍后再试。`
      )
    } else {
      setState('warning')
      setTitle('数据出错')
      setMessage('数据出错')
    }
  }, [accountId, isGraphSynced, isAssetNetwork])

  return showFeedback ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      {isAssetNetwork === false ? (
        <WalletNetworkSwitcher />
      ) : (
        message && <p className={styles.error}>{message}</p>
      )}
    </section>
  ) : null
}
