import { vscode_react_TreeItem_render } from "@decoupled/xlib"
import { computed, makeObservable, reaction } from "mobx"
import * as React from "react"
import { NetlifyCLIWrapper } from "src/vscode_extension/NetlifyCLIWrapper"
import vscode from "vscode"
import { VSCodeView } from "lambdragon"
import { vscode_mobx } from "x/vscode/vscode_mobx"
import { Main } from "./main"
import { netlify_vsc_treeview_config_id } from "./treeview_id"

export class ConfigTreeviewW {
  constructor(ctx: vscode.ExtensionContext, cli: NetlifyCLIWrapper) {
    makeObservable(this)
    const root2 = <Main ctx={ctx} cli={cli} />

    const tree = vscode_react_TreeItem_render(view_def.id, root2)
    setInterval(() => {
      console.log(tree.toJSON())
      tree.refresh()
    }, 5000)
    reaction(
      () => this.active_netlify_toml_doc,
      (doc) => {
        if (doc) tree.reveal()
      },
      { fireImmediately: true }
    )
  }

  @computed private get active_netlify_toml_doc() {
    const doc = vscode_mobx().activeTextEditor$$?.document
    if (!doc?.fileName?.endsWith("netlify.toml")) return undefined
    return doc
  }
}

const view_def = new VSCodeView({
  id: netlify_vsc_treeview_config_id,
  name: "Netlify",
  // when: netlify_vsc_treeview_context_netlifyEnable,
})
