const Apify = require('apify');
const { distance } = require('./src/utils');

Apify.main(async () => {
    const requestList = await Apify.openRequestList(
        'pageList',
        [
            'http://www.pumpdroid.com/public/map?fuel=NATURAL95&days=30',
            'http://www.pumpdroid.com/public/map?fuel=DIESEL&days=30',
            'http://www.pumpdroid.com/public/map?fuel=LPG&days=30',
        ],
    );

    /** The old version of the dataset to be deleted. */
    const oldDataset = await Apify.openDataset('benziny');
    // We delete the contents of the old dataset. Otherwise, we would end up with a huge, growing table of (mostly) old data.
    await oldDataset.drop();

    /** A list collecting all the types of the gas stations. */
    let gasStations = [];

    const crawler = new Apify.CheerioCrawler({
        requestList,
        maxConcurrency: 50,
        handlePageFunction: async (context) => {
            /** Contents of the on-page `<script>` tag. */
            const script = context.$('script').get()[2].children[0].data;

            /** Lines from the script containing `addMarker(`. */
            const addMarkerLines = script.match(/addMarker\(.*/g);

            /** Our own definition of the `addMarker` function. */
            const addMarker = (company, note, updated, lt, ln, price) => {
                /** Type of fuel (from the current page URL). */
                const fuel = context.request.url.match(/fuel=(.*?)&/)[1];

                // We check whether we already register a gas station less than 50 meters from the new one.
                //  (we assume it's the same gas station, already registered with another fuel type)
                const index = gasStations.findIndex((e) => distance(e.lt, e.ln, lt, ln) < 0.05);

                // if there is such a gas station...
                if (index !== -1) {
                    gasStations[index] = {
                        ...gasStations[index], // we combine the old record
                        [`price_${fuel}`]: price, // with the price and update date for the new fuel type.
                        [`updated_${fuel}`]: updated,
                    };
                } else {
                    // If we haven't seen this gas station yet, we add it as a new one.
                    gasStations.push(
                        {
                            company,
                            note,
                            lt,
                            ln,
                            [`price_${fuel}`]: price,
                            [`updated_${fuel}`]: updated,
                        },
                    );
                }
            };

            /** `addMarker` lines as an executable code. */
            const funkce = new Function('addMarker', `var l = []; var m = []; var p = []; ${addMarkerLines.slice(1).join(' ')}`);
            // We run the `addMarker` lines with our own definition of addMarker (big brain move).
            funkce(addMarker);
        },
    });

    console.log('Starting the crawl.');

    // Until now, we were just defining the crawler (and what it should do).
    // Now, we finally run it.
    await crawler.run();

    /** A new Apify dataset. */
    const dataset = await Apify.openDataset('benziny');

    // We add the gas station data to the dataset.
    await dataset.pushData(gasStations);
    console.log('Crawl finished.');
});
