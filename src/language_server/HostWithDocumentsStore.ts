import { Host } from "src/x/netlify/model/Host"
import { DefaultHost } from "src/x/netlify/model/DefaultHost"
import { URL_fromFile } from "src/x/url/URL_fromFile"
import { TextDocuments } from "vscode-languageserver"
import { TextDocument } from "vscode-languageserver-textdocument"

/**
 * An implementation of the host interface atop an LSP TextDocuments store
 */
export class HostWithDocumentsStore implements Host {
  private defaultHost = new DefaultHost()
  constructor(public documents: TextDocuments<TextDocument>) {}
  readFileSync(path: string) {
    const uri = URL_fromFile(path)
    const doc = this.documents.get(uri)
    if (doc) return doc.getText()
    return this.defaultHost.readFileSync(path)
  }
  existsSync(path: string) {
    return this.defaultHost.existsSync(path)
  }
  readdirSync(path: string) {
    return this.defaultHost.readdirSync(path)
  }
  globSync(pattern: string) {
    return this.defaultHost.globSync(pattern)
  }
  writeFileSync(path: string, contents: string) {
    return this.defaultHost.writeFileSync(path, contents)
  }
}