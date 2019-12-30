import * as fs from 'fs'
import { Collection, Request, ItemGroup, Item, Url } from 'postman-collection'
import { OptionalKind, ParameterDeclarationStructure } from 'ts-morph'
import {
  generateGet,
  generatePost,
  generatePatch,
  generateDelete
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
  collection.items
    .all()
    .forEach(item =>
      generateFromItem(item, `${destination}/${collection.name}`)
    )
}

function generateFromItem(
  item: Item | Request | ItemGroup<Request>,
  destination: string
) {
  if (item instanceof Item) {
    generateRequestFunction(item, destination)
  } else {
    let group = item as ItemGroup<Request>
    group?.items
      ?.all()
      .forEach(item => generateFromItem(item, `${destination}/${group.name}`))
  }
}

function generateRequestFunction(item: Item, destination: string) {
  const functionName = camelize(item.name)
  const url: Url = item.request.url
  const host = url.host?.join('.')
  const protocol = url.protocol || 'https'
  const parameters = getParameters(url.path)
  const path = getPath(url.path)

  switch (item.request.method) {
    case 'GET':
      generateGet(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        destination
      )
      break
    case 'POST':
      generatePost(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        destination
      )
      break
    case 'PATCH':
      generatePatch(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        destination
      )
      break
    case 'DELETE':
      generateDelete(
        functionName,
        `\`${protocol}://${host}/${path}\``,
        parameters,
        destination
      )
      break
    default:
      throw new Error(`Unsupported request method: ${item.request.method}`)
  }
}

function getPath(path: string[]): string {
  return path
    .map(item =>
      item.startsWith(':') ? `\$\{${camelize(item.replace(':', ''))}\}` : item
    )
    .join('/')
}

function getParameters(
  path: string[]
): OptionalKind<ParameterDeclarationStructure>[] {
  return path
    .filter(item => item.startsWith(':'))
    .map(item => {
      return {
        name: camelize(item.replace(':', '')),
        type: 'string'
      }
    })
}

function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+|-/g, '')
}
