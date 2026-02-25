import winston from 'winston';
import winstonSyslog from 'winston-syslog';
import { isLocal } from 'lib/utils/environment';
import os from 'os';
import { getValidatedToken } from 'lib/services/api-fetch/token';

process.env.TZ = 'Europe/Oslo';

export function getLogger(name: string): winston.Logger {
  const { NAIS_APP_NAME } = process.env;

  const consoleFormat = isLocal()
    ? winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, logger_name, app_name, ...metadata }) => {
          const metaString = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : '';
          return `${timestamp} [${level}] [${logger_name}]: ${message} ${metaString}`;
        })
      )
    : winston.format.combine(winston.format.timestamp(), winston.format.json());

  return winston.createLogger({
    defaultMeta: {
      logger_name: name,
      app_name: NAIS_APP_NAME,
    },
    transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: consoleFormat,
      }),
    ],
    exitOnError: false,
  });
}

type AuditEventType = 'audit:create' | 'audit:access' | 'audit:read' | 'audit:update' | 'audit:delete';

function getSysLogger(): winston.Logger {
  const { NAIS_APP_NAME } = process.env;

  const cefFormat = winston.format.printf(({ timestamp, message, auditType, suid, duid }) => {
    const { NAIS_APP_NAME } = process.env;
    return `CEF:0|AAP|${NAIS_APP_NAME}|1.0|${auditType || 'audit:access'}|Sporingslogg|INFO|suid=${suid} duid=${duid} end=${timestamp} msg=${message}`;
  });

  const transportSyslog = new winstonSyslog.Syslog({
    host: 'audit.nais',
    port: 6514,
    app_name: NAIS_APP_NAME,
    protocol: 'tcp',
    localhost: os.hostname(),
    eol: '\n', // Trengs for å kunne logge til rsyslog server
  });

  return winston.createLogger({
    levels: winston.config.syslog.levels,
    format: winston.format.combine(winston.format.timestamp({ format: () => Date.now().toString() }), cefFormat),
    transports: [new winston.transports.Console()],
  });
}

const auditLogger = getSysLogger();

export async function logAudit(message: string, type: AuditEventType, brukerId: string) {
  const token = await getValidatedToken();
  auditLogger.info(message, { auditType: type, suid: token.payload.NAVident, duid: brukerId });
}
