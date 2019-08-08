let { existsSync } = require('fs')
let { join } = require('path')
let chalk = require('chalk')

let ownPackage = require('./package.json')

let b = chalk.bold
let y = chalk.yellow

module.exports = process => {
  function print (...lines) {
    process.stdout.write(lines.join('\n') + '\n')
  }
  function printError (...lines) {
    process.stderr.write(lines.join('\n') + '\n')
  }

  function showHelp (modules) {
    print(
      y('size-limit [OPTION]… [FILE]…'),
      'Check the real performance cost of your front-end project to users',
      '',
      b('Core options:'),
      `  ${ y('--limit LIMIT') }     Set size or running time limit for files`,
      `  ${ y('--json') }            Show results in JSON format`,
      `  ${ y('--save-build DIR') }  Put build files to check them by hand`,
      `  ${ y('--help') }            Display this help`,
      `  ${ y('--version') }         Display version`
    )
    if (modules.has('webpack')) {
      print(
        '',
        b('Webpack options:'),
        `  ${ y('--why') }                  Show package content`,
        `  ${ y('--webpack-config FILE') }  Set custom webpack config`
      )
    }
    print(
      '',
      b('Examples:'),
      y('  size-limit'),
      '    Read configuration from package.json or .size-limit and check limit',
      y('  size-limit index.js')
    )
    if (modules.has('webpack')) {
      print(
        '    Show the size of specific files with all file dependencies',
        y('  size-limit --why'),
        '    Show reasons why project have this size'
      )
    } else {
      print(
        '    Show the size of specific files'
      )
    }
  }

  function showVersion () {
    print(`size-limit ${ ownPackage.version }`)
  }

  function showMigrationGuide (pkg) {
    let add = 'npm install --save-dev '
    let rm = 'npm remove '
    if (existsSync(join(pkg.path, '..', 'yarn.lock'))) {
      add = 'yarn add --dev '
      rm = 'yarn remove '
    }
    printError(
      chalk.red('Install Size Limit preset depends on type of the project'),
      '',
      'For application, where you send JS bundle directly to users',
      '  ' + y(add + '@size-limit/preset-app'),
      'For frameworks, components and big libraries',
      '  ' + y(add + '@size-limit/preset-big-lib'),
      'For small (< 10 KB) libraries',
      '  ' + y(add + '@size-limit/preset-small-lib'),
      'Check out docs for more comlicated cases',
      '  ' + y('https://github.com/ai/size-limit/')
    )
    let devDependencies = pkg.package.devDependencies
    if (devDependencies && devDependencies['size-limit']) {
      printError(
        '',
        `You can remove size-limit dependency: ${ y(rm + 'size-limit') }`
      )
    }
  }

  return { showVersion, showHelp, showMigrationGuide }
}