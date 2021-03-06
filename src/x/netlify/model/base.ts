import {
  ArrayLike,
  ArrayLike_normalize,
  URLString_fromFile,
} from "@decoupled/xlib"
import { DocumentUri } from "vscode-languageserver-types"
import { lazy, memo } from "@decoupled/xlib"
import { ExtendedDiagnostic } from "x/vscode-languageserver-types/lsp_extensions"
import { IFileSystem } from "../../fs/IFileSystem"

export type IDEStuff = any

export type FilePath = string

export abstract class ModelNode {
  getChildren(): ArrayLike<ModelNode> {
    return null
  }
  getIDEStuff(): ArrayLike<IDEStuff> {
    return null
  }
  getDiagnostics(): ArrayLike<ExtendedDiagnostic> {
    return null
  }
  async collectDiagnostics(): Promise<ExtendedDiagnostic[]> {
    const ours = await ArrayLike_normalize(this.getDiagnostics())
    const children = await ArrayLike_normalize(this.getChildren())
    const rr = children.map((c) => c.getDiagnostics()).map(ArrayLike_normalize)
    const rrr = await Promise.all(rr)
    return [ours, ...rrr].flat()
  }
}

export abstract class FileNode extends ModelNode {
  constructor(public filePath: FilePath, public host: IFileSystem) {
    super()
  }
  @lazy() get uri(): DocumentUri {
    return URLString_fromFile(this.filePath)
  }
  @memo() readFileSync(): string {
    return this.host.readFileSync(this.filePath)
  }
}
