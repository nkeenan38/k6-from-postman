import {
  Project,
  OptionalKind,
  ParameterDeclarationStructure,
  SourceFile
} from 'ts-morph'
const project = new Project()

export function getSourceFile(destination: string): SourceFile {
  let source = project.createSourceFile(
    `${destination.replace(/\s+/g, '-')}.ts`,
    writer =>
      writer
        .writeLine('/// <reference types="k6" />')
        .writeLine(
          `import { Response, RefinedParams, StructuredRequestBody, post, put, get, patch, del } from 'k6/http'`
        )
        .writeLine("import { check } from 'k6'")
        .writeLine('import { parse } from "../../faker/helpers/util.js";')
        .blankLine(),
    {
      overwrite: true
    }
  )
  return source
}

export function generateGet(
  functionName: string,
  url: string,
  parameters: OptionalKind<ParameterDeclarationStructure>[],
  source: SourceFile
) {
  parameters.push({
    name: 'params',
    type: "RefinedParams<'text'>"
  })
  let func = source.addFunction({
    name: functionName,
    parameters: parameters
  })
  func.setIsExported(true)
  func.setReturnType('Response')
  func.setBodyText(writer =>
    writer
      .writeLine('params = {')
      .tab()
      .write('...params,\n')
      .tab()
      .write('tags: {\n')
      .tab(2)
      .write(`name: '${functionName}',\n`)
      .tab(2)
      .write('...params.tags\n')
      .tab()
      .write('}\n')
      .write('}\n')
      .write(`const response: Response = get(${url}, params)\n`)
      .tab()
      .write('if (!check(response, {\n')
      .tab(2)
      .write("'is successful': r => !r.error_code\n")
      .tab()
      .write('})) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.error_code\}: \$\{response.body\}\`\n`
      )
      .tab()
      .write('}\n')
      .tab()
      .write('return response')
  )
  source.saveSync()
}

export function generatePost(
  functionName: string,
  url: string,
  parameters: OptionalKind<ParameterDeclarationStructure>[],
  source: SourceFile
) {
  parameters.push({
    name: 'body',
    type: 'string | StructuredRequestBody'
  })
  parameters.push({
    name: 'params',
    type: "RefinedParams<'text'>"
  })
  let func = source.addFunction({
    name: functionName,
    parameters: parameters
  })
  func.setIsExported(true)
  func.setReturnType('Response')
  func.setBodyText(writer =>
    writer
      .writeLine('params = {')
      .tab()
      .write('...params,\n')
      .tab()
      .write('tags: {\n')
      .tab(2)
      .write(`name: '${functionName}',\n`)
      .tab(2)
      .write('...params.tags\n')
      .tab()
      .write('}\n')
      .write('}\n')
      .write(`const response: Response = post(${url}, body, params)\n`)
      .tab()
      .write('if (!check(response, {\n')
      .tab(2)
      .write("'is successful': r => !r.error_code\n")
      .tab()
      .write('})) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.error_code\}: \$\{response.body\}\`\n`
      )
      .tab()
      .write('}\n')
      .tab()
      .write('return response')
  )
  source.saveSync()
}

export function generatePut(
  functionName: string,
  url: string,
  parameters: OptionalKind<ParameterDeclarationStructure>[],
  source: SourceFile
) {
  parameters.push({
    name: 'body',
    type: 'string | StructuredRequestBody'
  })
  parameters.push({
    name: 'params',
    type: "RefinedParams<'text'>"
  })
  let func = source.addFunction({
    name: functionName,
    parameters: parameters
  })
  func.setIsExported(true)
  func.setReturnType('Response')
  func.setBodyText(writer =>
    writer
      .writeLine('params = {')
      .tab()
      .write('...params,\n')
      .tab()
      .write('tags: {\n')
      .tab(2)
      .write(`name: '${functionName}',\n`)
      .tab(2)
      .write('...params.tags\n')
      .tab()
      .write('}\n')
      .write('}\n')
      .write(`const response: Response = put(${url}, body, params)\n`)
      .tab()
      .write('if (!check(response, {\n')
      .tab(2)
      .write("'is successful': r => !r.error_code\n")
      .tab()
      .write('})) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.error_code\}: \$\{response.body\}\`\n`
      )
      .tab()
      .write('}\n')
      .tab()
      .write('return response')
  )
  source.saveSync()
}

export function generatePatch(
  functionName: string,
  url: string,
  parameters: OptionalKind<ParameterDeclarationStructure>[],
  source: SourceFile
) {
  parameters.push({
    name: 'body',
    type: 'string | StructuredRequestBody'
  })
  parameters.push({
    name: 'params',
    type: "RefinedParams<'text'>"
  })
  let func = source.addFunction({
    name: functionName,
    parameters: parameters
  })
  func.setIsExported(true)
  func.setReturnType('Response')
  func.setBodyText(writer =>
    writer
      .writeLine('params = {')
      .tab()
      .write('...params,\n')
      .tab()
      .write('tags: {\n')
      .tab(2)
      .write(`name: '${functionName}',\n`)
      .tab(2)
      .write('...params.tags\n')
      .tab()
      .write('}\n')
      .write('}\n')
      .write(`const response: Response = patch(${url}, body, params)\n`)
      .tab()
      .write('if (!check(response, {\n')
      .tab(2)
      .write("'is successful': r => !r.error_code\n")
      .tab()
      .write('})) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.error_code\}: \$\{response.body\}\`\n`
      )
      .tab()
      .write('}\n')
      .tab()
      .write('return response')
  )
  source.saveSync()
}

export function generateDelete(
  functionName: string,
  url: string,
  parameters: OptionalKind<ParameterDeclarationStructure>[],
  source: SourceFile
) {
  parameters.push({
    name: 'params',
    type: "RefinedParams<'text'>"
  })
  let func = source.addFunction({
    name: functionName,
    parameters: parameters
  })
  func.setIsExported(true)
  func.setReturnType('Response')
  func.setBodyText(writer =>
    writer
      .writeLine('params = {')
      .tab()
      .write('...params,\n')
      .tab()
      .write('tags: {\n')
      .tab(2)
      .write(`name: '${functionName}',\n`)
      .tab(2)
      .write('...params.tags\n')
      .tab()
      .write('}\n')
      .write('}\n')
      .write(`const response: Response = del(${url}, null, params)\n`)
      .tab()
      .write('if (!check(response, {\n')
      .tab(2)
      .write("'is successful': r => !r.error_code\n")
      .tab()
      .write('})) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.error_code\}: \$\{response.body\}\`\n`
      )
      .tab()
      .write('}\n')
      .tab()
      .write('return response')
  )
  source.saveSync()
}
