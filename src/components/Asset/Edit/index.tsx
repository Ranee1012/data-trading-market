import React, { ReactElement, useState, useEffect } from 'react'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
import EditMetadata from './EditMetadata'
import EditComputeDataset from './EditComputeDataset'
import Page from '@shared/Page'
import Loader from '@shared/atoms/Loader'
import Alert from '@shared/atoms/Alert'
import contentPage from '../../../../content/pages/edit.json'
import Container from '@shared/atoms/Container'

export default function Edit({ uri }: { uri: string }): ReactElement {
  const { asset, error, isInPurgatory, title, isOwner } = useAsset()
  const [isCompute, setIsCompute] = useState(false)
  const [pageTitle, setPageTitle] = useState<string>('')

  useEffect(() => {
    if (!asset) return

    const pageTitle = isInPurgatory
      ? ''
      : !isOwner
      ? '不支持编辑'
      : `编辑 ${title}`

    setPageTitle(pageTitle)
    setIsCompute(asset?.services[0]?.type === 'compute')
  }, [asset, isInPurgatory, title, isOwner])

  const tabs = [
    {
      title: '编辑数据资料',
      content: <EditMetadata asset={asset} />
    },
    ...[
      isCompute && asset?.metadata.type !== 'algorithm'
        ? {
            title: '编辑计算设定',
            content: <EditComputeDataset asset={asset} />
          }
        : undefined
    ]
  ].filter((tab) => tab !== undefined)

  return (
    <Page title={pageTitle} description={contentPage.description} uri={uri}>
      {!asset?.accessDetails ? (
        <Loader />
      ) : !isOwner ? (
        <Alert title="仅资产所有者可编辑" text={error} state="error" />
      ) : (
        <Container className={styles.container}>
          <Tabs items={tabs} defaultIndex={0} className={styles.edit} />
        </Container>
      )}
    </Page>
  )
}
