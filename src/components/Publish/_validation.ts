import { MAX_DECIMALS } from '@utils/constants'
import * as Yup from 'yup'
import { getMaxDecimalsValidation } from '@utils/numbers'
import { FileInfo } from '@oceanprotocol/lib'
import { testLinks } from '../../@utils/yup'

// TODO: conditional validation
// e.g. when algo is selected, Docker image is required
// hint, hint: https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

const validationMetadata = {
  type: Yup.string()
    .matches(/数据集|模型/g, { excludeEmptyString: true })
    .required('必填'),
  name: Yup.string()
    .min(4, (param) => `名称至少有 ${param.min} 位字符`)
    .required('必填'),
  description: Yup.string()
    .min(10, (param) => `描述至少有 ${param.min} 位字符`)
    .max(5000, (param) => `描述最多有 ${param.max} 位字符`)
    .required('必填'),
  author: Yup.string().required('必填'),
  tags: Yup.array<string[]>().nullable()
}

const validationService = {
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: testLinks(),
        valid: Yup.boolean().isTrue().required('文件无效')
      })
    )
    .min(1, `至少需要一个文件`)
    .required('输入一个有效的URL并点击添加'),
  links: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: testLinks(),
        valid: Yup.boolean()
        // valid: Yup.boolean().isTrue('File must be valid.')
      })
    )
    .nullable(),
  dataTokenOptions: Yup.object().shape({
    name: Yup.string(),
    symbol: Yup.string()
  }),
  timeout: Yup.string().required('必填'),
  access: Yup.string()
    .matches(/compute|access/g)
    .required('必填'),
  providerUrl: Yup.object().shape({
    url: Yup.string().url('URL无效').required('必填'),
    valid: Yup.boolean().isTrue().required('必须填写有效提供商'),
    custom: Yup.boolean()
  })
}

const validationPricing = {
  type: Yup.string()
    .matches(/fixed|free/g, { excludeEmptyString: true })
    .required('必填'),
  // https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

  price: Yup.number()
    .min(0.1, (param: { min: number }) => `必须大于等于 ${param.min}`)
    .max(1000000, (param: { max: number }) => `必须小于等于 ${param.max}`)
    .test('maxDigitsAfterDecimal', `最多不超过 ${MAX_DECIMALS} 位数`, (param) =>
      getMaxDecimalsValidation(MAX_DECIMALS).test(param?.toString())
    )
    .required('必填')
}

// TODO: make Yup.SchemaOf<FormPublishData> work, requires conditional validation
// of all the custom docker image stuff.
// export const validationSchema: Yup.SchemaOf<FormPublishData> =
export const validationSchema: Yup.SchemaOf<any> = Yup.object().shape({
  user: Yup.object().shape({
    stepCurrent: Yup.number(),
    chainId: Yup.number().required('必填'),
    accountId: Yup.string().required('必填')
  }),
  metadata: Yup.object().shape(validationMetadata),
  services: Yup.array().of(Yup.object().shape(validationService)),
  pricing: Yup.object().shape(validationPricing)
})
