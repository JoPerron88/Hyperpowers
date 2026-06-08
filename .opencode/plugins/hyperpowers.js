// .opencode/plugins/hyperpowers.js
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const normalizePath = (p, homeDir) => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) normalized = path.join(homeDir, normalized.slice(2));
  else if (normalized === '~') normalized = homeDir;
  return path.resolve(normalized);
};

let _bootstrapCache = undefined;

export const HyperpowersPlugin = async ({ client, directory }) => {
  const homeDir = os.homedir();
  const skillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');

  const getBootstrapContent = () => {
    if (_bootstrapCache !== undefined) return _bootstrapCache;

    const standardPath = path.resolve(__dirname, '../../standard.md');
    if (!fs.existsSync(standardPath)) {
      _bootstrapCache = null;
      return null;
    }

    const standard = fs.readFileSync(standardPath, 'utf8');

    const toolMapping = `**Tool Mapping for OpenCode:**
Quand les skills référencent des outils Claude Code, utilise les équivalents OpenCode :
- \`TodoWrite\` → \`todowrite\`
- \`Task\` (sous-agents) → système de sous-agents OpenCode (@mention)
- \`Skill\` → outil natif \`skill\` d'OpenCode
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → tes outils natifs`;

    _bootstrapCache = `<HYPERPOWERS_STANDARD>
${standard}

${toolMapping}
</HYPERPOWERS_STANDARD>`;

    return _bootstrapCache;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('HYPERPOWERS_STANDARD'))) return;
      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    }
  };
};
