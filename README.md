# stock-manager

A minimal Electron application with TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Updating
1. **Change packet version:**
   ```bash
   npm version patch   # 1.0.0 → 1.0.1
   # ou
   npm version minor   # 1.0.0 → 1.1.0
   # ou
   npm version major   # 1.0.0 → 2.0.0
   ```

2. **Creating release drafts:**
   ```bash
   npm run publish:linux   # Linux
   npm run publish:win     # Windows
   npm run publish:mac     # MacOS
   npm run publish         # All platforms
   ```

3. **Publishing release:**
   - Go to release section on github repo
   - Change description and **Publish release**
