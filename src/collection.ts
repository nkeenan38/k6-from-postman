import * as fs from 'fs'
import { Collection, Request, ItemGroup, Item, Url } from 'postman-collection'
import {
  OptionalKind,
  ParameterDeclarationStructure,
  SourceFile
} from 'ts-morph'
import {
  generateGet,
  generatePost,
  generatePatch,
  generateDelete,
  getSourceFile
} from './generate'

export function parsePostmanCollection(
  collectionFile: string,
  destination: string = 'requests',
  vars: Map<string, string>
) {
  let contents = fs.readFileSync(collectionFile).toString()
  vars.forEach((value: string, key: string) => {
    let replace = new RegExp(`{{${key}}}`, 'g')
    contents = contents.replace(replace, value)
  })
  let collection: Collection = new Collection(JSON.parse(contents))
  let source = getSourceFile(`${destination}/${collection.name}`)
  collection.items.all().forEach(item => {
    generateFromItems(
      item as ItemGroup<Request>,
      `${destination}/${collection.name}`
    )
  })
}

function generateFromItems(group: ItemGroup<Request>, destination: string) {
  let source = getSourceFile(`${destination}/${group.name}`)
  group?.items?.all().forEach(item => {
    if (item instanceof Item) {
      generateRequestFunction(item as Item, source)
    } else {
      generateFromItems(
        item as ItemGroup<Request>,
        `${destination}/${group.name}`
      )
    }
  })
}

function generateRequestFunction(item: Item, source: SourceFile) {
  const functionName = camelize(item.name)
  const url: Url = item.request.url
  const host = url.host?.join('.')
  const protocol = url.protocol || 'https'
  const parameters = getParameters(url)
  const path = getPath(url)

  switch (item.request.method) {
    case 'GET':
      generateGet(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        source
      )
      break
    case 'POST':
      generatePost(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        source
      )
      break
    case 'PATCH':
      generatePatch(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        source
      )
      break
    case 'DELETE':
      generateDelete(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        source
      )
      break
    default:
      throw new Error(`Unsupported request method: ${item.request.method}`)
  }
}

function getPath(url: Url): string {
  let path = url.path
    .map(item =>
      item.startsWith(':') ? `\$\{${camelize(item.replace(':', ''))}\}` : item
    )
    .join('/')
  if (url.query.count() > 0) {
    return path.concat(
      `?${url.query
        .map(item => `${item.key}=\$\{${camelize(item.key)}\}`)
        .join('&')}`
    )
  }
  return path
}

function getParameters(
  url: Url
): OptionalKind<ParameterDeclarationStructure>[] {
  const path = url.path
  let parameters = path
    .filter(item => item.startsWith(':'))
    .map(item => {
      return {
        name: camelize(item.replace(':', '')),
        type: 'string'
      }
    })
  let queries = url.query
    .filter(item => item.key !== null, null)
    .map(item => {
      return {
        name: camelize(item.key),
        type: 'string'
      }
    })
  return parameters.concat(queries)
}

function camelize(str: string | null) {
  if (!str) return ''
  return str
    .replace(/_/g, '-')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+|-|_/g, '')
}
