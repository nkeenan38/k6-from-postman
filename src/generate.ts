import { Project, OptionalKind, ParameterDeclarationStructure } from 'ts-morph'

const project = new Project()

export function generateGet(
  functionName: string,
  url: string,
  parameters: OptionalKind<ParameterDeclarationStructure>[],
  destination: string
) {
  let source = project.createSourceFile(
    `${destination}/${functionName}.ts`,
    writer =>
      writer
        .writeLine('/// <reference types="k6" />')
        .writeLine(`import { Response, get, RefinedParams } from 'k6/http'`)
        .blankLine(),
    {
      overwrite: true
    }
  )
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
      .writeLine(`const response: Response = get(${url}, params)`)
      .tab()
      .write('if (response.status !== 200) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.status\}\`\n`
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
  destination: string
) {
  let source = project.createSourceFile(
    `${destination}/${functionName}.ts`,
    writer =>
      writer
        .writeLine('/// <reference types="k6" />')
        .writeLine(
          `import { Response, post, StructuredRequestBody, RefinedParams } from 'k6/http'`
        )
        .blankLine(),
    {
      overwrite: true
    }
  )
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
      .writeLine(`const response: Response = post(${url}, body, params)`)
      .tab()
      .write('if (response.status !== 201) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.status\}\`\n`
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
  destination: string
) {
  let source = project.createSourceFile(
    `${destination}/${functionName}.ts`,
    writer =>
      writer
        .writeLine('/// <reference types="k6" />')
        .writeLine(
          `import { Response, patch, StructuredRequestBody, RefinedParams } from 'k6/http'`
        )
        .blankLine(),
    {
      overwrite: true
    }
  )
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
      .writeLine(`const response: Response = patch(${url}, body, params)`)
      .tab()
      .write('if (response.status !== 200) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.status\}\`\n`
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
  destination: string
) {
  let source = project.createSourceFile(
    `${destination}/${functionName}.ts`,
    writer =>
      writer
        .writeLine('/// <reference types="k6" />')
        .writeLine(`import { Response, del, RefinedParams } from 'k6/http'`)
        .blankLine(),
    {
      overwrite: true
    }
  )
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
      .writeLine(`const response: Response = del(${url}, null, params)`)
      .tab()
      .write('if (response.status !== 200) {\n')
      .tab(2)
      .write(
        `throw \`error: ${functionName} returned \$\{response.status\}\`\n`
      )
      .tab()
      .write('}\n')
      .tab()
      .write('return response')
  )
  source.saveSync()
}
