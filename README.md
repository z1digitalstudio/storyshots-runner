# z1digitalstudio/storyshots-runner

This repo provides a barebones Docker image based on Ubuntu 20.04 containing:

* [Ungoogled Chromium][ungoogled-chromium]
* [Mozilla Firefox][firefox]
* [Node.js][node]
* [Yarn v1][yarn] (so yarn v2 can be launched seamlessly)

This image is meant to execute "storyshot" tests with
[Storybook's `addon-storyshots-puppeteer`][addon-storyshots-puppeteer]. Since
the  browsers are already bundled with the Docker image,
[`puppeteer-core`][puppeteer-core] should be used instead of `puppeteer`, which
bundles its own copy of Chromium.

This setup is necessary to get a consistent result in CI machines and local
machines, otherwise [`jest-image-snapshot`][jest-image-snapshot], the library
used by `@storybook/addon-storyshots-puppeteer` under the hood, can report false
positives due to rendering differences between different builds of the same
browser.

This repo does not include any examples on how to set up
`@storybook/addon-storyshots-puppeteer`. Please refer to their documentation for
that.

At [Z1][z1] we're experimenting with the integration of storyshot tests into our
CI/CD workflows. In the future we hope to improve this repo with tools to reduce
the pain of working with storyshots, and a more "out of the box" setup.

[ungoogled-chromium]: https://github.com/Eloston/ungoogled-chromium
[firefox]: https://www.mozilla.org/en-US/firefox/
[node]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[addon-storyshots-puppeteer]: https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer
[puppeteer-core]: https://github.com/puppeteer/puppeteer/#puppeteer-core
[jest-image-snapshot]: https://github.com/americanexpress/jest-image-snapshot
[z1]: https://z1.digital/
