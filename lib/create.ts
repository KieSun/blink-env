import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { IConfig, IOptions } from './types'
import { deleteFolder } from './utils'

export default async (name: string | undefined, options: IOptions) => {
  const cwd = process.cwd()
  const inCurrent = !name || name === '.'
  const currentName = inCurrent ? path.relative('./', cwd) : name
  const targetDir = path.resolve(cwd, currentName || '.')

  const { force } = options

  if (force) {
    deleteFolder(targetDir)
  }

  if (fs.existsSync(targetDir) && !force) {
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Whether to create the demo in the current ${chalk.cyan(
            targetDir
          )} folder or no？`,
        },
      ])
      if (!ok) {
        process.exit(1)
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `The current folder ${chalk.cyan(
            targetDir
          )} already exists, whether to overwrite the overwrite?`,
          choices: [
            { name: 'confirm', value: true },
            { name: 'cancel', value: false },
          ],
        },
      ])
      if (action) {
        await fs.remove(targetDir)
      } else {
        process.exit(1)
      }
    }
  }

  const { choose } = await getConfig()
  console.log(choose)
}

const getConfig = () => {
  return inquirer.prompt<{ choose: IConfig[] }>([
    {
      name: 'choose',
      type: 'checkbox',
      message: '',
      choices: [
        { name: 'React', value: IConfig.React },
        { name: 'Vue', value: IConfig.Vue },
        { name: 'Normal', value: IConfig.Normal },
      ],
    },
  ])
}
