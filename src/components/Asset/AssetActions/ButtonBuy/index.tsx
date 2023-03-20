import React, { FormEvent, ReactElement } from 'react'
import Button from '../../../@shared/atoms/Button'
import styles from './index.module.css'
import Loader from '../../../@shared/atoms/Loader'
import { useWeb3 } from '@context/Web3'
import Web3 from 'web3'

export interface ButtonBuyProps {
  action: 'download' | 'compute'
  disabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  btSymbol: string
  dtSymbol: string
  dtBalance: string
  assetType: string
  assetTimeout: string
  isConsumable: boolean
  consumableFeedback: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetType?: string
  isBalanceSufficient: boolean
  isLoading?: boolean
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
  stepText?: string
  type?: 'submit'
  priceType?: string
  algorithmPriceType?: string
  isAlgorithmConsumable?: boolean
  isSupportedOceanNetwork?: boolean
  hasProviderFee?: boolean
  retry?: boolean
}

function getConsumeHelpText(
  btSymbol: string,
  dtBalance: string,
  dtSymbol: string,
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  assetType: string,
  isConsumable: boolean,
  isBalanceSufficient: boolean,
  consumableFeedback: string,
  isSupportedOceanNetwork: boolean,
  web3: Web3,
  priceType: string
) {
  const text =
    isConsumable === false
      ? consumableFeedback
      : hasPreviousOrder && web3 && isSupportedOceanNetwork
      ? `您已购买 ${assetType} ，可直接开始使用`
      : hasDatatoken
      ? `您拥有 ${dtBalance} ${dtSymbol}，您可以支付1 ${dtSymbol} 获取数据, 无需再次支付 ${btSymbol}`
      : isBalanceSufficient === false
      ? `您钱包中没有足够的 ${btSymbol} 来购买当前资产`
      : priceType === 'free'
      ? `该 ${assetType} 免费使用`
      : `要使用 ${assetType}, 您将支付 ${dtSymbol} 给发布者`
  return text
}

function getAlgoHelpText(
  dtSymbolSelectedComputeAsset: string,
  dtBalanceSelectedComputeAsset: string,
  isConsumable: boolean,
  isAlgorithmConsumable: boolean,
  hasPreviousOrderSelectedComputeAsset: boolean,
  selectedComputeAssetType: string,
  hasDatatokenSelectedComputeAsset: boolean,
  isBalanceSufficient: boolean,
  isSupportedOceanNetwork: boolean,
  web3: Web3,
  algorithmPriceType: string
) {
  const text =
    (!dtSymbolSelectedComputeAsset && !dtBalanceSelectedComputeAsset) ||
    isConsumable === false ||
    isAlgorithmConsumable === false
      ? ''
      : hasPreviousOrderSelectedComputeAsset && web3 && isSupportedOceanNetwork
      ? `您已购买 ${selectedComputeAssetType}, 可直接开始使用`
      : hasDatatokenSelectedComputeAsset
      ? `您拥有 ${dtBalanceSelectedComputeAsset} ${dtSymbolSelectedComputeAsset}，您可以支付 1 ${dtSymbolSelectedComputeAsset} 来使用 ${selectedComputeAssetType} , 无需再支付 OCEAN`
      : web3 && !isSupportedOceanNetwork
      ? `请连接资产所在的网络`
      : isBalanceSufficient === false
      ? ''
      : algorithmPriceType === 'free'
      ? `该 ${selectedComputeAssetType} 免费使用`
      : `您将购买 1 ${dtSymbolSelectedComputeAsset} 以获取 ${selectedComputeAssetType}`
  return text
}

function getComputeAssetHelpText(
  hasPreviousOrder: boolean,
  hasDatatoken: boolean,
  btSymbol: string,
  dtSymbol: string,
  dtBalance: string,
  isConsumable: boolean,
  consumableFeedback: string,
  isBalanceSufficient: boolean,
  algorithmPriceType: string,
  priceType: string,
  hasPreviousOrderSelectedComputeAsset?: boolean,
  hasDatatokenSelectedComputeAsset?: boolean,
  assetType?: string,
  dtSymbolSelectedComputeAsset?: string,
  dtBalanceSelectedComputeAsset?: string,
  selectedComputeAssetType?: string,
  isAlgorithmConsumable?: boolean,
  isSupportedOceanNetwork?: boolean,
  web3?: Web3,
  hasProviderFee?: boolean
) {
  const computeAssetHelpText = getConsumeHelpText(
    btSymbol,
    dtBalance,
    dtSymbol,
    hasDatatoken,
    hasPreviousOrder,
    assetType,
    isConsumable,
    isBalanceSufficient,
    consumableFeedback,
    isSupportedOceanNetwork,
    web3,
    priceType
  )

  const computeAlgoHelpText = getAlgoHelpText(
    dtSymbolSelectedComputeAsset,
    dtBalanceSelectedComputeAsset,
    isConsumable,
    isAlgorithmConsumable,
    hasPreviousOrderSelectedComputeAsset,
    selectedComputeAssetType,
    hasDatatokenSelectedComputeAsset,
    isBalanceSufficient,
    isSupportedOceanNetwork,
    web3,
    algorithmPriceType
  )

  const providerFeeHelpText = hasProviderFee
    ? '。您需要租赁计算资源以开始运行模型'
    : '。计算资源可用，无需付费'
  let computeHelpText = `${computeAssetHelpText} ${computeAlgoHelpText} ${providerFeeHelpText}`

  computeHelpText = computeHelpText.replace(/^\s+/, '')
  return computeHelpText
}

export default function ButtonBuy({
  action,
  disabled,
  hasPreviousOrder,
  hasDatatoken,
  btSymbol,
  dtSymbol,
  dtBalance,
  assetType,
  assetTimeout,
  isConsumable,
  consumableFeedback,
  isBalanceSufficient,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetType,
  onClick,
  stepText,
  isLoading,
  type,
  priceType,
  algorithmPriceType,
  isAlgorithmConsumable,
  hasProviderFee,
  retry,
  isSupportedOceanNetwork
}: ButtonBuyProps): ReactElement {
  const { web3 } = useWeb3()
  const buttonText = retry
    ? '重试'
    : action === 'download'
    ? hasPreviousOrder
      ? '下载'
      : priceType === 'free'
      ? '获取'
      : `购买 ${assetTimeout === '永久' ? '' : ` 有效期 ${assetTimeout}`}`
    : hasPreviousOrder &&
      hasPreviousOrderSelectedComputeAsset &&
      !hasProviderFee
    ? '开始计算任务'
    : priceType === 'free' && algorithmPriceType === 'free'
    ? '下单计算任务'
    : `购买计算任务`

  function message(): string {
    let message = ''
    if (action === 'download') {
      message = getConsumeHelpText(
        btSymbol,
        dtBalance,
        dtSymbol,
        hasDatatoken,
        hasPreviousOrder,
        assetType,
        isConsumable,
        isBalanceSufficient,
        consumableFeedback,
        isSupportedOceanNetwork,
        web3,
        priceType
      )
    } else {
      message = getComputeAssetHelpText(
        hasPreviousOrder,
        hasDatatoken,
        btSymbol,
        dtSymbol,
        dtBalance,
        isConsumable,
        consumableFeedback,
        isBalanceSufficient,
        algorithmPriceType,
        priceType,
        hasPreviousOrderSelectedComputeAsset,
        hasDatatokenSelectedComputeAsset,
        assetType,
        dtSymbolSelectedComputeAsset,
        dtBalanceSelectedComputeAsset,
        selectedComputeAssetType,
        isAlgorithmConsumable,
        isSupportedOceanNetwork,
        web3,
        hasProviderFee
      )
    }
    if (priceType === 'free' || algorithmPriceType === 'free') {
      message += ' 请注意您仍需支付网络费'
    }
    return message
  }
  return (
    <div className={styles.actions}>
      {isLoading ? (
        <Loader message={stepText} />
      ) : (
        <>
          <Button
            style="primary"
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={action === 'compute' ? styles.actionsCenter : ''}
          >
            {buttonText}
          </Button>
          <div className={styles.help}>{message()}</div>
        </>
      )}
    </div>
  )
}
