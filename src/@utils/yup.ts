import { isCID } from '@utils/ipfs'
import isUrl from 'is-url-superb'
import * as Yup from 'yup'
import web3 from 'web3'
import { isGoogleUrl } from './url/index'

export function testLinks(isEdit?: boolean) {
  return Yup.string().test((value, context) => {
    const { type } = context.parent
    let validField
    let errorMessage

    switch (type) {
      // we allow submit if the type input is hidden as will be ignore
      case 'hidden':
        validField = true
        break
      case 'url':
      case 'graphql':
        validField = isUrl(value?.toString() || '')
        // if we're in publish, the field must be valid
        if (!validField) {
          validField = false
          errorMessage = 'URL无效'
        }
        // we allow submit on empty sample field
        if (
          !value?.toString() &&
          (context.path === 'links[0].url' ||
            context.path === 'services[0].links[0].url')
        ) {
          validField = true
        }
        // if the url has google drive, we need to block the user from submit
        if (isGoogleUrl(value?.toString())) {
          validField = false
          errorMessage = '暂不支持 Google Drive'
        }
        break
      case 'ipfs':
        validField = isCID(value?.toString())
        errorMessage = !value?.toString() ? 'CID必填.' : 'CID无效'
        break
      case 'arweave':
        validField = value && !value?.toString().includes('http')
        errorMessage = !value?.toString() ? '交易ID必填' : '交易ID无效'
        break
      case 'smartcontract':
        validField = web3.utils.isAddress(value?.toString())
        errorMessage = !value?.toString() ? '地址必填' : '地址无效'
        break
    }

    if (!validField) {
      return context.createError({
        message: errorMessage
      })
    }

    return true
  })
}
