const fs = require('fs')
try {
  const envVariables = [
  ]
  const envFileString = envVariables.reduce((fileString, envVar) => (
    fileString.concat(`${envVar}=${process.env[envVar]}\n`)
  ), '')
  fs.writeFileSync('./.env', envFileString)
} catch (error) {
  console.error('Failed to write .env file')
  process.exit(1)
}
