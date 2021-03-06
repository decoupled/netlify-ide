import { Promise_withTimeout } from "@decoupled/xlib"
import fetch from "isomorphic-fetch"
import { computed, observable, when, makeObservable } from "mobx"
import { memo } from "@decoupled/xlib"

export interface URLWatcherOpts {
  url: string
  interval?: number
  maxIdleTime?: number
  verbose?: boolean
}

export class URLWatcher {
  opts: Required<URLWatcherOpts>
  constructor(opts: URLWatcherOpts) {
    this.opts = { interval: 500, maxIdleTime: 1000, verbose: false, ...opts }
    this.start()
    makeObservable(this)
  }
  @observable last_ok_time: number = -1
  @observable last_request_failed: boolean = false
  @observable stopped = false
  @computed get isOK(): boolean {
    if (this.stopped) return false
    if (this.last_ok_time === -1) return false
    const elapsed = Date.now() - this.last_ok_time
    if (elapsed > this.opts.maxIdleTime) return false
    return true
  }
  waitForNextOK(timeout?: number) {
    return when(() => this.isOK, { timeout })
  }
  @memo() private start() {
    this.tick()
  }
  @memo() stop() {
    this.stopped = true
  }
  private log(...args: any[]) {
    if (this.opts.verbose === false) return
    console.log("WatchHTTPPort(" + this.opts.url + ")", ...args)
  }
  private async tick() {
    if (this.stopped) return
    const { interval, url } = this.opts
    try {
      this.log("fetch()")
      const resP: Promise<any> = fetch(url, {
        method: "get",
        cache: "no-cache",
        keepalive: false,
      })
      const res = await Promise_withTimeout(resP)
      if (this.stopped) return
      this.log("response.status=", res.status)
      if (res.status === 200) {
        this.last_request_failed = false
        this.last_ok_time = Date.now()
      } else {
        this.last_request_failed = true
      }
    } catch (e) {
      this.log("response.error", e)
      this.last_request_failed = true
    } finally {
      setTimeout(() => this.tick(), interval)
    }
  }
}

{
  await new URLWatcher({
    url: `http://localhost:8910/`,
  }).waitForNextOK()
}
