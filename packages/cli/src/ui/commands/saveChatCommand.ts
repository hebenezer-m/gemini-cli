/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandContext, SlashCommand } from './types.js';

import * as crypto from 'crypto';

export const saveChatCommand: SlashCommand = {
  name: 'save-chat',
  description:
    'Salva o histórico do chat em um arquivo JSONL, opcionalmente criptografado.',
  action: async (context: CommandContext, args: string) => {
    const { history, addItem } = context.ui; // Acessa o histórico do CommandContext

    // 1. Validar argumentos (nome do arquivo e, opcionalmente, senha)
    const [fileName, password] = args.split(' ').filter(Boolean);

    if (!fileName) {
      addItem(
        {
          type: 'info',
          text: 'Uso: /save-chat <nome-do-arquivo> [senha]',
        },
        Date.now(),
      );
      return;
    }

    // 2. Serializar o histórico para JSONL
    const historyJsonl = history.map((item) => JSON.stringify(item)).join('\n');

    // 3. Criptografar o conteúdo
    let contentToSave = historyJsonl;
    if (password) {
      try {
        const algorithm = 'aes-256-cbc';
        const salt = crypto.randomBytes(16); // Gerar um salt aleatório
        const iv = crypto.randomBytes(16); // Gerar um IV aleatório

        // Derivar a chave da senha usando PBKDF2
        const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512'); // 100k iterações, 32 bytes de chave

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(historyJsonl, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Armazenar salt, iv e o conteúdo criptografado
        contentToSave = JSON.stringify({
          salt: salt.toString('hex'),
          iv: iv.toString('hex'),
          encryptedData: encrypted,
        });

        addItem(
          {
            type: 'info',
            text: 'Histórico do chat criptografado com sucesso.',
          },
          Date.now(),
        );
      } catch (e: unknown) {
        addItem(
          {
            type: 'error',
            text: `Erro ao criptografar o chat: ${e instanceof Error ? e.message : String(e)}`,
          },
          Date.now(),
        );
        return; // Interromper a execução se a criptografia falhar
      }
    }

    // 4. Salvar o arquivo
    try {
      // A ferramenta write_file espera um caminho absoluto
      const absoluteFilePath = `${process.cwd()}/${fileName}`;
      const toolRegistry = await context.services.config?.getToolRegistry();
      const writeFileTool = toolRegistry?.getTool('write_file');
      if (writeFileTool) {
        await writeFileTool.execute({
          file_path: absoluteFilePath,
          content: contentToSave,
        });
      } else {
        addItem(
          {
            type: 'error',
            text: 'Ferramenta write_file não encontrada.',
          },
          Date.now(),
        );
        return;
      }
      addItem(
        {
          type: 'info',
          text: `Histórico do chat salvo em: ${absoluteFilePath}`,
        },
        Date.now(),
      );
    } catch (error: unknown) {
      addItem(
        {
          type: 'error',
          text: `Erro ao salvar o chat: ${error instanceof Error ? error.message : String(error)}`,
        },
        Date.now(),
      );
    }
  },
};
