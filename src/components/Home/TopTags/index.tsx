import { useUserPreferences } from '@context/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import Tags from '@shared/atoms/Tags'
import { getTopTags } from './_utils'
import { useCancelToken } from '@hooks/useCancelToken'
import { LoggerInstance } from '@oceanprotocol/lib'
import Loader from '@shared/atoms/Loader'

export default function TopTags({
  title,
  action
}: {
  title: ReactElement | string
  action?: ReactElement
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>()
  const newCancelToken = useCancelToken()
  const { tagList } = ['']
  useEffect(() => {
    async function init() {
      setLoading(true)
      if (chainIds.length === 0) {
        const result: string[] = []
        setResult(result)
        setLoading(false)
      } else {
        try {
          const tags = await getTopTags(chainIds, newCancelToken())
          setResult(tags)
          setLoading(false)
        } catch (error) {
          LoggerInstance.error(error.message)
          setLoading(false)
        }
      }
    }

    init()
  }, [chainIds])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <Tags items={['模型参数', '模型结果', '合成数据', '原始数据']} />
      <Tags
        items={[
          '栅格',
          '累年平均',
          '逐月',
          '降水量',
          '日照时数',
          '高分辨率',
          '生态环境',
          '联合建模',
          '国家尺度',
          '省级尺度',
          '气象要素',
          '空间分布',
          '参数扰动模拟',
          '站点观测',
          '遥感解译'
        ]}
      />
    </section>
  )
}
