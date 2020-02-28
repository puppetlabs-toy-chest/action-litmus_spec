# Action Litmus-Spec

This action was designed to allow running spec tests for Puppet modules. This will allow you to set up a matrix strategy in your Github Actions workflow to run the module's spec tests on multiple ruby versions and Puppet agent gem versions.

## Getting Started

In the following example from a Github Actions workflow, you can see a matrix setup for running all the different checks on a Puppet module using two ruby versions and two Puppet gem versions.

    Spec:
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
    
        - name: Spec Tests
          uses: puppetlabs/action-litmus_spec@master
          with:
            puppet_gem_versionm: ${{ matrix.puppet_gem_version }}
            check: ${{ matrix.check }}
