var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

const exec = __importStar(require('@actions/exec'));
const IS_WINDOWS = process.platform === 'win32';

module.exports = {
  wrappedExec: async function (commandString) {
    let powerShellPreamble = 'powershell -noprofile -noninteractive -executionpolicy bypass -command '
    if(IS_WINDOWS) {
      commandString = powerShellPreamble += commandString
    }
  
    await exec.exec(commandString)
  },

  IS_WINDOWS: IS_WINDOWS,

  __importStar: __importStar
};
