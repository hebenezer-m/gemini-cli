# Correção para o Aviso de Depreciação do `punycode`

Este documento descreve os passos para resolver o `DeprecationWarning` do módulo `punycode` que ocorre ao executar o `gemini-cli`.

## Problema

Ao executar o `gemini-cli`, um aviso de depreciação é exibido:

```
(node:xxxx) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
```

Isso ocorre porque uma dependência (especificamente o `jsdom`) está utilizando a versão obsoleta do módulo `punycode` que era integrada ao Node.js.

## Solução

A solução consiste em forçar o `esbuild` (a ferramenta de compilação do projeto) a usar a versão `npm` do `punycode` em vez da versão obsoleta do Node.js. Isso é feito através de um "shim".

### Passos Implementados

1.  **Criação do Shim (`punycode-shim.js`)**

    Um arquivo chamado `punycode-shim.js` foi criado na raiz do projeto com o seguinte conteúdo:

    ```javascript
    import punycode from 'punycode';
    globalThis.punycode = punycode;
    ```

    Este arquivo importa o pacote `punycode` do `npm` e o atribui a uma variável global, garantindo que ele esteja disponível durante o processo de compilação.

2.  **Modificação da Configuração do `esbuild` (`esbuild.config.js`)**

    O arquivo `esbuild.config.js` foi modificado para usar a opção `inject` do `esbuild`, que injeta o nosso shim no topo do bundle final.

    A configuração foi alterada da seguinte forma:

    ```javascript
    // ... (código anterior)
    banner: {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); globalThis.__filename = require('url').fileURLToPath(import.meta.url); globalThis.__dirname = require('path').dirname(globalThis.__filename);`,
    },
    inject: ['./punycode-shim.js'],
    })
    .catch(() => process.exit(1));
    ```

Com essas alterações, o `esbuild` agora empacota a versão correta do `punycode`, e o aviso de depreciação não é mais exibido.
