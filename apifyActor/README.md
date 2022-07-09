# PumpIt Apify Actor

This folder contains [Apify actor](https://docs.apify.com/actor) code for data collection.

The actor downloads the fresh daily data from the [pumpdroid.com](http://www.pumpdroid.com/public/lindex.html) website.

> NOTE: The data is crowd-sourced. We take no responsibility or liability, so far as legally possible, for any damages.

## Important files
- [`main.js`](./main.js) The main scraping code.
- [`utils.js`](./src/utils.js) Helper functions.

## Dataset
The freshest gas prices are stored in the dataset [here](https://api.apify.com/v2/datasets/KLHGYP6iynI82JxhC/items?clean=true&format=html).
