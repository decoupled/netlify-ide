import { lazy } from "@decoupled/xlib"
import React from "react"
import { NetlifyCLIWrapper } from "src/vscode_extension/NetlifyCLIWrapper"
import { icon } from "src/vscode_extension/treeview/deps"
import { CheckboxUI } from "src/vscode_extension/treeview/workflow/CheckboxUI"
import vscode from "vscode"
import { icon_uri } from "../icon_uri"
import { Expanded, None, observer, TreeItem } from "./deps"
import { menu_def2__docs } from "./menus"
import { NetlifyTOMLUIModel } from "./NetlifyTOMLUIModel"
import { SchemaNodeUI } from "./SchemaNodeUI"
import { netlifyTOMLJSONSchema, openDocs } from "./util"

@observer
export class NetlifyTOMLUI extends React.Component<{
  ctx: vscode.ExtensionContext
  cli: NetlifyCLIWrapper
  filePath: string
}> {
  constructor(props) {
    super(props)
  }
  @lazy() get model() {
    return new NetlifyTOMLUIModel(this.props.filePath)
  }

  @lazy() get netlify_toml_menu() {
    return menu_def2__docs.create({
      docs: () => {
        openDocs(
          "https://docs.netlify.com/configure-builds/file-based-configuration/"
        )
      },
    })
  }

  render_content() {
    if (!this.model.exists) {
      return (
        <TreeItem
          iconPath={icon("new-file")}
          label="Create netlify.toml for this project"
          collapsibleState={None}
          select={this.model.createNewNetlifyTOML}
        />
      )
    }
    const d = this.model.parsedDoc
    if (!d) return <TreeItem label="..." collapsibleState={None} />
    return (
      <>
        <SchemaNodeUI
          ctx={this.props.ctx}
          filePath={this.props.filePath}
          value={d}
          schema={netlifyTOMLJSONSchema}
          path={[]}
          pathString={JSON.stringify([])}
          onSelect={this.model.__onSelect}
          onEdit={this.model.__onEdit}
        />
        {this.model.experimental_enabled ? (
          <CheckboxUI label="show resolved values" />
        ) : null}
      </>
    )
  }
  render() {
    let description = ""
    if (this.model.hasSyntaxErrors) description = "SYNTAX ERRORS FOUND"
    return (
      <TreeItem
        label="netlify.toml"
        description={description}
        collapsibleState={Expanded}
        iconPath={icon_uri("netlify", this.props.ctx)}
        menu={this.netlify_toml_menu}
        resourceUri={this.model.doc?.uri}
        select={this.model.focus}
      >
        {this.render_content()}
      </TreeItem>
    )
  }
}
