import {
  vscode_window_createTerminal_andRun,
  wait,
  WrappedShellCommand,
} from "@decoupled/xlib"
import { computed, observable, makeObservable } from "mobx"
import vscode from "vscode"
import { ProjectModel } from "./ProjectModel"

export type BuildServerStatus = "init" | "running" | "done" | "error"

export class BuildServerModel {
  constructor(private project: ProjectModel) {
    makeObservable(this)
  }

  @observable status: BuildServerStatus = "init"

  @observable
  private cmdWrapper: WrappedShellCommand | undefined
  @observable
  private terminal: vscode.Terminal | undefined

  get canRun() {
    return typeof this.devCommand !== "undefined"
  }
  get isRunning() {
    return this.status === "running"
  }

  async start() {
    if (this.status === "running") return
    if (!this.devCommand) return
    this.status = "running"
    this.cmdWrapper = new WrappedShellCommand(this.devCommand)
    this.terminal = await this.cmdWrapper.run(async (cmd) =>
      vscode_window_createTerminal_andRun({
        cmd,
        cwd: this.project.dir,
        name: "Build",
      })
    )
    const exitCode = await this.cmdWrapper.waitForExitCode()
    if (exitCode === 0) {
      this.status = "done"
    } else {
      this.status = "error"
    }
  }

  async serve() {
    console.log("serve!")
  }

  async stop() {
    if (!this.cmdWrapper) return
    if (this.cmdWrapper.state === "running") {
    }
    this.cmdWrapper.kill()
    this.cmdWrapper = undefined
    await wait(500)
    // if we call terminal.dispose() we might be interrupting the kill()
    // so we will end up with a set of zombie development servers
    //this.terminal?.dispose()
    //this.terminal = undefined
  }

  view_logs() {
    this.terminal?.show()
  }

  @computed get description() {
    return this.project.framework
  }

  private get devCommand() {
    if (this.project.framework === "redwood") return "yarn rw build"
    return undefined
  }
}
