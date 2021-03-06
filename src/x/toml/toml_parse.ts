import { parse } from "toml/lib/parser"

export function toml_parse(src: string): TopLevelNode[] {
  return parse(src)
}

export interface TOMLNodeBase {
  line: number
  column: number
  type: string
}

export type TopLevelNode = Assign | ObjectPath | ArrayPath
export type ScalarValue = StringValue | IntegerValue | BooleanValue
export type Value = ArrayValue | ScalarValue | InlineTable
export type TOMLNode = TopLevelNode | Value

export function ScalarValue_is(x: Value): x is ScalarValue {
  // TODO: more scalar values
  return x.type === "String" || x.type === "Integer" || x.type === "Boolean"
}

export interface ObjectPath extends TOMLNodeBase {
  type: "ObjectPath"
  value: string[] //["functions"],
}
export interface ArrayPath extends TOMLNodeBase {
  type: "ArrayPath"
  value: string[]
}
export interface ArrayValue extends TOMLNodeBase {
  type: "Array"
  value: Value[]
}
export interface StringValue extends TOMLNodeBase {
  type: "String"
  value: string //"myfunctions/",
}
export interface IntegerValue extends TOMLNodeBase {
  type: "Integer"
  value: number //"myfunctions/",
}
export interface BooleanValue extends TOMLNodeBase {
  type: "Boolean"
  value: boolean //"myfunctions/",
}
export interface Assign extends TOMLNodeBase {
  type: "Assign"
  value: Value
  key: string //"directory",
}

export interface InlineTable extends TOMLNodeBase {
  type: "InlineTable"
  value: InlineTableValue[]
}

export interface InlineTableValue extends TOMLNodeBase {
  type: "InlineTableValue"
  value: Value
  key: string
}

const nn2: TopLevelNode[] = [
  {
    type: "ObjectPath",
    value: ["a", "b"],
    line: 2,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "c",
      line: 3,
      column: 3,
    },
    line: 3,
    column: 1,
    key: "c",
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "Integer",
          value: 1,
          line: 4,
          column: 6,
        },
        {
          type: "Array",
          value: [
            {
              type: "Integer",
              value: 2,
              line: 4,
              column: 10,
            },
            {
              type: "Integer",
              value: 4,
              line: 4,
              column: 13,
            },
          ],
          line: 4,
          column: 9,
        },
      ],
      line: 4,
      column: 5,
    },
    line: 4,
    column: 1,
    key: "d",
  },
]

const xxxxx: Assign = {
  type: "Assign",
  value: {
    type: "InlineTable",
    value: [
      {
        type: "InlineTableValue",
        value: {
          type: "String",
          value: "super secret",
          line: 27,
          column: 34,
        },
        line: 27,
        column: 19,
        key: "ACCESS_TOKEN",
      },
      {
        type: "InlineTableValue",
        value: {
          type: "String",
          value: "14.15.3",
          line: 27,
          column: 65,
        },
        line: 27,
        column: 50,
        key: "NODE_VERSION",
      },
    ],
    line: 27,
    column: 17,
  },
  line: 27,
  column: 3,
  key: "environment",
}

const ast: TopLevelNode[] = [
  {
    type: "ObjectPath",
    value: ["functions"],
    line: 2,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "myfunctions/",
      line: 4,
      column: 15,
    },
    line: 4,
    column: 3,
    key: "directory",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "esbuild",
      line: 7,
      column: 17,
    },
    line: 7,
    column: 3,
    key: "node_bundler",
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "String",
          value: "package-1",
          line: 10,
          column: 28,
        },
      ],
      line: 10,
      column: 27,
    },
    line: 10,
    column: 3,
    key: "external_node_modules",
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "String",
          value: "files/*.md",
          line: 13,
          column: 21,
        },
      ],
      line: 13,
      column: 20,
    },
    line: 13,
    column: 3,
    key: "included_files",
  },
  {
    type: "ObjectPath",
    value: ["functions", "api_*"],
    line: 15,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "String",
          value: "package-2",
          line: 19,
          column: 28,
        },
      ],
      line: 19,
      column: 27,
    },
    line: 19,
    column: 3,
    key: "external_node_modules",
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "String",
          value: "!files/post-1.md",
          line: 22,
          column: 21,
        },
      ],
      line: 22,
      column: 20,
    },
    line: 22,
    column: 3,
    key: "included_files",
  },
  {
    type: "ObjectPath",
    value: ["functions", "api_payment"],
    line: 24,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "String",
          value: "package-3",
          line: 30,
          column: 28,
        },
        {
          type: "String",
          value: "package-4",
          line: 30,
          column: 41,
        },
      ],
      line: 30,
      column: 27,
    },
    line: 30,
    column: 3,
    key: "external_node_modules",
  },
  {
    type: "Assign",
    value: {
      type: "Array",
      value: [
        {
          type: "String",
          value: "!files/post-2.md",
          line: 35,
          column: 21,
        },
        {
          type: "String",
          value: "package.json",
          line: 35,
          column: 41,
        },
        {
          type: "String",
          value: "images/**",
          line: 35,
          column: 57,
        },
      ],
      line: 35,
      column: 20,
    },
    line: 35,
    column: 3,
    key: "included_files",
  },
]

const ast2: TopLevelNode[] = [
  {
    type: "ObjectPath",
    value: ["build"],
    line: 3,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "project/",
      line: 7,
      column: 10,
    },
    line: 7,
    column: 3,
    key: "base",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "build-output/",
      line: 13,
      column: 13,
    },
    line: 13,
    column: 3,
    key: "publish",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "echo 'default context'",
      line: 16,
      column: 13,
    },
    line: 16,
    column: 3,
    key: "command",
  },
  {
    type: "ArrayPath",
    value: ["plugins"],
    line: 18,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "@netlify/plugin-lighthouse",
      line: 20,
      column: 13,
    },
    line: 20,
    column: 3,
    key: "package",
  },
  {
    type: "ObjectPath",
    value: ["context", "production"],
    line: 24,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "output/",
      line: 25,
      column: 13,
    },
    line: 25,
    column: 3,
    key: "publish",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "make publish",
      line: 26,
      column: 13,
    },
    line: 26,
    column: 3,
    key: "command",
  },
  {
    type: "Assign",
    value: {
      type: "InlineTable",
      value: [
        {
          type: "InlineTableValue",
          value: {
            type: "String",
            value: "super secret",
            line: 27,
            column: 34,
          },
          line: 27,
          column: 19,
          key: "ACCESS_TOKEN",
        },
        {
          type: "InlineTableValue",
          value: {
            type: "String",
            value: "14.15.3",
            line: 27,
            column: 65,
          },
          line: 27,
          column: 50,
          key: "NODE_VERSION",
        },
      ],
      line: 27,
      column: 17,
    },
    line: 27,
    column: 3,
    key: "environment",
  },
  {
    type: "ObjectPath",
    value: ["context", "deploy-preview"],
    line: 31,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "dist/",
      line: 32,
      column: 13,
    },
    line: 32,
    column: 3,
    key: "publish",
  },
  {
    type: "ObjectPath",
    value: ["context", "deploy-preview", "environment"],
    line: 35,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "not so secret",
      line: 36,
      column: 18,
    },
    line: 36,
    column: 3,
    key: "ACCESS_TOKEN",
  },
  {
    type: "ObjectPath",
    value: ["context", "branch-deploy"],
    line: 40,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "echo branch",
      line: 41,
      column: 13,
    },
    line: 41,
    column: 3,
    key: "command",
  },
  {
    type: "ObjectPath",
    value: ["context", "branch-deploy", "environment"],
    line: 42,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "development",
      line: 43,
      column: 14,
    },
    line: 43,
    column: 3,
    key: "NODE_ENV",
  },
  {
    type: "ObjectPath",
    value: ["context", "staging"],
    line: 47,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "echo 'staging'",
      line: 48,
      column: 13,
    },
    line: 48,
    column: 3,
    key: "command",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "staging",
      line: 49,
      column: 10,
    },
    line: 49,
    column: 3,
    key: "base",
  },
  {
    type: "ObjectPath",
    value: ["context", "feat/branch"],
    line: 53,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "echo 'special branch'",
      line: 54,
      column: 13,
    },
    line: 54,
    column: 3,
    key: "command",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "branch",
      line: 55,
      column: 10,
    },
    line: 55,
    column: 3,
    key: "base",
  },
  {
    type: "ArrayPath",
    value: ["redirects"],
    line: 63,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/*",
      line: 64,
      column: 10,
    },
    line: 64,
    column: 3,
    key: "from",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/blog/:splat",
      line: 65,
      column: 8,
    },
    line: 65,
    column: 3,
    key: "to",
  },
  {
    type: "ArrayPath",
    value: ["redirects"],
    line: 68,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/old-path",
      line: 69,
      column: 10,
    },
    line: 69,
    column: 3,
    key: "from",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/new-path",
      line: 70,
      column: 8,
    },
    line: 70,
    column: 3,
    key: "to",
  },
  {
    type: "Assign",
    value: {
      type: "Integer",
      value: 302,
      line: 73,
      column: 12,
    },
    line: 73,
    column: 3,
    key: "status",
  },
  {
    type: "Assign",
    value: {
      type: "Boolean",
      value: true,
      line: 78,
      column: 11,
    },
    line: 78,
    column: 3,
    key: "force",
  },
  {
    type: "Assign",
    value: {
      type: "InlineTable",
      value: [
        {
          type: "InlineTableValue",
          value: {
            type: "String",
            value: ":id",
            line: 83,
            column: 17,
          },
          line: 83,
          column: 12,
          key: "id",
        },
      ],
      line: 83,
      column: 11,
    },
    line: 83,
    column: 3,
    key: "query",
  },
  {
    type: "Assign",
    value: {
      type: "InlineTable",
      value: [
        {
          type: "InlineTableValue",
          value: {
            type: "Array",
            value: [
              {
                type: "String",
                value: "en",
                line: 86,
                column: 29,
              },
            ],
            line: 86,
            column: 28,
          },
          line: 86,
          column: 17,
          key: "Language",
        },
        {
          type: "InlineTableValue",
          value: {
            type: "Array",
            value: [
              {
                type: "String",
                value: "us",
                line: 86,
                column: 47,
              },
            ],
            line: 86,
            column: 46,
          },
          line: 86,
          column: 36,
          key: "Country",
        },
      ],
      line: 86,
      column: 16,
    },
    line: 86,
    column: 3,
    key: "conditions",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "API_SIGNATURE_TOKEN",
      line: 89,
      column: 12,
    },
    line: 89,
    column: 3,
    key: "signed",
  },
  {
    type: "ObjectPath",
    value: ["redirects", "headers"],
    line: 92,
    column: 3,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "Netlify",
      line: 93,
      column: 14,
    },
    line: 93,
    column: 5,
    key: "X-From",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "some-api-key-string",
      line: 94,
      column: 17,
    },
    line: 94,
    column: 5,
    key: "X-Api-Key",
  },
  {
    type: "ArrayPath",
    value: ["redirects"],
    line: 97,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/gated-path",
      line: 98,
      column: 10,
    },
    line: 98,
    column: 3,
    key: "from",
  },
  {
    type: "Assign",
    value: {
      type: "Integer",
      value: 200,
      line: 99,
      column: 12,
    },
    line: 99,
    column: 3,
    key: "status",
  },
  {
    type: "Assign",
    value: {
      type: "InlineTable",
      value: [
        {
          type: "InlineTableValue",
          value: {
            type: "Array",
            value: [
              {
                type: "String",
                value: "admin",
                line: 100,
                column: 25,
              },
            ],
            line: 100,
            column: 24,
          },
          line: 100,
          column: 17,
          key: "Role",
        },
      ],
      line: 100,
      column: 16,
    },
    line: 100,
    column: 3,
    key: "conditions",
  },
  {
    type: "Assign",
    value: {
      type: "Boolean",
      value: true,
      line: 101,
      column: 11,
    },
    line: 101,
    column: 3,
    key: "force",
  },
  {
    type: "ArrayPath",
    value: ["redirects"],
    line: 105,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/*",
      line: 106,
      column: 10,
    },
    line: 106,
    column: 3,
    key: "from",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/index.html",
      line: 107,
      column: 8,
    },
    line: 107,
    column: 3,
    key: "to",
  },
  {
    type: "Assign",
    value: {
      type: "Integer",
      value: 200,
      line: 108,
      column: 12,
    },
    line: 108,
    column: 3,
    key: "status",
  },
  {
    type: "ArrayPath",
    value: ["headers"],
    line: 110,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "/*",
      line: 112,
      column: 9,
    },
    line: 112,
    column: 3,
    key: "for",
  },
  {
    type: "ObjectPath",
    value: ["headers", "values"],
    line: 114,
    column: 3,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "DENY",
      line: 115,
      column: 23,
    },
    line: 115,
    column: 5,
    key: "X-Frame-Options",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "1; mode=block",
      line: 116,
      column: 24,
    },
    line: 116,
    column: 5,
    key: "X-XSS-Protection",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "frame-ancestors https://www.facebook.com",
      line: 117,
      column: 31,
    },
    line: 117,
    column: 5,
    key: "Content-Security-Policy",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "\tmax-age=0,\n\tno-cache,\n\tno-store,\n\tmust-revalidate",
      line: 120,
      column: 18,
    },
    line: 120,
    column: 2,
    key: "cache-control",
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "someuser:somepassword anotheruser:anotherpassword",
      line: 128,
      column: 18,
    },
    line: 128,
    column: 5,
    key: "Basic-Auth",
  },
  {
    type: "ObjectPath",
    value: ["functions"],
    line: 130,
    column: 1,
  },
  {
    type: "Assign",
    value: {
      type: "String",
      value: "functions/",
      line: 134,
      column: 15,
    },
    line: 134,
    column: 3,
    key: "directory",
  },
]
