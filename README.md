# EXATYPES

JavaScript type information for the [EXAPUNKS](http://www.zachtronics.com/exapunks/) custom level code which aids in writing code by supplying documentation, auto-completion and type safety.

![Example of code lens in Visual Studio Code](https://raw.githubusercontent.com/brunnerh/exatypes/master/readme-files/lens-example.png)

## Installation

The types can be installed from the [npm](https://www.npmjs.com/) repository:

```shell
npm install exatypes
```

Alternatively you can just manually copy the type declaration file [`exapunks.d.ts`](https://github.com/brunnerh/exatypes/blob/master/exapunks.d.ts) to a location where your development tools can find it.

## Usage Suggestions

The type declaration file works well with [Visual Studio Code](https://code.visualstudio.com/) and strict TypeScript settings are recommended to catch the accidental use of undefined symbols and various other issues.

To turn on the type checking of your JavaScript level code, add the comment `// @ts-check` at the top of the file.

Example `tsconfig.json` to turn on strict mode:

```json
{
    "compilerOptions": {
        "strict": true,
        "lib": ["es5"],
    },
}
```

Note that you will probably still get completion for many other types that will not be defined in the context of EXAPUNKS. This includes e.g. any DOM classes and constants. Also, `Math.random` has been explicitly removed to prevent the tests from being non-deterministic.