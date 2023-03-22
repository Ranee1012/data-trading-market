<h1 align="center">数据交易流通方案</h1>

[![Build Status](https://github.com/oceanprotocol/market/workflows/CI/badge.svg)](https://github.com/oceanprotocol/market/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c85f4d8b-95e1-4010-95a4-2bacd8b90981/deploy-status)](https://app.netlify.com/sites/market-oceanprotocol/deploys)
[![Maintainability](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/maintainability)](https://codeclimate.com/repos/5e3933869a31771fd800011c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/da71759866eb8313d7c2/test_coverage)](https://codeclimate.com/github/oceanprotocol/market/test_coverage)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

## 运行方法

该应用为 React 应用，其中使用了[Next.js](https://nextjs.org)+ TypeScript + CSS 模块，并会自动连接到海洋协议的远程模块。

前提条件:

- [Node.js](https://nodejs.org/en/) (必需)。 检查[.nvmrc](.nvmrc)文件以确保您运行了正确的 Node.js 版本.
- [nvm](https://github.com/nvm-sh/nvm) (推荐)。推荐使用 nvm 管理 node 版本
- [Git](https://git-scm.com/)（必需）。

要开始本地开发，请遵循下列步骤:

```bash
git clone git@github.com:Ranee1012/data-trading-market.git
cd data-trading-market

# when using nvm to manage Node.js versions
nvm use

npm install
# in case of dependency errors, rather use:
# npm install --legacy-peer-deps
npm start
```

您现在可以在本地端口 8000 上查看应用。（若出现连接超时报错，请稍等片刻，等待 bash 界面出现 compiled client and server successfully 后手动打开 localhost:8000 即可）
`http://localhost:8000`.

## 数据来源

应用中展示了数字资产相关的多种数据，包括：

- 数据资产的注册资料（元数据）
- 数据资产的记录文档
- 代表数据所有权的非同质化通证
- 代表数据使用权的同质化通证
- 同质化通证关联的交易信息，包括付费费率或免费的记录
- 数据单位的计算或转换
- 账户信息

上述数据来自以下多个数据源:

### Aquarius

所有的数字资产和它们的注册资料元数据都是在运行时由客户端从 Aquarius 实例获取的，这个实例在`app.config.js`中定义。所有应用程序对 Aquarius 的调用都是用两个内部方法完成的。Aquarius 在底层运行 Elasticsearch，所以它存储的元数据可以用 Elasticsearch 查询来查询，例如：

```tsx
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { queryMetadata } from '@utils/aquarius'

const queryLatest = {
  query: {
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
    query_string: { query: `-isInPurgatory:true` }
  },
  sort: { created: 'desc' }
}

function Component() {
  const { appConfig } = useMarketMetadata()
  const [result, setResult] = useState<QueryResult>()

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      const result = await queryMetadata(query, source.token)
      setResult(result)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [appConfig.metadataCacheUri, query])

  return <div>{result}</div>
}
```

对于单个资产视图中的组件，可以使用 `useAsset()` 钩子，它在后台从 Aquarius 获取相应的元数据

```tsx
import { useAsset } from '@context/Asset'

function Component() {
  const { ddo } = useAsset()
  return <div>{ddo}</div>
}
```

### 海洋协议子图

应用内的大部分金融数据是通过 GraphQL 从海洋协议的子图获取的，在 Aquarius 提供的初始数据之上渲染。该应用程序有 [Urql Client](https://formidable.com/open-source/urql/docs/basics/react-preact/) 设置，根据网络查询相应的子图。在任何组件中，可以这样使用这个客户端：

```tsx
import { gql, useQuery } from 'urql'

const query = gql`
  query TopSalesQuery {
    users(first: 20, orderBy: totalSales, orderDirection: desc) {
      id
      totalSales
    }
  }
`

function Component() {
  const { data } = useQuery(query, {}, pollInterval: 5000 })
  return <div>{data}</div>
}
```

### 区块链网络元数据

所有显示的区块链和网络元数据都是在构建时从 `https://chainid.network` 检索并集成到 NEXT 的 GraphQL 层中。这个数据源是一个社区维护的 GitHub 仓库，位于[ethereum-lists/chains](https://github.com/ethereum-lists/chains)。在组件中，可以在 `allNetworksMetadataJson` 下查询这些元数据。`useWeb3()` 钩子在后台执行这个操作，以便在组件中使用最终的 networkDisplayName：

```tsx
export default function NetworkName(): ReactElement {
  const { networkId, isTestnet } = useWeb3()
  const { networksList } = useNetworkMetadata()
  const networkData = getNetworkDataById(networksList, networkId)
  const networkName = getNetworkDisplayName(networkData)

  return (
    <>
      {networkName} {isTestnet && `(Test)`}
    </>
  )
}
```

## 代码风格

代码风格通过 [ESLint](https://eslint.org) 和 [Prettier](https://prettier.io) 规则自动强制执行：

- Git 预提交钩子在暂存文件上运行 `prettier`，使用 [Husky](https://typicode.github.io/husky) 设置
- VS Code 建议的扩展和设置，用于在文件保存时自动格式化
- CI 作为 `npm test` 的一部分运行 linting 和 TypeScript typings 检查，如果发现错误则失败。
  若要手动运行 linting 和自动格式化，你可以从项目的根目录运行：

```bash
# linting check
npm run lint

# auto format all files in the project with prettier, taking all configs into account
npm run format
```

## 生产环境

要创建一个生产环境的开发，从项目的根目录运行

```bash
npm run build

# serve production build
npm run serve
```
