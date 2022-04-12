
let long;
let lat;
let loc;
let norad;

$('#search').on('click', function () {
    $('.error span').remove();
    $('.rise span').remove();
    $('.culmination span').remove();
    $('.set span').remove();

    norad = $('#norad').val();

    getCoords();
});

async function getCoords() {
    let httpResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI($('#address').val())}.json?access_token=${$('#api-key').val()}`);
    httpResponse = await httpResponse.json();
    if (httpResponse.message == 'Not Authorized - Invalid Token') {
        $('.error').append('<span>Invalid API Key.</span>')
        $('#api-key').val('');
    }
    console.log(httpResponse)

    if (httpResponse.features.length > 2) {
        for (let i = 0; i < 3; i++) {
            long = httpResponse.features[i].center[0];
            lat = httpResponse.features[i].center[1];
            loc = httpResponse.features[i].place_name;

            getSatTime(long, lat, loc, i);
        }
    } else {
        for (let i = 0; i < httpResponse.features.length; i++) {
            long = httpResponse.features[i].center[0];
            lat = httpResponse.features[i].center[1];
            loc = httpResponse.features[i].place_name;

            getSatTime(long, lat, loc, i);
        }
        for (let i = httpResponse.features.length; i < 3; i++) {
            $(`.carousel-item`).eq(i).hide();
        }
    }
};

async function getSatTime(long, lat, loc, i) {
    let httpResponse = await fetch(`https://satellites.fly.dev/passes/${norad}?lat=${lat}&lon=${long}&limit=1&days=15&visible_only=true`);
    httpResponse = await httpResponse.json();
    if (httpResponse.error) {
        $('.output').hide();
        if($('.error span').length == 0) {
            $('.error').append(`<span>Data not found for ${norad}.</span>`);
        };
        $('#norad').val('');
        return;
    };

    let rise = new Date(httpResponse[0].rise.utc_datetime);
    let culm = new Date(httpResponse[0].culmination.utc_datetime);
    let set = new Date(httpResponse[0].set.utc_datetime);

    $(`.satellite`).eq(i).text(`Satellite ${norad} at ${loc.toUpperCase()}`);

    $(`.rise`).eq(i).append(`<span>${rise}</span>`);
    $(`.culmination`).eq(i).append(`<span>${culm}</span>`);
    $(`.set`).eq(i).append(`<span>${set}</span>`);


    $('.output').show();

    $('#address').val('');
    $('#norad').val('');
};