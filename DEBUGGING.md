Para depurar o CLI, você tem duas opções principais:

1.  **Usando o VS Code:**
    - Abra o projeto `gemini-cli` no VS Code.
    - Vá para a aba "Run and Debug" (Ctrl+Shift+D ou Cmd+Shift+D).
    - Selecione a configuração "Launch CLI" no menu suspenso.
    - Clique no botão de iniciar depuração (o triângulo verde).
    - Esta configuração executará o CLI e permitirá que você defina pontos de interrupção e inspecione o código.

2.  **Usando o terminal e anexando um depurador:**
    - No terminal, navegue até o diretório `gemini-cli`.
    - Execute o comando: `npm run debug`
    - Este comando iniciará o CLI com o inspetor do Node.js ativado na porta 9229.
    - Você pode então anexar um depurador Node.js (como o do VS Code, usando a configuração "Attach" no `launch.json`) a esta porta para depurar o processo.
