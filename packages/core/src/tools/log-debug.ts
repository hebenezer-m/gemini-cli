/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseTool, ToolResult } from './tools.js';
import { Type } from '@google/genai';
import { SchemaValidator } from '../utils/schemaValidator.js';
import fs from 'fs';

export interface LogDebugToolParams {
  message: string;
  exec_id: string;
}

export class LogDebugTool extends BaseTool<LogDebugToolParams, ToolResult> {
  static Name: string = 'log_debug_message';

  constructor() {
    super(
      LogDebugTool.Name,
      'Log Debug Message',
      "Registers a debug message with an execution ID in the agent's log file.",
      {
        type: Type.OBJECT,
        properties: {
          message: {
            type: Type.STRING,
            description: 'The debug message to log.',
          },
          exec_id: {
            type: Type.STRING,
            description:
              'A unique identifier for the current execution context.',
          },
        },
        required: ['message', 'exec_id'],
      },
      false, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  validateToolParams(params: LogDebugToolParams): string | null {
    const errors = SchemaValidator.validate(this.schema.parameters, params);
    if (errors) {
      return errors;
    }
    if (!params.message.trim()) {
      return 'Message cannot be empty.';
    }
    if (!params.exec_id.trim()) {
      return 'Execution ID cannot be empty.';
    }
    return null;
  }

  getDescription(params: LogDebugToolParams): string {
    return `Logging debug message: "${params.message}" with Exec ID: "${params.exec_id}"`;
  }

  async execute(params: LogDebugToolParams): Promise<ToolResult> {
    const validationError = this.validateToolParams(params);
    if (validationError) {
      return {
        llmContent: `Log message rejected: ${params.message}. Reason: ${validationError}`,
        returnDisplay: `Error: ${validationError}`,
      };
    }

    const logFilePath = '/home/hebenezer/agent_debug.log';
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, ''); // YYYY-MM-DD HH:MM:SS
    const logEntry = `[${timestamp}] [Exec ID: ${params.exec_id}] ${params.message}\n`;

    try {
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
      return {
        llmContent: `Debug message logged successfully for Exec ID: ${params.exec_id}`,
        returnDisplay: `Debug message logged for Exec ID: ${params.exec_id}`,
      };
    } catch (e: unknown) {
      const errorMessage = `Failed to write to log file ${logFilePath}: ${e instanceof Error ? e.message : String(e)}`;
      console.error(errorMessage);
      return {
        llmContent: `Failed to log debug message. ${errorMessage}`,
        returnDisplay: `Error: ${errorMessage}`,
      };
    }
  }
}
