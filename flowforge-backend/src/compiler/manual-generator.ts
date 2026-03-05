import type { IR } from "../ir/schema.js";

export interface GeneratedFile {
  path: string;
  content: string;
}

export function generateNestJsSkeleton(ir: IR): GeneratedFile[] {
  const controllerName = `${ir.metadata.projectName}Controller`;
  const serviceName = `${ir.metadata.projectName}Service`;

  return [
    {
      path: `src/${ir.metadata.projectName.toLowerCase()}.controller.ts`,
      content: `import { Controller, ${ir.api.method.toLowerCase() === "get" ? "Get" : "Post"} } from '@nestjs/common';\nimport { ${serviceName} } from './${ir.metadata.projectName.toLowerCase()}.service';\n\n@Controller('${ir.api.path.replace(/^\//, "")}')\nexport class ${controllerName} {\n  constructor(private readonly service: ${serviceName}) {}\n\n  @${ir.api.method.toLowerCase() === "get" ? "Get" : "Post"}()\n  handle() {\n    return this.service.executeFlow();\n  }\n}\n`
    },
    {
      path: `src/${ir.metadata.projectName.toLowerCase()}.service.ts`,
      content: `import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class ${serviceName} {\n  executeFlow() {\n    return { message: 'Generated from validated IR for ${ir.metadata.projectName}' };\n  }\n}\n`
    }
  ];
}
