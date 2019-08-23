"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};

Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require('@actions/exec'));
const io = __importStar(require('@actions/io'));
async function run() {
  try {
      let platform = core.getInput('platform');
      let agent_family = core.getInput('agent_family');
      let bundler_args = core.getInput('bundler_args');

      core.exportVariable('PUPPET_GEM_VERSION', core.getInput('puppet_gem_version'));

      console.log(`=== Install bundle ===`);
      await exec.exec('gem --version');
      await exec.exec('gem install bundler');
      await exec.exec('bundler -v');
      await exec.exec(`bundle install --jobs 4 --retry 2 ${bundler_args}`);

      console.log(`=== Provision ===`);
      await exec.exec(`bundle exec rake litmus:provision_list[${platform}]`);
      if (platform.match(/_deb/)) {
        await exec.exec('bundle exec bolt command run "apt-get update && apt-get install wget --yes" --inventoryfile inventory.yaml --nodes ssh_nodes');
      }
      await exec.exec(`bundle exec rake litmus:install_agent[${agent_family}]`);
      await exec.exec('bundle exec rake litmus:install_module');

      console.log(`=== Run Acceptance Tests ===`);
      await exec.exec(`bundle exec rake litmus:acceptance:parallel`);
  }
  catch (error) {
      core.setFailed(error.message);
  }
}
run();
