const esprima = require('esprima')
const escodegen = require('escodegen')
const globby = require('globby');
const fs = require('fs')
const { join, basename, dirname } = require('path')
const { Parser } = require("acorn")
var traverse = require("ast-traverse");
const transform = require('transform-ast')

// const removeDuplicates = arr => arr.reduce((acc, item) => acc.includes(item) ? acc : acc.concat(item), [])
// const flatten = arr => arr.reduce((acc, item) => acc.concat(...item), [])
const clone = a => JSON.parse(JSON.stringify(a))
const someFn = {"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"ArrowFunctionExpression","id":null,"expression":false,"generator":false,"async":false,"params":[],"body":{"type":"BlockStatement","body":[]}}}],"sourceType":"script"}

const args = require('minimist')(process.argv.slice(2))

const config = require(join(process.cwd(), args.config))

const sandboxDir = 'single.tmp'

const makeTestsSingle = (path, sandboxDir) => {
    const contents = fs.readFileSync(path, 'utf8');
    const fileName = basename(path)
    const dir = dirname(path)

    const tests = []

    const result = transform(contents, node => {
        if (node.type === 'ExpressionStatement' && node.expression && node.expression.callee && node.expression.callee.name === 'it') {
            tests.push(node)
            node.edit.update('')
        }
    })

    tests.map((testNode, index) => {
        let testCount = 0
        const result = transform(contents, node => {
            if (node.type === 'ExpressionStatement' && node.expression && node.expression.callee && node.expression.callee.name === 'it') {
                if (index !== testCount) {
                    node.edit.update('')
                }

                testCount ++
            }
        })

        const output = result.toString()

        const newFileName = join(sandboxDir, dir, index.toString() + fileName)
        const newDirName = dirname(newFileName)

        if (!fs.existsSync(newDirName)){
            fs.mkdirSync(newDirName, { recursive: true });
        }

        fs.writeFileSync(newFileName, output)
    })
}

const run = async () => {
    const sandboxFiles = await globby(config.files)
    const testFiles = await globby(config.tests)

    const promises = []

    const copyNonTestFiles = sandboxFiles.map(async path => {
        const newFile = join(sandboxDir, path)
        const dir = dirname(newFile)

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.copyFileSync(path, newFile);
    })

    promises.concat(copyNonTestFiles)

    const createTestFiles = testFiles.map(async path => {
        const newFile = join(sandboxDir, path)
        await makeTestsSingle(path, sandboxDir)
    })

    promises.concat(createTestFiles)

    await Promise.all(promises)

}

run()
