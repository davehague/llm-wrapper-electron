# Introduction
This is an Electron app which is intended to be a wrapper around multiple LLMs.  The intention is that this should always be running, easy to access, and allow the user to test out the responses quickly on their desktop (instead of trying to find the browser tab that has their LLM open)

# Setup
1. Install node
1. Install electron `npm install -g electron`
1. Run `npm install`

1. Set up your API keys by creating an .env file and putting the values in there

```
OPENAI_API_KEY=sk-YOUR-KEY-HERE
```

Then, run `npm run build` to build and then `npm start` to start the project.


# Notes about Electron
To run Dev Tools you can do one of two things:

1. In index.js
```
win.webContents.openDevTools(); // This line opens the dev tools
```

2. Use `Ctrl + Shift + I` after the program is running

## Hot reload
This project uses `nodemon` to perform hot reload


## Understanding the structure
**index.js** file is the entry point of your Electron application and runs in the "main process." It's responsible for managing application lifecycle events, creating windows, and handling system events.

**preload.js** file is a script that gets executed before the renderer process is loaded. It has access to Node.js APIs and can safely expose selected functionality from the main process to the renderer process

**renderer.js** file is the script that controls the web pages. It's akin to the JavaScript you would write for a regular web page, and it runs in the "renderer process."

# Build
`npm run make` and then check `\path-to\llm-wrapper-electron\out\make\squirrel.windows\x64`

"C:\Users\david\source\llm-wrapper-electron\node_modules\electron-winstaller\vendor\signtool.exe" sign /a /f "C:\Users\david\source\llm-wrapper-electron\cert.pfx" /p "P@ssword123" "C:\Users\david\AppData\Local\SquirrelTemp\tempa\lib\net45\ffmpeg.dll"


## Creating a self signed certificate
$cert = New-SelfSignedCertificate -DnsName davehague.com -CertStoreLocation "cert:\CurrentUser\My" -KeyUsage DigitalSignature -Type CodeSigningCert -KeyAlgorithm RSA -KeyLength 2048 -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider"


$pwd = ConvertTo-SecureString -String "P@ssword123" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "./cert.pfx" -Password $pwd
