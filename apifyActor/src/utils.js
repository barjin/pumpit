const fetch = require('node-fetch');

/**
 * Converts angle size in degrees to radians.
 * @param {number} degrees Angle size in degrees
 * @returns Angle size in radians
 */
function toRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Calculates distance between two places on Earth from their coordinates.
 * @param {number} lat1 Latitude of the first place
 * @param {number} lon1 Longitude of the first place
 * @param {number} lat2 Latitude of the second place
 * @param {number} lon2 Longitude of the second place
 * @returns Distance in kilometers
 */
function distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function reverseGeocode(lat, lon) {
    const url = new URL('https://api.mapy.cz/rgeocode');
    url.searchParams.append('lon', lon);
    url.searchParams.append('lat', lat);

    return fetch(
        url.toString(), {
	        method: 'get',
	        headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:101.0) Gecko/20100101 Firefox/101.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,cs;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'cross-site',
            },
        },
    )
    .then((x) => x.text())
    .then((xml) => (xml.match(/label="([^"]+)"/) ?? [])[1]);
}

module.exports = {
    distance,
    reverseGeocode,
};
