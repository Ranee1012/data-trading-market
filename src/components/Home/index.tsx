import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import { generateBaseQuery } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import TopSales from './TopSales'
import TopTags from './TopTags'
import SectionQueryResult from './SectionQueryResult'
import styles from './index.module.css'
import Allocations from './Allocations'
import MostViews from './MostViews'

export default function HomePage(): ReactElement {
  const { chainIds } = useUserPreferences()

  const [queryLatest, setQueryLatest] = useState<SearchQuery>()
  const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()

  const [queryMostAllocation, setQueryMostAllocation] = useState<SearchQuery>()

  useEffect(() => {
    const baseParams = {
      chainIds,
      esPaginationOptions: {
        size: 2
      },
      sortOptions: {
        sortBy: SortTermOptions.Created
      } as SortOptions
    } as BaseQueryParams
    setQueryLatest(generateBaseQuery(baseParams))

    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 2
      },
      sortOptions: {
        sortBy: SortTermOptions.Orders
      } as SortOptions
    } as BaseQueryParams
    setQueryMostSales(generateBaseQuery(baseParamsSales))
    const baseParamsAllocation = {
      chainIds,
      esPaginationOptions: {
        size: 2
      },
      sortOptions: {
        sortBy: SortTermOptions.Allocated
      } as SortOptions
    } as BaseQueryParams
    setQueryMostAllocation(generateBaseQuery(baseParamsAllocation))
  }, [chainIds])
  console.log(2, queryLatest)
  return (
    <>
      <TopTags title="产品类型" />
      <SectionQueryResult
        title="最新发布"
        query={queryLatest}
        action={
          <Button style="text" to="/search?sort=nft.created&sortOrder=desc">
            浏览更多数据和算法产品 →
          </Button>
        }
      />
    </>
  )
}
