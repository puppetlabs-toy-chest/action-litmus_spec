"use strict";

const util = require('./util');

Object.defineProperty(exports, "__esModule", { value: true });
const core = util.__importStar(require("@actions/core"));
async function run() {
  try {
      let bundler_args = core.getInput('bundler_args');
      let check = core.getInput('check')

      core.exportVariable('PUPPET_GEM_VERSION', core.getInput('puppet_gem_version'));

      console.log(`=== Install bundle ===`);
      if(util.IS_WINDOWS){
        await util.wrappedExec('git config --system core.longpaths true');
      }
      await util.wrappedExec('gem --version');
      await util.wrappedExec('gem install --user-install bundler');
      await util.wrappedExec('bundle -v');
      await util.wrappedExec(`bundle install --jobs 4 --retry 2 ${bundler_args}`);

      console.log(`=== Run Spec Tests ===`);
      await util.wrappedExec('bundle exec rake spec_prep');
      await util.wrappedExec(`bundle exec rake ${check}`);
  }
  catch (error) {
      core.setFailed(error.message);
  }
}
run();
