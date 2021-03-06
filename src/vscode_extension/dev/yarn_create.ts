import execa from "execa"
import { YarnCreatePackageName } from "x/yarn/YarnCreatePackageName"
import { yarn_or_npm } from "x/yarn/yarn_or_npm"
import vscode from "vscode"
import { TargetDirSpec } from "../util/TargetDirSpec"
import { TargetDirSpec_resolve_vsc } from "../util/TargetDirSpec_resolve_vsc"

interface Opts {
  packageName: YarnCreatePackageName
  targetDir: TargetDirSpec
}
export async function yarn_create_dry(opts: Opts) {
  const { packageName, targetDir } = opts
  const tool = yarn_or_npm()
  if (!tool) {
    return
  }
  const dest = await TargetDirSpec_resolve_vsc({
    targetDir,
    autoNamePrefix: packageName.shortName,
  })
  if (!dest) return
  const cmd = packageName.commandFor(tool)
  return { cmd, dest }
}

export async function yarn_create(opts: Opts) {
  const rr = await yarn_create_dry(opts)
  if (!rr) return
  const { cmd: cmdstr, dest } = rr
  const cmdstr2 = cmdstr + " " + dest
  const [cmd, ...args] = cmdstr2.split(" ")
  const res = await vscode.window.withProgress(
    {
      title: `running "${cmdstr2}"`,
      location: vscode.ProgressLocation.Notification,
    },
    () => execa(cmd, args)
  )
  return vscode.Uri.file(dest)
}
