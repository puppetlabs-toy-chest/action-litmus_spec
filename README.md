# Notice of no maintainership

This action is not further maintained. If you want to run litmus on Github Actions, please check out [the PDK templates](https://github.com/puppetlabs/pdk-templates/tree/main/moduleroot/.github/workflows).

# Action Litmus-Spec

This action was designed to allow running spec tests for Puppet modules. This will allow you to set up a matrix strategy in your Github Actions workflow to run the module's spec tests on multiple ruby versions and Puppet agent gem versions.

## Getting Started

In the following example from a Github Actions workflow, you can see a matrix setup for running all the different checks on a Puppet module using two ruby versions and two Puppet gem versions.

    jobs:
    
      Spec:
        runs-on: ubuntu-latest
        strategy:
          matrix:
            check: [parallel_spec, 'syntax lint metadata_lint check:symlinks check:git_ignore check:dot_underscore check:test_file rubocop']
            ruby_version: [2.4.x, 2.5.x]
            puppet_gem_version: [~> 5.0, ~> 6.0]
            exclude:
            - puppet_gem_version: ~> 5.0
              check: 'syntax lint metadata_lint check:symlinks check:git_ignore check:dot_underscore check:test_file rubocop'
            - ruby_version: 2.4.x
              puppet_gem_version: ~> 6.0
            - ruby_version: 2.5.x
              puppet_gem_version: ~> 5.0
    
        steps:
        - uses: actions/checkout@v1
        - uses: actions/setup-ruby@v1
          with:
            ruby_version: ${{matrix.ruby_version}}
        - name: Spec Tests
          uses: puppetlabs/action-litmus_spec@main
          with:
            puppet_gem_version: ${{ matrix.puppet_gem_version }}
            check: ${{ matrix.check }}
