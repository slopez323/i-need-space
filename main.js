
let long;
let lat;
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

$('#search').on('click', function () {
    $('.error span').remove();
    $('.rise span').remove();
    $('.culmination span').remove();
    $('.set span').remove();

    getCoords();
});

async function getCoords() {
    let httpResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI($('#address').val())}.json?access_token=${$('#api-key').val()}`);
    httpResponse = await httpResponse.json();

    long = httpResponse.features[0].center[0];

    lat = httpResponse.features[0].center[1];

    getSatTime(long, lat);
};

async function getSatTime(long, lat) {
    let httpResponse = await fetch(`https://satellites.fly.dev/passes/${$('#norad').val()}?lat=${lat}&lon=${long}&limit=1&days=15&visible_only=true`);
    httpResponse = await httpResponse.json();
    if (httpResponse.error) {
        $('.output').hide();
        $('.error').append('<span>Data not found.</span>');
        $('#address').val('');
        $('#api-key').val('');
        $('#norad').val('');
        return;
    };
    let rise = new Date(httpResponse[0].rise.utc_datetime);
    let culm = new Date(httpResponse[0].culmination.utc_datetime);
    let set = new Date(httpResponse[0].set.utc_datetime);

    $('#satellite').text(`Satellite ${$('#norad').val()} at ${$('#address').val().toUpperCase()}`);

    $('.rise').append(`<span>${rise}</span>`);
    $('.culmination').append(`<span>${culm}</span>`);
    $('.set').append(`<span>${set}</span>`);

    $('.output').show();

    $('#address').val('');
    $('#api-key').val('');
    $('#norad').val('');
};