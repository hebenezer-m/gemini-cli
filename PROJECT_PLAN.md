## Plano de Projeto: Funcionalidade de Salvar Chat no Gemini CLI (Otimizado para RAG e Criptografado)

**Objetivo:** Adicionar um comando interativo ao Gemini CLI que permita ao usuário salvar o histórico completo da conversa em um arquivo local no formato JSONL, com metadados ricos e criptografia baseada em senha do usuário.

**Etapas Propostas:**

1.  **Definição do Comando e Interface:**
    - **Comando:** Proponho o comando `/save-chat [nome-do-arquivo]`. Opcionalmente, `/save-chat [nome-do-arquivo] --password [senha]` ou solicitar a senha interativamente.
    - **Formato Padrão:** JSONL.
    - **Feedback:** O CLI fornecerá feedback ao usuário sobre o sucesso ou falha do salvamento, incluindo o caminho completo do arquivo.

2.  **Acesso e Serialização do Histórico da Conversa para JSONL:**
    - **Origem dos Dados:** O histórico da conversa é gerenciado internamente pelo Gemini CLI. Precisaremos identificar o serviço ou contexto que armazena o array de objetos de mensagem (`HistoryItem[]`).
    - **Serialização para JSONL:** Cada objeto de mensagem no histórico será convertido em um objeto JSON com a estrutura proposta (incluindo metadados relevantes como `speaker`, `message_type`, `content`, `model_used`, `tool_name`, `tool_params`, `token_count`). Cada objeto JSON será escrito como uma linha separada no arquivo.

3.  **Implementação da Lógica de Criptografia (com senha do usuário):**
    - **Algoritmo de Criptografia:** AES (Advanced Encryption Standard) no modo GCM (Galois/Counter Mode) para autenticação e confidencialidade.
    - **Derivação de Chave (KDF):** PBKDF2 (Password-Based Key Derivation Function 2) com um salt aleatório e um número adequado de iterações para derivar a chave de criptografia a partir da senha do usuário.
    - **Salt e IV:** Um salt único e um IV (Initialization Vector) único serão gerados para cada arquivo e armazenados no cabeçalho do arquivo criptografado (ou em um arquivo de metadados separado).
    - **Processo:** O histórico serializado em JSONL será criptografado usando a chave derivada e o IV.

4.  **Implementação da Lógica de Salvamento:**
    - **Localização:** A lógica será implementada em um novo arquivo de comando dentro de `packages/cli/src/ui/commands/` (por exemplo, `saveChatCommand.ts`) no repositório do Gemini CLI.
    - **Escrita do Arquivo:** Utilizaremos a ferramenta `write_file` para escrever o conteúdo criptografado no caminho de arquivo especificado pelo usuário.
    - **Validação:** Validar o nome do arquivo fornecido pelo usuário para evitar sobrescrever arquivos importantes ou criar caminhos inválidos.

5.  **Implementação da Lógica de Descriptografia (Comando `/load-chat` - Fase Posterior):**
    - **Comando:** Proponho `/load-chat [nome-do-arquivo]`. Opcionalmente, `/load-chat [nome-do-arquivo] --password [senha]` ou solicitar a senha interativamente.
    - **Processo:** Ler o arquivo, extrair salt e IV, derivar a chave da senha fornecida, descriptografar o conteúdo e carregar o histórico na sessão do CLI.

6.  **Integração com o CLI:**
    - **Registro do Comando:** O novo comando `/save-chat` precisará ser registrado no sistema de comandos do CLI.
    - **Disponibilidade:** Garantir que o comando esteja disponível no modo interativo do CLI.

7.  **Testes:**
    - **Testes Unitários:** Para a lógica de serialização para JSONL, criptografia/descriptografia e validação do nome do arquivo.
    - **Testes de Integração:** Para verificar se o comando `/save-chat` funciona corretamente no fluxo completo do CLI, salvando e carregando o histórico, e lidando com casos de erro (senha incorreta, arquivo corrompido).

8.  **Considerações Adicionais:**
    - **Privacidade:** Adicionar um aviso ou lembrete ao usuário sobre o salvamento de informações potencialmente sensíveis no histórico da conversa.
    - **Tamanho do Histórico:** Considerar o impacto de históricos de conversa muito longos no tamanho do arquivo e no desempenho.
    - **Geração de Embeddings (Fase 2):** Em uma fase posterior, podemos explorar a integração com um modelo de embedding para gerar e armazenar embeddings para cada turno da conversa, permitindo busca semântica avançada.
