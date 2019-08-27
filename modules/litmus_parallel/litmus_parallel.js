"use strict";
var path = require('path');
var utilPath = path.join(__dirname,'..','..','lib','util.js');
const util = require(utilPath);

Object.defineProperty(exports, "__esModule", { value: true });
const core = util.__importStar(require("@actions/core"));

async function run() {
  try {
      let platform = core.getInput('platform');
      let agent_family = core.getInput('agent_family');
      let bundler_args = core.getInput('bundler_args');

      core.exportVariable('PUPPET_GEM_VERSION', core.getInput('puppet_gem_version'));

      console.log(`=== Install bundle ===`);
      await util.wrappedExec('gem --version');
      await util.wrappedExec('gem install bundler');
      await util.wrappedExec('bundler -v');
      await util.wrappedExec(`bundle install --jobs 4 --retry 2 ${bundler_args}`);

      console.log(`=== Provision ===`);
      await util.wrappedExec(`bundle exec rake litmus:provision_list[${platform}]`);
      if (platform.match(/_deb/)) {
        await util.wrappedExec('bundle exec bolt command run "apt-get update && apt-get install wget --yes" --inventoryfile inventory.yaml --nodes ssh_nodes');
      }
      await util.wrappedExec(`bundle exec rake litmus:install_agent[${agent_family}]`);
      await util.wrappedExec('bundle exec rake litmus:install_module');

      console.log(`=== Run Acceptance Tests ===`);
      await util.wrappedExec(`bundle exec rake litmus:acceptance:parallel`);
  }
  catch (error) {
      core.setFailed(error.message);
  }
}
run();
