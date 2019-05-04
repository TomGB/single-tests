const globby = require('globby');
const fs = require('fs')
const { join, basename, dirname } = require('path')
const transform = require('transform-ast')

const args = require('minimist')(process.argv.slice(2))

if (!args.config) {
    const errorMessage = [
        'A config file for split must be defined',
        'You can specify a config file via the cli',
        'e.g.',
        'split --config split.config.js',
        ''
    ].join('\n')

    throw Error(errorMessage)
}

const config = require(join(process.cwd(), args.config))

const sandboxDir = 'split-tmp'

const makeTestsSingle = (path, sandboxDir) => {
    const contents = fs.readFileSync(path, 'utf8');
    const fileName = basename(path)
    const dir = dirname(path)

    const tests = []

    transform(contents, node => {
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
        await makeTestsSingle(path, sandboxDir)
    })

    promises.concat(createTestFiles)

    await Promise.all(promises)
}

run()
