import traverse from "traverse"

/**
 * @param schemaObj a valid JSON schema object
 * @returns a *copy* of the JSON schema object with all $refs
 *          having been replaced by the definition they refer to
 */
export function json_schema_resolve_refs(schemaObj: any) {
  const o = clone(schemaObj)
  while (tick()) {}
  function tick() {
    let changed = false
    traverse(o).forEach(function (x: any) {
      const id = x_$ref_id(x)
      if (!id) return
      changed = true
      this.update(clone(o.definitions[id]), true)
    })
    return changed
  }
  return o
}

/**
 * @param schemaObj a valid JSON schema object
 * @returns the *same* JSON schema object with all $refs
 *          having been replaced by the definition they refer to
 */
export function json_schema_resolve_refs_in_place(o: any) {
  while (tick()) {}
  function tick() {
    let changed = false
    traverse(o).forEach(function (x: any) {
      const id = x_$ref_id(x)
      if (!id) return
      changed = true
      this.update(o.definitions[id], true)
    })
    return changed
  }
}

function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

{
  const obj = {
    a: "a",
    b: { $ref: "#/definitions/B" },
    c: { $ref: "#/definitions/C" },
    definitions: {
      B: { label: "this is B", c: { $ref: "#/definitions/C" } },
      C: { label: "this is C" },
    },
  }

  const obj2 = json_schema_resolve_refs(obj)
  obj2
  obj2.c !== obj2.b.c
}

function x_$ref(x: unknown): string | undefined {
  try {
    const r = (x as any).$ref
    if (typeof r === "string") return r
  } catch {}
}

function x_$ref_id(x: unknown): string | undefined {
  return x_$ref(x)?.split("/")?.pop()
}
